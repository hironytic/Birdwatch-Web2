import Immutable from "../stubs/immutable";
import Col from "react-bootstrap/lib/Col";
import Grid from "react-bootstrap/lib/Grid";
import Label from "react-bootstrap/lib/Label";
import ListGroup from "react-bootstrap/lib/ListGroup";
import ListGroupItem from "react-bootstrap/lib/ListGroupItem";
import React from "react";
import ReactDOM from "react-dom";
import Row from "react-bootstrap/lib/Row";
import Rx from "rx-lite-extras";

import { reloadProjectList } from "../actions/ProjectActions";

import ProjectDetail from "../components/ProjectDetail.jsx";

import LoadStatus from "../constants/LoadStatus";

import activityStore from "../stores/ActivityStore";
import platformMasterStore from "../stores/PlatformMasterStore";
import projectStore from "../stores/ProjectStore";

import { makeFragment } from "../utils/ActivityUtils";

export default class ProjectList extends React.Component {
  constructor(props) {
    super(props);
    
    this.disposeBag = new Rx.CompositeDisposable();
    
    this.state = {
      activityInfo: null,
      projectInfo: null,
      platformMaster: null,
    };
  }
  
  render() {
    if (this.state.projectInfo == null) {
      return <div />;
    }

    const activityPath = (this.state.activityInfo) ? this.state.activityInfo.get("activityPath") : null;
    const activeProjectId = (activityPath != null && activityPath.size > 1) ? activityPath.get(1) : null;

    const unknownPlatform = Immutable.Map({
      name: "",
    });
    
    const projectItems = this.state.projectInfo.get("projectList")
      .sortBy(project => {
        return (project.get("name") + " " + project.get("version") + " ").toLowerCase();
      })
      .map(project => {
        const projectId = project.get("id");
        const key = "prj" + projectId;
        const projectName = project.get("name");
        const projectVersion = project.get("version");
        const platformName = this.getPlatform(project.get("platformId"), unknownPlatform).get("name");
        const projectCode = project.get("projectCode");
        const header = (
          <span><strong>{projectName}</strong> <span>{projectVersion}</span> <Label bsStyle="warning">{platformName}</Label></span>
        );
        
        if (projectId == activeProjectId) {
          return (
            <ListGroupItem key={key}>
              <ProjectDetail projectId={projectId} />
            </ListGroupItem>
          );
        } else {
          const href = "#" + makeFragment(["project", projectId]);
          return (
            <ListGroupItem key={key} href={href} header={header}>
              {projectCode}
            </ListGroupItem>
          );
        }
      })
      .toArray()
    
    if (this.state.projectInfo.get("loadStatus") == LoadStatus.LOADING) {
      projectItems.push(
        <ListGroupItem key="loading">
          <div className="text-center">
            <img src="image/loading.gif"/>
          </div>
        </ListGroupItem>
      );
    }
    
    return (
      <Grid fluid>
        <Row>
          <Col xs={8} xsOffset={2}>
            <ListGroup>
              {projectItems}
            </ListGroup>
          </Col>
        </Row>
      </Grid>
    );
  }

  getPlatform(platformId, alt = null) {
    if (this.state.platformMaster == null) {
      return alt;
    }
    const platform = this.state.platformMaster.get(platformId);
    if (platform == null) {
      return alt;
    } else {
      return platform;
    }
  }

  componentDidMount() {
    this.disposeBag.add(
      activityStore
        .subscribe((info) => {
          this.setState({
            activityInfo: info,
          });
        })
    );
    
    this.disposeBag.add(
      projectStore
        .subscribe(project => {
          const loadStatus = project.get("loadStatus");
          const projectList = project.get("projects")
            .toList()

          this.setState({
            projectInfo: Immutable.Map({ loadStatus, projectList }),
          });        
        })
    );
    
    this.disposeBag.add(
      platformMasterStore
        .map(value => value.get("items"))
        .subscribe(platformMaster => {
          this.setState({
            platformMaster: platformMaster,
          });
        })
    );
      
    reloadProjectList();
  }
  
  componentWillUnmount() {
    this.disposeBag.dispose();
  }  
}

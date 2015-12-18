import Immutable from "../stubs/immutable";
import Col from "react-bootstrap/lib/Col";
import Grid from "react-bootstrap/lib/Grid";
import Label from "react-bootstrap/lib/Label";
import ListGroup from "react-bootstrap/lib/ListGroup";
import ListGroupItem from "react-bootstrap/lib/ListGroupItem";
import moment from "moment";
import React from "react";
import ReactDOM from "react-dom";
import Row from "react-bootstrap/lib/Row";
import Rx from "rx-lite";

import { reloadTimeline } from "../actions/TimelineActions";

import LoadStatus from "../constants/LoadStatus";

import milestoneMasterStore from "../stores/MilestoneMasterStore";
import platformMasterStore from "../stores/PlatformMasterStore";
import projectStore from "../stores/ProjectStore";
import timelineStore from "../stores/TimelineStore";

export default class Timeline extends React.Component {
  constructor(props) {
    super(props);
    
    this.timelineSubscription = null;
    this.projectSubscription = null;
    this.platformMasterSubscription = null;
    this.milestoneMasterSubscription = null;
    
    this.state = {
      timelineInfo: null,
      projectInfo: null,
      platformMaster: null,
      milestoneMaster: null,
    };
  }
  
  render() {
    if (this.state.timelineInfo == null) {
      return (<div />);
    }
    
    return (
      <Grid fluid>
        <Row>
          <Col xs={8} xsOffset={2}>
            <ListGroup>
                {this.renderTimelineList()}
            </ListGroup>
          </Col>
        </Row>
      </Grid>
    );
  }
  
  renderTimelineList() {
    if (this.state.timelineInfo.get("loadStatus") == LoadStatus.LOADING) {
      return (
        <ListGroupItem key="loading">
          <div className="text-center">
            <img src="image/loading.gif"/>
          </div>
        </ListGroupItem>
      );
    } else {
      const today = moment();
      today.hour(0);
      today.minute(0);
      today.second(0);
      const timelineList = this.state.timelineInfo.get("timeline").map((item) => {
        const itemId = item.get("id");
        const projectId = item.get("projectId");
        let projectName = projectId;
        let projectVersion = "";
        let projectPlatform = "";
        let projectCode = "";
        let milestoneName = "";
        if (this.state.projectInfo != null) {
          const project = this.state.projectInfo.get(projectId);
          if (project != null) {
            projectName = project.get("name");
            projectVersion = project.get("version");
            if (this.state.platformMaster != null) {
              const platform = this.state.platformMaster.get(project.get("platformId"));
              if (platform != null) {
                projectPlatform = platform.get("name");
              }
            }
          }
        }
        if (this.state.milestoneMaster != null) {
          const milestone = this.state.milestoneMaster.get(item.get("milestoneId"));
          if (milestone != null) {
            milestoneName = milestone.get("name");
          }
        }
        const internalMoment = moment(item.get("internalDate"));
        let dateString = item.get("dateString");
        if (dateString == "") {
          dateString = internalMoment.format("M/D");
        }
        return (
          <ListGroupItem key={"id_" + itemId}>
            <Grid fluid>
              <Row>
                <Col xs={8}>
                  <strong>{projectName}</strong> <span>{projectVersion}</span> <Label bsStyle="warning">{projectPlatform}</Label>
                </Col>
                <Col xs={4} className="text-right">
                  {internalMoment.from(today)}
                </Col>
              </Row>
              <Row>
                <Col xs={8}>
                  {projectCode}
                </Col>
                <Col xs={4} className="text-right">
                  {milestoneName}:{dateString}
                </Col>
              </Row>              
            </Grid>
          </ListGroupItem>
        );
      }).toArray();
      return timelineList;
    }    
  }
  
  componentDidMount() {
    this.timelineSubscription = timelineStore
      .subscribe(timeline => {
        this.setState({
          timelineInfo: timeline,
        });
      })
    
    this.projectSubscription = projectStore
      .subscribe(project => {
        this.setState({
          projectInfo: project,
        });        
      })
    
    this.platformMasterSubscription = platformMasterStore
      .map(value => value.get("items"))
      .subscribe(platformMaster => {
        this.setState({
          platformMaster: platformMaster,
        });
      })
      
    this.milestoneMasterSubscription = milestoneMasterStore
    .map(value => value.get("items"))
    .subscribe(milestoneMaster => {
      this.setState({
        milestoneMaster: milestoneMaster,
      });
    })

    reloadTimeline();
  }
  
  componentWillUnmount() {
    if (this.timelineSubscription != null) {
      this.timelineSubscription.dispose();
      this.timelineSubscription = null;
    }
    
    if (this.projectSubscription != null) {
      this.projectSubscription.dispose();
      this.projectSubscription = null;
    }
    
    if (this.platformMasterSubscription != null) {
      this.platformMasterSubscription.dispose();
      this.platformMasterSubscription = null;
    }
    
    if (this.milestoneMasterSubscription != null) {
      this.milestoneMasterSubscription.dispose();
      this.milestoneMasterSubscription = null;
    }
  }
}

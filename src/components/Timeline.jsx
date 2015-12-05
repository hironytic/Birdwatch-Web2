import Immutable from "immutable";
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

import { reloadTimeline } from "../actions/TimelineActions"

import platformMasterStore from "../stores/PlatformMasterStore";
import projectStore from "../stores/ProjectStore";
import timelineStore from "../stores/TimelineStore";

export default class Timeline extends React.Component {
  constructor(props) {
    super(props);
    
    this.timelineSubscription = null;
    
    this.state = {
      timelineInfo: null,
      projectInfo: null,
      platformMaster: null,
    };
    
    // this.debug = 0;
  }
  
  render() {
    // console.log("render" + (++this.debug));
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
    if (this.state.timelineInfo.get("loading")) {
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
        let milestone = "";
        if (this.state.projectInfo != null) {
          const project = this.state.projectInfo.get(projectId);
          if (project != null) {
            projectName = project.get("name");
            projectVersion = project.get("version");
            // if (this.state.platformMaster != null) {
            //   const platform = this.state.platformMaster.get(project.get("platformId"));
            //   if (platform != null) {
            //     projectPlatform = platform.get("")
            //   }
            // }
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
                  {milestone}:{dateString}
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
    this.timelineSubscription = Rx.Observable.combineLatest([timelineStore, projectStore, platformMasterStore], (timeline, project, platformMaster) => {
      return {
        timelineInfo: timeline,
        projectInfo: project,
        platformMaster: platformMaster,
      };
    })
      .subscribe((updateState) => {
        // console.log("setState" + (++this.debug), Immutable.fromJS(updateState).toJS());
        this.setState(updateState);
      });
    
    reloadTimeline();
  }
  
  componentWillUnmount() {
    if (this.timelineSubscription != null) {
      this.timelineSubscription.dispose();
      this.timelineSubscription = null;
    }
  }  
}

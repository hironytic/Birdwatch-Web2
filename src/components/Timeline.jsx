import moment from "moment";
import React from "react";
import ReactDOM from "react-dom";
import Col from "react-bootstrap/lib/Col";
import Grid from "react-bootstrap/lib/Grid";
import Label from "react-bootstrap/lib/Label";
import ListGroup from "react-bootstrap/lib/ListGroup";
import ListGroupItem from "react-bootstrap/lib/ListGroupItem";
import Row from "react-bootstrap/lib/Row";

import { reloadTimeline } from "../actions/TimelineActions"

import timelineStore from "../stores/TimelineStore";

export default class Timeline extends React.Component {
  constructor(props) {
    super(props);
    
    this.timelineSubscription = null;
    
    this.state = {
      timelineInfo: null,
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
                  {projectId}
                </Col>
                <Col xs={4} className="text-right">
                  {dateString}
                </Col>
              </Row>
            </Grid>
          </ListGroupItem>
        );
        
        // var project = projectMilestone.getProject();
        // var milestone = projectMilestone.getMilestone();
        // var internalDate = projectMilestone.getInternalDate();
        // var internalMoment = moment(internalDate);
        // var dateString = projectMilestone.getDateString();
        // if (dateString == "") {
        //   dateString = internalMoment.format("M/D");
        // }
        // 
        // return (
        //   <ListGroupItem key={"id_" + projectMilestone.id}>
        //     <Grid fluid>
        //       <Row>
        //         <Col xs={8}>
        //           <strong>{project.getName()}</strong> <span>{project.getVersion()}</span> <Label bsStyle="warning">{project.getPlatform().getName()}</Label>
        //         </Col>
        //         <Col xs={4} className="text-right">
        //           {internalMoment.from(today)}
        //         </Col>
        //       </Row>
        //       <Row>
        //         <Col xs={8}>
        //           {project.getProjectCode()}
        //         </Col>
        //         <Col xs={4} className="text-right">
        //           {milestone.getName()}:{dateString}
        //         </Col>
        //       </Row>
        //     </Grid>
        //   </ListGroupItem>
        // );
      }).toArray();
      return timelineList;
    }    
  }
  
  componentDidMount() {
    this.timelineSubscription = timelineStore.subscribe((timelineInfo) => {
      this.setState({
        timelineInfo: timelineInfo,
      });
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

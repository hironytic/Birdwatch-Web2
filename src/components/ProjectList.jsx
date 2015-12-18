import React from "react";
import ReactDOM from "react-dom";
import Rx from "rx-lite-extras";

import { reloadProjectList } from "../actions/ProjectActions";

import platformMasterStore from "../stores/PlatformMasterStore";
import projectStore from "../stores/ProjectStore";

export default class ProjectList extends React.Component {
  constructor(props) {
    super(props);
    
    this.projectSubscription = null;
    this.platformMasterSubscription = null;
    
    this.state = {
      projectInfo: null,
      platformMaster: null,
    };
  }
  
  render() {
    return (<div />);
  }

  componentDidMount() {
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
      
    reloadProjectList();
  }
  
  componentWillUnmount() {
    if (this.projectSubscription != null) {
      this.projectSubscription.dispose();
      this.projectSubscription = null;
    }
    
    if (this.platformMasterSubscription != null) {
      this.platformMasterSubscription.dispose();
      this.platformMasterSubscription = null;
    }    
  }  
}

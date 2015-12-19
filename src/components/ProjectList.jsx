import React from "react";
import ReactDOM from "react-dom";
import Rx from "rx-lite-extras";

import { reloadProjectList } from "../actions/ProjectActions";

import platformMasterStore from "../stores/PlatformMasterStore";
import projectStore from "../stores/ProjectStore";

export default class ProjectList extends React.Component {
  constructor(props) {
    super(props);
    
    this.disposeBag = new Rx.CompositeDisposable();
    
    this.state = {
      projectInfo: null,
      platformMaster: null,
    };
  }
  
  render() {
    return (<div />);
  }

  componentDidMount() {
    this.disposeBag.add(
      projectStore
        .subscribe(project => {
          this.setState({
            projectInfo: project,
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

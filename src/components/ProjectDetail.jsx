import React from "react";
import ReactDOM from "react-dom";

export default class ProjectDetail extends React.Component {
  constructor(props) {
    super(props);
  }
  
  render() {
    return (<div>{this.props.projectId}</div>);
  }  
}

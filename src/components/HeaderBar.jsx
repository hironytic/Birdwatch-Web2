import React from "react";
import ReactDOM from "react-dom";
import Nav from "react-bootstrap/lib/Nav";
import Navbar from "react-bootstrap/lib/Navbar";
import NavBrand from "react-bootstrap/lib/NavBrand";
import NavItem from "react-bootstrap/lib/NavItem";

import * as AuthActions from "../actions/AuthActions";

import * as ActivityUtils from "../utils/ActivityUtils";

export default class HeaderBar extends React.Component {
  constructor(props) {
    super(props);
    
    this.authStateSubscription = null;
    
    this.state = {
      activityInfo: null,
      authState: null,
    };
  }
  
  render() {
    var userSignedIn = true;  // TODO
    var activity = this.getActivity();
    return (
      <Navbar fluid>
        <NavBrand>Birdwatch</NavBrand>
        <Nav bsStyle="pills" activeKey={activity} onSelect={this.handleNavSelect.bind(this)}>
          <NavItem eventKey="timeline" disabled={!userSignedIn}>タイムライン</NavItem>
          <NavItem eventKey="project" disabled={!userSignedIn}>プロジェクト管理</NavItem>
        </Nav>
        <Nav right>
          {(() => {
            if (this.state.authState != null) {
              return this.state.authState.get("status");
            } else {
              return "";
            }
          })()}
        </Nav>
      </Navbar>
    );
  }
  
  componentDidMount() {
    this.activitySubscription = this.props.activityStore.getActivitySource()
    .subscribe((info) => {
      this.setState({
        activityInfo: info,
      });
    });
    
    this.authStateSubscription = this.props.authStateStore.getSource()
    .subscribe((authState) => {
      this.setState({
        authState: authState,
      });
    });
  }
  
  componentWillUnmount() {
    if (this.activitySubscription != null) {
      this.activitySubscription.dispose();
      this.activitySubscription = null;
    }
    
    if (this.authStateSubscription != null) {
      this.authStateSubscription.dispose();
      this.authStateSubscription = null;
    }
  }
  
  handleNavSelect(selectedKey) {
    if (this.getActivity() == selectedKey) {
      return;
    }    
    window.location.href = "#" + ActivityUtils.makeFragment(selectedKey, null);
  }
  
  getActivity() {
    var activity = null;
    var activityInfo = this.state.activityInfo;
    if (activityInfo != null) {
      activity = this.state.activityInfo.get("activity");
    }
    return activity;
  }
}

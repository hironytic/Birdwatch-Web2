import React from "react";
import ReactDOM from "react-dom";
import NavDropdown from "react-bootstrap/lib/NavDropdown";
import MenuItem from "react-bootstrap/lib/MenuItem";
import Nav from "react-bootstrap/lib/Nav";
import Navbar from "react-bootstrap/lib/Navbar";
import NavBrand from "react-bootstrap/lib/NavBrand";
import NavItem from "react-bootstrap/lib/NavItem";

import * as AuthActions from "../actions/AuthActions";

import ActivityStore from "../stores/ActivityStore";
import AuthStateStore from "../stores/AuthStateStore";

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
    var activity = this.getActivity();
    return (
      <Navbar fluid>
        <NavBrand>Birdwatch</NavBrand>
        <Nav bsStyle="pills" activeKey={activity} onSelect={this.handleNavSelect.bind(this)}>
          <NavItem eventKey="timeline">タイムライン</NavItem>
          <NavItem eventKey="project">プロジェクト管理</NavItem>
        </Nav>
        <Nav right>
          {this.renderUserMenu()}
        </Nav>
      </Navbar>
    );
  }
  
  renderUserMenu() {
    if (!this.isSignedIn()) {
      return "";
    }
    return (
      <NavDropdown title={this.state.authState.get("user").get("username")} id="basic-nav-dropdown">
        <MenuItem onSelect={this.handleSignOut.bind(this)}>サインアウト</MenuItem>
      </NavDropdown>      
    );
  }
  
  componentDidMount() {
    this.activitySubscription = ActivityStore.subscribe((info) => {
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
  
  handleSignOut() {
    AuthActions.signOut();
  }

  getActivity() {
    var activity = null;
    var activityInfo = this.state.activityInfo;
    if (activityInfo != null) {
      activity = this.state.activityInfo.get("activity");
    }
    return activity;
  }
  
  isSignedIn() {
    var authState = this.state.authState;    
    if (authState == null) {
      return false;
    }
    return authState.get("status") == AuthStateStore.Status.SIGNED_IN;
  }
}

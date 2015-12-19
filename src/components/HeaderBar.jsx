import NavDropdown from "react-bootstrap/lib/NavDropdown";
import MenuItem from "react-bootstrap/lib/MenuItem";
import Nav from "react-bootstrap/lib/Nav";
import Navbar from "react-bootstrap/lib/Navbar";
import NavBrand from "react-bootstrap/lib/NavBrand";
import NavItem from "react-bootstrap/lib/NavItem";
import React from "react";
import ReactDOM from "react-dom";
import Rx from "rx-lite-extras";

import * as AuthActions from "../actions/AuthActions";

import AuthStatus from "../constants/AuthStatus";

import activityStore from "../stores/ActivityStore";
import authStateStore from "../stores/AuthStateStore";

import * as ActivityUtils from "../utils/ActivityUtils";

export default class HeaderBar extends React.Component {
  constructor(props) {
    super(props);
    
    this.disposeBag = new Rx.CompositeDisposable();
    
    this.state = {
      activityInfo: null,
      authState: null,
    };
  }
  
  render() {
    const activity = this.getActivity();
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
    this.disposeBag.add(
      activityStore
        .subscribe((info) => {
        this.setState({
          activityInfo: info,
        });
      })
    );
    
    this.disposeBag.add(
      authStateStore
        .subscribe((authState) => {
        this.setState({
          authState: authState,
        });
      })
    );
  }
  
  componentWillUnmount() {
    this.disposeBag.dispose();
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
    let activity = null;
    const activityInfo = this.state.activityInfo;
    if (activityInfo != null) {
      activity = activityInfo.get("activity");
    }
    return activity;
  }
  
  isSignedIn() {
    const authState = this.state.authState;
    if (authState == null) {
      return false;
    }
    return authState.get("status") == AuthStatus.SIGNED_IN;
  }
}

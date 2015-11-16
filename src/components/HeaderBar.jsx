import React from "react";
import ReactDOM from "react-dom";
import Nav from "react-bootstrap/lib/Nav";
import Navbar from "react-bootstrap/lib/Navbar";
import NavBrand from "react-bootstrap/lib/NavBrand";
import NavItem from "react-bootstrap/lib/NavItem";

export default class HeaderBar extends React.Component {
  constructor(props) {
    super(props);
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
        {
        // <Nav right>
        //   {this.renderUserMenu()}
        // </Nav>
        }
      </Navbar>
    );
  }
  
  handleNavSelect(selectedKey) {
    if (this.getActivity() == selectedKey) {
      return;
    }
    
    window.location.href = "#/" + selectedKey;
  }
  
  getActivity() {
    var activity = null;
    var activityInfo = this.props.activityInfo;
    if (activityInfo != null) {
      activity = this.props.activityInfo.get("activity");
    }
    return activity;
  }
}

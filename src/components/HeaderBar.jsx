import React from "react";
import ReactDOM from "react-dom";
import Navbar from "react-bootstrap/lib/Navbar";
import NavBrand from "react-bootstrap/lib/NavBrand";

export default class HeaderBar extends React.Component {
  constructor(props) {
    super(props);
  }
  
  render() {
    return (
      <Navbar fluid>
        <NavBrand>Birdwatch</NavBrand>
      {
        // <Nav bsStyle="pills" activeKey={activeKey} onSelect={this.handleNavSelect}>
        //   <NavItem eventKey="timeline" disabled={!userSignedIn}>タイムライン</NavItem>
        //   <NavItem eventKey="project" disabled={!userSignedIn}>プロジェクト管理</NavItem>
        // </Nav>
        // <Nav right>
        //   {this.renderUserMenu()}
        // </Nav>
      }
      </Navbar>
    );
  }
}

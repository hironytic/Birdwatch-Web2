import React from "react";
import ReactDOM from "react-dom";

import ErrorList from "../components/ErrorList.jsx";
import HeaderBar from "../components/HeaderBar.jsx";
import Signin from "../components/Signin.jsx";
import Timeline from "../components/Timeline.jsx";

import AuthStatus from "../constants/AuthStatus";

import activityStore from "../stores/ActivityStore";
import authStateStore from "../stores/AuthStateStore";

export default class App extends React.Component {
  constructor(props) {
    super(props);
    
    this.activitySubscription = null;
    this.authStateSubscription = null;
    
    this.state = {
      activityInfo: null,
      authState: null,
    };    
  }
  
  render() {
    return (
      <div>
        <HeaderBar />
        <ErrorList />
        {this.renderActivity()}
      </div>
    );
  }
  
  renderActivity() {
    if (this.state.authState == null) {
      return "";
    }
    if (this.state.authState.get("status") != AuthStatus.SIGNED_IN) {
      return (
        <Signin />
      );
    } else if (this.state.activityInfo != null) {
      const activity = this.state.activityInfo.get("activity");
      switch (activity) {
        case "timeline":
          return (<Timeline />);
        default:
          return "";
      }
    } else {
      return "";
    }
  }
  
  componentDidMount() {
    this.activitySubscription = activityStore.subscribe((info) => {
      this.setState({
        activityInfo: info,
      });
    });
    
    this.authStateSubscription = authStateStore.subscribe((authState) => {
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
}

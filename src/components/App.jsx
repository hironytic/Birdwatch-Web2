import React from "react";
import ReactDOM from "react-dom";
import Rx from "rx-lite-extras";

import { reloadFamilyMaster } from "../actions/FamilyMasterActions";
import { reloadMilestoneMaster } from "../actions/MilestoneMasterActions";
import { reloadPlatformMaster } from "../actions/PlatformMasterActions";

import ErrorList from "../components/ErrorList.jsx";
import HeaderBar from "../components/HeaderBar.jsx";
import ProjectList from "../components/ProjectList.jsx";
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
    this.signInSubscription = null;
    
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
        case "project":
          return (<ProjectList />);
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
    
    // サインインしたらマスターをロードしておく
    this.signInSubscription = authStateStore
      .map(value => value.get("status"))
      .distinctUntilChanged()
      .subscribe(status => {
        if (status == AuthStatus.SIGNED_IN) {
          reloadMilestoneMaster();
          reloadPlatformMaster();
          reloadFamilyMaster();
        }
      })
  }
  
  componentWillUnmount() {
    if (this.signInSubscription != null) {
      this.signInSubscription.dispose();
      this.signInSubscription = null;
    }
    
    if (this.authStateSubscription != null) {
      this.authStateSubscription.dispose();
      this.authStateSubscription = null;
    }
    
    if (this.activitySubscription != null) {
      this.activitySubscription.dispose();
      this.activitySubscription = null;
    }
  }
}

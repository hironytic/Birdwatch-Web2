import React from "react";
import ReactDOM from "react-dom";

import ErrorList from "../components/ErrorList.jsx";
import HeaderBar from "../components/HeaderBar.jsx";
import Signin from "../components/Signin.jsx";

import AuthStatus from "../constants/AuthStatus";

import ActivityStore from "../stores/ActivityStore";
import AuthStateStore from "../stores/AuthStateStore";

// --- 
import FamilyMasterStore from "../stores/FamilyMasterStore";
import MilestoneMasterStore from "../stores/MilestoneMasterStore";
import PlatformMasterStore from "../stores/PlatformMasterStore";
import * as FamilyMasterActions from "../actions/FamilyMasterActions";
// ---

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
        <button onClick={(e) => {
          FamilyMasterStore.subscribe((x) => {
            console.log("subscribed: " + x.toString());
          });
        }}>subscribe</button>
        <button onClick={(e) => {
          FamilyMasterActions.reload();
        }}>load</button>
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
    } else {
      var activity = "";
      if (this.state.activityInfo != null) {
        activity = this.state.activityInfo.get("activity");
      }
      return (
        <div>{activity}</div>
      );
    }
  }
  
  componentDidMount() {
    this.activitySubscription = ActivityStore.subscribe((info) => {
      this.setState({
        activityInfo: info,
      });
    });
    
    this.authStateSubscription = AuthStateStore.subscribe((authState) => {
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

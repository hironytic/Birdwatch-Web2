import React from "react";
import ReactDOM from "react-dom";

import HeaderBar from "../components/HeaderBar.jsx";

import ActivityStore from "../stores/ActivityStore";
import AuthStateStore from "../stores/AuthStateStore";

// test
import * as AuthActions from "../actions/AuthActions";

export default class App extends React.Component {
  constructor(props) {
    super(props);
    
    this.activitySubscription = null;
    this.authStateSubscription = null;
    
    var fragment = "";
    var url = window.location.href;
    var fragmentIx = url.indexOf("#");
    if (fragmentIx >= 0) {
      fragment = url.substring(fragmentIx + 1);
    }    
    this.appParams = {
      activityStore: new ActivityStore(fragment),
      authStateStore: new AuthStateStore(),
    };
    this.state = {
      activityInfo: null,
      authState: null,
    };    
  }
  
  render() {
    return (
      <div>
        <HeaderBar {...this.appParams} />
        {this.renderActivity()}
      </div>
    );
  }
  
  renderActivity() {
    if (this.state.authState == null) {
      return "";
    }
    if (this.state.authState.get("status") != AuthStateStore.Status.SIGNED_IN) {
      return (
        <button onClick={(e) => {
          AuthActions.signIn("hoge", "foo");
        }}>sign in</button>
      )
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
    this.activitySubscription = this.appParams.activityStore.getActivitySource()
    .subscribe((info) => {
      this.setState({
        activityInfo: info,
      });
    });
    
    this.authStateSubscription = this.appParams.authStateStore.getSource()
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
}

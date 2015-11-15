import React from "react";
import ReactDOM from "react-dom";

import HeaderBar from "../components/HeaderBar.jsx";

import ActivityStore from "../stores/ActivityStore";

export default class App extends React.Component {
  constructor(props) {
    super(props);
    
    var fragment = "";
    var url = window.location.href;
    var fragmentIx = url.indexOf("#");
    if (fragmentIx >= 0) {
      fragment = url.substring(fragmentIx + 1);
    }    
    this.activityStore = new ActivityStore(fragment);
    this.activitySubscription = null;
    
    this.state = {
      activityInfo: null,
    };
  }
  
  render() {
    var activity = "";
    if (this.state.activityInfo != null) {
      activity = this.state.activityInfo.get("activity");
    }
    return (
      <div>
        <HeaderBar {...this.state}/>
        <div>{activity}</div>
      </div>
    );
  }
  
  componentDidMount() {
    this.activitySubscription = this.activityStore.getActivitySource()
    .subscribe((info) => {
      this.setState({
        activityInfo: info,
      });
    });
  }
  
  componentWillUnmount() {
    if (this.activitySubscription != null) {
      this.activitySubscription.dispose();
      this.activitySubscription = null;
    }
  }
}

import React from "react";
import ReactDOM from "react-dom";
import Rx from "rx-lite";
//import moment from "moment";
//import "moment/locale/ja";

import * as ActivityActions from "./actions/ActivityActions";

import App from "./components/App.jsx";

function notifyActivityChanged() {
  let fragment = null;
  let url = window.location.href;
  let fragmentIx = url.indexOf("#");
  if (fragmentIx >= 0) {
    fragment = url.substring(fragmentIx + 1);
  }
  ActivityActions.activityChanged(fragment);  
}

ReactDOM.render(<App/>, document.getElementById("app-content"));

notifyActivityChanged();
Rx.Observable.fromEvent(window, "hashchange")
.subscribe(() => {
  notifyActivityChanged();
});

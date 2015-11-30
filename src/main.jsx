import Parse from "parse";
import React from "react";
import ReactDOM from "react-dom";
import Rx from "rx-lite";
//import moment from "moment";
//import "moment/locale/ja";

import * as ActivityActions from "./actions/ActivityActions";

import App from "./components/App.jsx";

Parse.initialize("(applicationId)", "(javaScriptKey)");

ReactDOM.render(<App/>, document.getElementById("app-content"));

let url = window.location.href;
let fragmentIx = url.indexOf("#");
if (fragmentIx >= 0) {
  let fragment = url.substring(fragmentIx + 1);
  ActivityActions.activityChanged(fragment);
}

Rx.Observable.fromEvent(window, "hashchange")
.subscribe(() => {
  let fragment = null;
  let url = window.location.href;
  let fragmentIx = url.indexOf("#");
  if (fragmentIx >= 0) {
    fragment = url.substring(fragmentIx + 1);
  }
  ActivityActions.activityChanged(fragment);
});

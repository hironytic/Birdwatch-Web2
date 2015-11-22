import React from "react";
import ReactDOM from "react-dom";
import Rx from "rx-lite";
//import moment from "moment";
//import "moment/locale/ja";

import * as ActivityActions from "./actions/ActivityActions";

import App from "./components/App.jsx";

ReactDOM.render(<App/>, document.getElementById("app-content"));

Rx.Observable.fromEvent(window, "hashchange")
.subscribe(() => {
  var fragment = null;
  var url = window.location.href;
  var fragmentIx = url.indexOf("#");
  if (fragmentIx >= 0) {
    fragment = url.substring(fragmentIx + 1);
  }
  ActivityActions.activityChanged(fragment);
});

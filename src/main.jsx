import React from "react";
import ReactDOM from "react-dom";
import Rx from "rx-lite";
//import moment from "moment";
//import "moment/locale/ja";

import "./actions/Actions";
import * as ActivityActions from "./actions/ActivityActions";
import App from "./components/App.jsx";

function notifyActivityChanged() {
  let fragment = null;
  const url = window.location.href;
  const fragmentIx = url.indexOf("#");
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

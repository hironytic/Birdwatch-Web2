import React from "react";
import ReactDOM from "react-dom";
import Rx from "rx-lite";
//import moment from "moment";
//import "moment/locale/ja";

import "./actions/Actions";
import { activityChanged } from "./actions/ActivityActions";
import AuthenticationService from "./auth/AuthenticationService";
import App from "./components/App.jsx";
import DatabaseService from "./database/DatabaseService";
import { initFlux } from "./flux/Flux";
import "./stores/Stores";

function notifyActivityChanged() {
  let fragment = null;
  const url = window.location.href;
  const fragmentIx = url.indexOf("#");
  if (fragmentIx >= 0) {
    fragment = url.substring(fragmentIx + 1);
  }
  activityChanged(fragment);
}

initFlux({
  auth: new AuthenticationService(),
  db: new DatabaseService(),
});
ReactDOM.render(<App/>, document.getElementById("app-content"));

notifyActivityChanged();
Rx.Observable.fromEvent(window, "hashchange")
.subscribe(() => {
  notifyActivityChanged();
});

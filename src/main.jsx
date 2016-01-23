import React from "react";
import ReactDOM from "react-dom";
import Rx from "rx-lite";
//import moment from "moment";
//import "moment/locale/ja";

import "./actions/Actions";
import { activityChanged } from "./actions/ActivityActions";
import App from "./components/App.jsx";
import Database from "./database/Database";
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
  db: new Database(),
});
ReactDOM.render(<App/>, document.getElementById("app-content"));

notifyActivityChanged();
Rx.Observable.fromEvent(window, "hashchange")
.subscribe(() => {
  notifyActivityChanged();
});

import Rx from "rx-lite";
import Immutable from "immutable";

import * as ActivityActions from "../actions/ActivityActions";

export default class ActivityStore {
  constructor(fragment) {
    this.activitySource = ActivityActions.activityChanged
    .map((fragment) => this.parseFragment(fragment))
    .startWith(this.parseFragment(fragment))
    .shareReplay(1);
  }

  getActivitySource() {
    return this.activitySource;
  }
  
  parseFragment(fragment) {
    var activity = null;
    var params = {};
    
    if (fragment != null && fragment != "") {
      var comps = fragment.split("/");
      activity = comps[0];
      for (var ix = 1; ix < comps.length; ix++) {
        params["$" + ix.toString()] = comps[ix];   // FIXME: decode parameter
      }
    }
    return Immutable.Map({
      activity: activity,
      params: Immutable.Map(params),
    });
  }
}

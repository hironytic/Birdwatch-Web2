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
    var activity = "timeline";
    var params = {};
    
    if (fragment != null && fragment != "") {
      var comps = fragment.split("/");
      if (comps.length > 1) {
        activity = comps[1];
        for (var ix = 2; ix < comps.length; ix++) {
          params["$" + (ix - 1).toString()] = comps[ix];   // FIXME: decode parameter
        }
      }
    }
    return Immutable.Map({
      activity: activity,
      params: Immutable.Map(params),
    });
  }
}

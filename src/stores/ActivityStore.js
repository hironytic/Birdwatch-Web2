import Rx from "rx-lite";
import Immutable from "immutable";

import * as ActivityActions from "../actions/ActivityActions";

import * as ActivityUtils from "../utils/ActivityUtils";

export default class ActivityStore {
  constructor(fragment) {
    this.activitySource = ActivityActions.activityChangeSource
    .map((fragment) => this.parseFragment(fragment))
    .startWith(this.parseFragment(fragment))
    .shareReplay(1);
  }

  getActivitySource() {
    return this.activitySource;
  }
  
  parseFragment(fragment) {
    var result = ActivityUtils.parseFragment(fragment);
    if (result.get("activity") == null) {
      result = Immutable.Map({
        activity: "timeline",
        params: Immutable.Map(),
      });
    }
    return result;
  }
}

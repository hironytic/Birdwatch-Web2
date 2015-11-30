import Rx from "rx-lite";
import Immutable from "immutable";

import * as ActivityActions from "../actions/ActivityActions";

import * as ActivityUtils from "../utils/ActivityUtils";

function parseFragment(fragment) {
  var result = ActivityUtils.parseFragment(fragment);
  if (result.get("activity") == null) {
    result = Immutable.Map({
      activity: "timeline",
      params: Immutable.Map(),
    });
  }
  return result;
}

export default ActivityActions.activityChangeSource
.map((fragment) => parseFragment(fragment))
.shareReplay(1);

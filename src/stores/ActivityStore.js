import Rx from "rx-lite";
import Immutable from "../stubs/immutable";

import { activityChangeAction } from "../actions/ActivityActions";

import * as ActivityUtils from "../utils/ActivityUtils";

import { createStore } from "../utils/FluxUtils";

function parseFragment(fragment) {
  let result = ActivityUtils.parseFragment(fragment);
  if (result.get("activity") == null) {
    result = Immutable.Map({
      activity: "timeline",
      params: Immutable.Map(),
    });
  }
  return result;
}

export default createStore("activityStore",
  activityChangeAction
    .map((fragment) => parseFragment(fragment))
);

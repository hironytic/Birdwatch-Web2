import Rx from "rx-lite";
import Immutable from "../stubs/immutable";

import { activityChangeAction } from "../actions/ActivityActions";

import * as ActivityUtils from "../utils/ActivityUtils";

import { createStore } from "../utils/FluxUtils";

function parseFragment(fragment) {
  let result = ActivityUtils.parseFragment(fragment);
  if (result == null || result.activityPath == null) {
    result = {
      activityPath: ["timeline"],
      params: {},
    };
  }
  return result;
}

export default createStore("activityStore",
  activityChangeAction
    .map((fragment) => Immutable.fromJS(parseFragment(fragment)))
);

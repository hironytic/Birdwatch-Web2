import Immutable from "../stubs/immutable";

import { activityChangeAction } from "../actions/ActivityActions";
import * as ActivityUtils from "../utils/ActivityUtils";
import { createStore } from "../flux/Flux";

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

// ストリームを流れるデータはこんな構造
// Immutable.Map({
//   activityPath: Immutable.List(["project", "Pxxx"]),
//   params: Immutable.Map({ ... }),
// })
export default createStore("activityStore",
  activityChangeAction
    .map((fragment) => Immutable.fromJS(parseFragment(fragment)))
);

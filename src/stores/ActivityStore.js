import Immutable from "../stubs/immutable";

import * as ActivityUtils from "../utils/ActivityUtils";
import { declareStore } from "../flux/Flux";

function parseFragment(fragment) {
  let result = ActivityUtils.parseFragment(fragment);
  if (result == null || result.activityPath == null || result.activityPath.length < 1) {
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
declareStore("activityStore", ({ activityChangeAction }) => {
  return activityChangeAction
    .map((fragment) => Immutable.fromJS(parseFragment(fragment)))
});

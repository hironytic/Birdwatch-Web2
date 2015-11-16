import Immutable from "immutable";

export function parseFragment(fragment) {
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

export function makeFragment(activity, params) {
  // TODO:
  return "/" + activity;
}

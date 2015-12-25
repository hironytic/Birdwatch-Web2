export function parseFragment(fragment) {
  let activityPath = [];
  let params = {};
  
  if (fragment != null && fragment != "") {
    activityPath = fragment.split("/");
    activityPath.shift();
  }
  return {
    activityPath: activityPath,
    params: params,
  };
}

export function makeFragment(activityPath, params = {}) {
  // TODO:
  return "/" + activityPath.join("/");
}

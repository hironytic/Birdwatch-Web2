import Immutable from "../stubs/immutable";
import Rx from "rx-lite";
import { timelineAction } from "../actions/TimelineActions";
import { projectListAction } from "../actions/ProjectActions";
import { createStore } from "../utils/FluxUtils";

function loadingModificationSelector(name) {
  return function(item) {
    if (item.get("loading")) {
      return (state => state.add(name));
    } else {
      return (state => state.remove(name));
    }
  };
}

const loadingModificationFromTimeline = timelineAction
  .map(loadingModificationSelector("timeline"))

const loadingModificationFromProjectList = projectListAction
  .map(loadingModificationSelector("project"))

const loadingState = Rx.Observable
  .merge(loadingModificationFromTimeline, loadingModificationFromProjectList)
  .scan((acc, modification) => modification(acc), Immutable.Set())
  .map(loadingSet => !loadingSet.isEmpty())
  .startWith(false)


const projectsState = Rx.Observable
  .merge(timelineAction, projectListAction)
  .map(item => item.get("projects"))
  .filter(projects => projects != null)
  .scan((acc, projects) => acc.merge(projects), Immutable.Map())
  .startWith(Immutable.Map())


const store = Rx.Observable
  .combineLatest(
    loadingState,
    projectsState,
    (loading, projects) => (Immutable.Map({ loading, projects })))

// ストリームを流れるデータはこんな構造
// {
//   loading: false,
//   projects: Immutable.Map({
//     "ID1": Immutable.Map({
//       id: "ID1",
//       name: ...,
//       familyId: ...,
//       platformId: ...,
//       projectCode: ...,
//       version: ...,
//     }),
//     ...
//   }),
export default createStore("projectStore", store);

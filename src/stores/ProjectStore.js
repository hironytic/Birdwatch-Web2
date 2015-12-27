import Immutable from "../stubs/immutable";
import Rx from "rx-lite";
import { timelineAction } from "../actions/TimelineActions";
import { projectListAction } from "../actions/ProjectActions";
import { createStore } from "../utils/FluxUtils";

const timelineLoading = timelineAction
  .map(item => item.get("loading"))
  .startWith(false)

const projectListLoading = projectListAction
  .map(item => item.get("loading"))
  .startWith(false)

const loadingState = Rx.Observable
  .combineLatest(
    timelineLoading, projectListLoading,
    (...loadings) => loadings.some(x => x)
  )

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

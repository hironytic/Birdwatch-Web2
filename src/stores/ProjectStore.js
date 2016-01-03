import Immutable from "../stubs/immutable";
import Rx from "rx-lite";

import { declareStore } from "../flux/Flux";

// ストリームを流れるデータはこんな構造
// Immutable.Map({
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
// })
export default declareStore("projectStore", ({ timelineAction, projectLoadAllAction }) => {
  const timelineLoading = timelineAction
    .map(item => item.get("loading"))
    .startWith(false)

  const projectListLoading = projectLoadAllAction
    .map(item => item.get("loading"))
    .startWith(false)

  const loadingState = Rx.Observable
    .combineLatest(
      timelineLoading, projectListLoading,
      (...loadings) => loadings.some(x => x)
    )

  const timelineOperation = timelineAction
    .map(item => item.get("projects"))
    .filter(projects => projects != null)
    .map(projects => state => {
      return state.merge(projects);
    })

  const projectLoadAllOperation = projectLoadAllAction
    .map(item => item.get("projects"))
    .filter(projects => projects != null)
    .map(projects => state => {
      return projects;
    })

  const projectsState = Rx.Observable
    .merge(timelineOperation, projectLoadAllOperation)
    .scan((state, operation) => operation(state), Immutable.Map())
    .startWith(Immutable.Map())

  const store = Rx.Observable
    .combineLatest(
      loadingState,
      projectsState,
      (loading, projects) => (Immutable.Map({ loading, projects })))

  return store;
});

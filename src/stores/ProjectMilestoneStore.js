import Immutable from "../stubs/immutable";
import Rx from "rx-lite";

import { createStore } from "../flux/Flux";

// ストリームを流れるデータはこんな構造
// Immutable.Map({
//   loading: false,
//   projectMilestones: Immutable.Map({
//     "ID20": Immutable.Map({
//       id: "ID20",
//       projectId: ...,
//       milestoneId: ...,
//       internalDate: ...,
//       dateString: ...,
//     })
//     ...
//   }),
// })
createStore("projectMilestoneStore", ({ projectMilestoneLoadAction, timelineAction }) => {
  const timelineLoading = timelineAction
    .map(item => item.get("loading"))
    .startWith(false)

  const projectMilestoneLoading = projectMilestoneLoadAction
    .map(item => item.get("loading"))
    .startWith(false)

  const loadingState = Rx.Observable
    .combineLatest(
      timelineLoading, projectMilestoneLoading,
      (...loadings) => loadings.some(x => x)
    )

  const timelineOperation = timelineAction
    .map(item => item.get("projectMilestones"))
    .filter(projectMilestones => projectMilestones != null)
    .map(projectMilestones => state => {
      return state.merge(projectMilestones);
    })

  const projectMilestoneOperation = projectMilestoneLoadAction
    .filter(item => item.get("projectMilestones") != null)
    .map(item => state => {
      const s = state
        .filterNot(pm => pm.get("projectId") == item.get("projectId"))
        .merge(item.get("projectMilestones"))
      return s;
    })

  const projectMilestonesState = Rx.Observable
    .merge(timelineOperation, projectMilestoneOperation)
    .scan((state, operation) => operation(state), Immutable.Map())
    .startWith(Immutable.Map())

  const store = Rx.Observable
    .combineLatest(
      loadingState,
      projectMilestonesState,
      (loading, projectMilestones) => (Immutable.Map({ loading, projectMilestones })))
  
  return store;
});

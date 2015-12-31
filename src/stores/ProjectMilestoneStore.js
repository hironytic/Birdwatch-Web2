import Immutable from "../stubs/immutable";
import Rx from "rx-lite";

import { timelineAction } from "../actions/TimelineActions";
import { createStore } from "../utils/FluxUtils";

const loadingState = timelineAction
  .map(item => item.get("loading"))
  .startWith(false)

const timelineOperation = timelineAction
  .map(item => item.get("projectMilestones"))
  .filter(projectMilestones => projectMilestones != null)
  .map(projectMilestones => state => {
    return state.merge(projectMilestones);
  })

const projectMilestonesState = timelineOperation
  .scan((state, operation) => operation(state), Immutable.Map())
  .startWith(Immutable.Map())

const store = Rx.Observable
  .combineLatest(
    loadingState,
    projectMilestonesState,
    (loading, projectMilestones) => (Immutable.Map({ loading, projectMilestones })))


// ストリームを流れるデータはこんな構造
// Immutable.Map({
//   loading: false,
//   projectMilestones: Immutable.Map({
//     "ID20": Immutable.Map({
//       id: "ID20",
//       projectid: ...,
//       milestoneId: ...,
//       internalDate: ...,
//       dateString: ...,
//     })
//     ...
//   }),
// })
export default createStore("projectMilestoneStore", store);

import Immutable from "../stubs/immutable";
import Rx from "rx-lite";
import { timelineAction } from "../actions/TimelineActions";
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

const loadingState = loadingModificationFromTimeline
  .scan((acc, modification) => modification(acc), Immutable.Set())
  .map(loadingSet => !loadingSet.isEmpty())
  .startWith(false)


const projectMilestonesState = timelineAction
  .map(item => item.get("projectMilestones"))
  .filter(projectMilestones => projectMilestones != null)
  .scan((acc, projectMilestones) => acc.merge(projectMilestones), Immutable.Map())
  .startWith(Immutable.Map())


const store = Rx.Observable
  .combineLatest(
    loadingState,
    projectMilestonesState,
    (loading, projectMilestones) => (Immutable.Map({ loading, projectMilestones })))


// ストリームを流れるデータはこんな構造
// {
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
// }
export default createStore("projectMilestoneStore", store);

import Immutable from "immutable";
import Rx from "rx-lite";

import { reloadTimelineAction } from "../actions/TimelineActions";

import { createStore } from "../utils/FluxUtils";

const fromTimelineAction = reloadTimelineAction
  .map(({ loading, timeline }) => {
    return timeline.map(projectMilestone => projectMilestone.getProject());
  })
  .shareReplay(1);

export default createStore("projectStore",
  Rx.Observable.merge(fromTimelineAction)
    .scan((acc, projectArray) => {
      return acc.withMutations(projectMap => {
        projectArray.forEach((project) => {
          projectMap.set(project.id, Immutable.Map({
            id: project.id,
            name: project.getName(),
            familyId: project.getFamily().id,
            platformId: project.getPlatform().id,
            projectCode: project.getProjectCode(),
            version: project.getVersion(),
          }));
        });
      });
    }, Immutable.Map())
);

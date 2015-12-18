import Immutable from "../stubs/immutable";
import Rx from "rx-lite";

import { timelineAction } from "../actions/TimelineActions";

import { createStore } from "../utils/FluxUtils";

export default createStore("timelineStore",
  timelineAction
    .map(({ loadStatus, timeline }) => {
      return Immutable.Map({
        loadStatus: loadStatus,
        timeline: Immutable.List(timeline.map((projectMilestone) => {
          return Immutable.Map({
            id: projectMilestone.id,
            projectId: projectMilestone.getProject().id,
            milestoneId: projectMilestone.getMilestone().id,
            internalDate: projectMilestone.getInternalDate(),
            dateString: projectMilestone.getDateString(),
          });
        }))
      });
    })
);

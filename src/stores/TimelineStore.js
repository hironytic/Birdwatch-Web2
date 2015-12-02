import Immutable from "immutable";
import Rx from "rx-lite";

import { reloadTimelineAction } from "../actions/TimelineActions";
import { notifyError } from "../actions/ErrorActions";

import Project from "../objects/Project";
import ProjectMilestone from "../objects/ProjectMilestone";

export default reloadTimelineAction
  .map(({ loading, timeline }) => {
    return Immutable.Map({
      loading: loading,
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
  .shareReplay(1);

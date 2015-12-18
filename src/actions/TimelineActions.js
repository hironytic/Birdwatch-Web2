import moment from "moment";
import Parse from "../stubs/parse";
import Rx from "rx-lite-extras";

import { notifyError } from "../actions/ErrorActions";

import LoadStatus from "../constants/LoadStatus";

import Project from "../objects/Project";
import ProjectMilestone from "../objects/ProjectMilestone";

import { createAction } from "../utils/FluxUtils";

const reloadTimelineSubject = new Rx.Subject();
export const timelineAction = createAction("timelineAction",
  reloadTimelineSubject
    .map(({ daysAgo }) => {
      const today = moment();
      today.hour(0);
      today.second(0);
      today.minute(0);
      const minDate = today.subtract(daysAgo, 'days').toDate();
      const query = new Parse.Query(ProjectMilestone);
      query.include(ProjectMilestone.Key.PROJECT);
      query.greaterThan(ProjectMilestone.Key.INTERNAL_DATE, minDate);
      query.ascending(ProjectMilestone.Key.INTERNAL_DATE);  // 必要？
      return Rx.Observable.fromPromise(query.find())
        .map((milestones) => ({
          loadStatus: LoadStatus.LOADED,
          timeline: milestones,
        }))
        .startWith({
          loadStatus: LoadStatus.LOADING,
          timeline: [],
        })
        .catch((error) => {
          notifyError("タイムラインの取得に失敗", error.message);
          return Rx.Observable.just({
            loadStatus: LoadStatus.NOT_LOADED,
            timeline: [],
          });
        });
    })
    .switch()
);

export function reloadTimeline(daysAgo = 3) {
  reloadTimelineSubject.onNext({ daysAgo });
}

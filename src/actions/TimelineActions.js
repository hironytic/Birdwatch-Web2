import moment from "moment";
import Parse from "../utils/ParseStub";
import Rx from "rx-lite-extras";

import { notifyError } from "../actions/ErrorActions";

import Project from "../objects/Project";
import ProjectMilestone from "../objects/ProjectMilestone";

const reloadTimelineSubject = new Rx.Subject();
export const reloadTimelineAction = reloadTimelineSubject
  .map(({ daysAgo }) => {
    const today = moment();
    today.hour(0);
    today.second(0);
    today.minute(0);
    const minDate = today.subtract(daysAgo, 'days').toDate();
    const query = new Parse.Query(ProjectMilestone);
    query.include(ProjectMilestone.Key.PROJECT);
    query.include(ProjectMilestone.Key.MILESTONE);
    query.include(ProjectMilestone.Key.PROJECT + "." + Project.Key.FAMILY);
    query.include(ProjectMilestone.Key.PROJECT + "." + Project.Key.PLATFORM);
    query.greaterThan(ProjectMilestone.Key.INTERNAL_DATE, minDate);
    query.ascending(ProjectMilestone.Key.INTERNAL_DATE);  // 必要？
    return Rx.Observable.fromPromise(query.find())
      .map((milestones) => ({
        loading: false,
        timeline: milestones,
      }))
      .startWith({
        loading: true,
        timeline: [],
      })
      .catch((error) => {
        notifyError("タイムラインの取得に失敗", error.message);
        return Rx.Observable.just({
          loading: false,
          timeline: [],
        });
      });
  })
  .switch()
  .observeOn(Rx.Scheduler.async);

export function reloadTimeline(daysAgo = 3) {
  reloadTimelineSubject.onNext({ daysAgo });
}

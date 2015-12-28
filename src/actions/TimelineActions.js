import Immutable from "../stubs/immutable";
import moment from "moment";
import Parse from "../stubs/parse";
import Rx from "rx-lite-extras";

import { notifyError } from "../actions/ErrorActions";
import LoadStatus from "../constants/LoadStatus";
import Project from "../objects/Project";
import ProjectMilestone from "../objects/ProjectMilestone";
import { createAction } from "../utils/FluxUtils";

const reloadTimelineSubject = new Rx.Subject();

export function reloadTimeline(daysAgo = 3) {
  reloadTimelineSubject.onNext({ daysAgo });
}

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
export const timelineAction = createAction("timelineAction",
  reloadTimelineSubject
    .map(({ daysAgo }) => {
      const today = moment().hour(0).second(0).minute(0);
      const minDate = today.subtract(daysAgo, 'days').toDate();
      const query = new Parse.Query(ProjectMilestone);
      query.include(ProjectMilestone.Key.PROJECT);
      query.greaterThan(ProjectMilestone.Key.INTERNAL_DATE, minDate);
      return Rx.Observable.fromPromise(query.find())
        .map((result) => {
          const projectMap = Immutable.Map().withMutations(initial => {
            result.reduce((acc, projectMilestone) => {
              const project = projectMilestone.getProject();
              return acc.set(project.id, Immutable.Map({
                id: project.id,
                name: project.getName(),
                familyId: project.getFamily().id,
                platformId: project.getPlatform().id,
                projectCode: project.getProjectCode(),
                version: project.getVersion(),
              }));
            }, initial);
          });
          
          const projectMilestoneMap = Immutable.Map().withMutations(initial => {
            result.reduce((acc, projectMilestone) => {
              return acc.set(projectMilestone.id, Immutable.Map({
                id: projectMilestone.id,
                projectId: projectMilestone.getProject().id,
                milestoneId: projectMilestone.getMilestone().id,
                internalDate: projectMilestone.getInternalDate(),
                dateString: projectMilestone.getDateString(),
              }));
            }, initial);
          });
          
          return Immutable.Map({
            loading: false,
            projects: projectMap,
            projectMilestones: projectMilestoneMap,
          });
        })
        .startWith(Immutable.Map({
          loading: true,          
        }))
        .catch((error) => {
          notifyError("タイムラインの取得に失敗", error.message);
          return Rx.Observable.just(Immutable.Map({
            loading: false,
          }));
        })
    })
    .switch()
);

import Immutable from "../stubs/immutable";
import moment from "moment";
import Rx from "rx-lite-extras";

import { notifyError } from "../actions/ErrorActions";
import { Project, ProjectMilestone } from "../constants/DBSchema";
import { declareAction } from "../flux/Flux";

const reloadTimelineSubject = new Rx.Subject();

export function reloadTimeline(minDate) {
  reloadTimelineSubject.onNext({ minDate });
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
//       projectId: ...,
//       milestoneId: ...,
//       internalDate: ...,
//       dateString: ...,
//     })
//     ...
//   }),
// })
declareAction("timelineAction", ({ db }) => {
  return reloadTimelineSubject
    .map(({ minDate }) => {
      const query = db.createQuery(ProjectMilestone.CLASS_NAME);
      query.include(ProjectMilestone.PROJECT);
      query.greaterThan(ProjectMilestone.INTERNAL_DATE, minDate);
      return Rx.Observable.fromPromise(db.find(query))
        .map((result) => {
          const projectMap = Immutable.Map().withMutations(initial => {
            result.reduce((acc, projectMilestone) => {
              const project = projectMilestone.get(ProjectMilestone.PROJECT);
              return acc.set(project.getId(), Immutable.Map({
                id: project.getId(),
                name: project.get(Project.NAME),
                familyId: project.get(Project.FAMILY).getId(),
                platformId: project.get(Project.PLATFORM).getId(),
                projectCode: project.get(Project.PROJECT_CODE),
                version: project.get(Project.VERSION),
              }));
            }, initial);
          });
          
          const projectMilestoneMap = Immutable.Map().withMutations(initial => {
            result.reduce((acc, projectMilestone) => {
              return acc.set(projectMilestone.getId(), Immutable.Map({
                id: projectMilestone.getId(),
                projectId: projectMilestone.get(ProjectMilestone.PROJECT).getId(),
                milestoneId: projectMilestone.get(ProjectMilestone.MILESTONE).getId(),
                internalDate: projectMilestone.get(ProjectMilestone.INTERNAL_DATE),
                dateString: projectMilestone.get(ProjectMilestone.DATE_STRING),
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
});

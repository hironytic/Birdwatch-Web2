import Immutable from "../stubs/immutable";
import Parse from "../stubs/parse";
import Rx from "rx-lite-extras";

import { notifyError } from "../actions/ErrorActions";
import Project from "../objects/Project";
import ProjectMilestone from "../objects/ProjectMilestone";
import { createAction } from "../flux/Flux";

const reloadProjectListSubject = new Rx.Subject();
const reloadMilestonesSubject = new Rx.Subject();

export function reloadProjectList() {
  reloadProjectListSubject.onNext();
}

export function reloadMilestones(projectId) {
  reloadMilestonesSubject.onNext({ projectId });
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
// })
export const projectLoadAllAction = createAction("projectLoadAllAction",
  reloadProjectListSubject
    .map(() => {
      const query = new Parse.Query(Project);
      return Rx.Observable.fromPromise(query.find())
        .map((result) => {
          const projectMap = Immutable.Map().withMutations(initial => {
            result.reduce((acc, project) => {
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
          
          return Immutable.Map({
            loading: false,
            projects: projectMap,
          });
        })
        .startWith(Immutable.Map({
          loading: true,
        }))
        .catch(error => {
          notifyError("プロジェクト一覧の取得に失敗", error.message);
          return Rx.Observable.just(Immutable.Map({
            loading: false,
          }));
        })
    })
    .switch()
);

// ストリームを流れるデータはこんな構造
// Immutable.Map({
//   loading: false,
//   projectId: "ID1",
//   projectMilestones: Immutable.Map({
//     "ID20": Immutable.Map({
//       id: "ID20",
//       projectid: "ID1",
//       milestoneId: ...,
//       internalDate: ...,
//       dateString: ...,
//     })
//     ...
//   }),
// })
export const projectMilestoneLoadAction = createAction("projectMilestoneLoadAction",
  reloadMilestonesSubject
    .map(({ projectId }) => {
      const project = new Project();
      project.id = projectId;
      const query = new Parse.Query(ProjectMilestone);
      query.equalTo(ProjectMilestone.Key.PROJECT, project);
      return Rx.Observable.fromPromise(query.find())
        .map((result) => {
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
            projectId: projectId,
            projectMilestones: projectMilestoneMap,
          });
        })
        .startWith(Immutable.Map({
          loading: true,
        }))
        .catch(error => {
          notifyError("プロジェクトのマイルストーンが取得できませんでした", error.message);
          return Rx.Observable.just(Immutable.Map({
            loading: false,
          }));
        })
    })
    .switch()
);

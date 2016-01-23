import Immutable from "../stubs/immutable";
import Rx from "rx-lite-extras";

import { notifyError } from "../actions/ErrorActions";
import { Project, ProjectMilestone } from "../constants/DBSchema";
import { declareAction } from "../flux/Flux";

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
declareAction("projectLoadAllAction", ({ db }) => {
  return reloadProjectListSubject
    .map(() => {
      const query = db.createQuery(Project.CLASS_NAME);
      return Rx.Observable.fromPromise(db.find(query))
        .map((result) => {
          const projectMap = Immutable.Map().withMutations(initial => {
            result.reduce((acc, project) => {
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
});

// ストリームを流れるデータはこんな構造
// Immutable.Map({
//   loading: false,
//   projectId: "ID1",
//   projectMilestones: Immutable.Map({
//     "ID20": Immutable.Map({
//       id: "ID20",
//       projectId: "ID1",
//       milestoneId: ...,
//       internalDate: ...,
//       dateString: ...,
//     })
//     ...
//   }),
// })
declareAction("projectMilestoneLoadAction", ({ db }) => {
  return reloadMilestonesSubject
    .map(({ projectId }) => {
      const project = db.createEntity(Project.CLASS_NAME);
      project.setId(projectId);
      const query = db.createQuery(ProjectMilestone.CLASS_NAME);
      query.equalTo(ProjectMilestone.PROJECT, project);
      return Rx.Observable.fromPromise(db.find(query))
        .map((result) => {
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
});

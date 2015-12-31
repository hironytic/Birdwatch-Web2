import Immutable from "../stubs/immutable";
import Parse from "../stubs/parse";
import Rx from "rx-lite-extras";

import { notifyError } from "../actions/ErrorActions";
import Project from "../objects/Project";
import { createAction } from "../utils/FluxUtils";

const reloadProjectListSubject = new Rx.Subject();

export function reloadProjectList() {
  reloadProjectListSubject.onNext();
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
      var query = new Parse.Query(Project);
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


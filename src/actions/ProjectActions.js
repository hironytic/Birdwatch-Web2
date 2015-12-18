import moment from "moment";
import Parse from "../stubs/parse";
import Rx from "rx-lite-extras";

import { notifyError } from "../actions/ErrorActions";

import LoadStatus from "../constants/LoadStatus";

import Project from "../objects/Project";

import { createAction } from "../utils/FluxUtils";

const reloadProjectListSubject = new Rx.Subject();
export const projectListAction = createAction("projectListAction",
  reloadProjectListSubject
    .map(() => {
      var query = new Parse.Query(Project);
      return Rx.Observable.fromPromise(query.find())
        .map(projectList => ({
          loadStatus: LoadStatus.LOADED,
          projectList: projectList,
        }))
        .startWith({
          loadStatus: LoadStatus.LOADING,
          projectList: [],
        })
        .catch(error => {
          notifyError("プロジェクト一覧の取得に失敗", error.message);
          return Rx.Observable.just({
            loadStatus: LoadStatus.NOT_LOADED,
            timeline: [],
          });
        })
    })
    .switch()
);

export function reloadProjectList() {
  reloadProjectListSubject.onNext();
}

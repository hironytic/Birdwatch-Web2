import Parse from "../stubs/parse";
import Rx from "rx-lite-extras";

import createMasterAction from "../actions/MasterActionCreator";
import { notifyError } from "../actions/ErrorActions";

import Milestone from "../objects/Milestone";

import { createAction } from "../utils/FluxUtils";

const reloadMilestoneMasterSubject = new Rx.Subject();
export function reloadMilestoneMaster() {
  reloadMilestoneMasterSubject.onNext();
}

export const milestoneMasterAction = createMasterAction("milestoneMasterAction", {
  getReloadSource: () => reloadMilestoneMasterSubject,
  
  loadListQuery: () => {
    const query = new Parse.Query(Milestone);
    return query;
  },

  notifyError: (error) => {
    notifyError("マイルストーン一覧の取得に失敗", error.message);
  },
});

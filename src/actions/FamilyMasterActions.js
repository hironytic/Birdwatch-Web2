import Parse from "../stubs/parse";
import Rx from "rx-lite-extras";

import createMasterAction from "../actions/MasterActionCreator";
import { notifyError } from "../actions/ErrorActions";

import Family from "../objects/Family";

import { createAction } from "../utils/FluxUtils";

const reloadFamilyMasterSubject = new Rx.Subject();
export function reloadFamilyMaster() {
  reloadFamilyMasterSubject.onNext();
}

export const familyMasterAction = createMasterAction("familyMasterAction", {
  getReloadSource: () => reloadFamilyMasterSubject,
  
  loadListQuery: () => {
    const query = new Parse.Query(Family);
    return query;
  },
  
  notifyError: (error) => {
    notifyError("プロダクト一覧の取得に失敗", error.message);
  },
});

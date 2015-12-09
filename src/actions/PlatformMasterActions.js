import Parse from "../stubs/parse";
import Rx from "rx-lite-extras";

import createMasterAction from "../actions/MasterActionCreator";
import { notifyError } from "../actions/ErrorActions";

import Platform from "../objects/Platform";

import { createAction } from "../utils/FluxUtils";

const reloadPlatformMasterSubject = new Rx.Subject();
export function reloadPlatformMaster() {
  reloadPlatformMasterSubject.onNext();
}

export const platformMasterAction = createMasterAction("platformMasterAction", {
  getReloadSource: () => reloadPlatformMasterSubject,
  
  loadListQuery: () => {
    const query = new Parse.Query(Platform);
    return query;
  },
  
  notifyError: (error) => {
    notifyError("プラットフォーム一覧の取得に失敗", error.message);
  },
});

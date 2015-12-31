import Immutable from "../stubs/immutable";
import Parse from "../stubs/parse";
import Rx from "rx-lite-extras";

import createMasterLoadAllAction from "../actions/MasterActionCreator";
import { notifyError } from "../actions/ErrorActions";

import Platform from "../objects/Platform";

import { createAction } from "../utils/FluxUtils";

const reloadPlatformMasterSubject = new Rx.Subject();
export function reloadPlatformMaster() {
  reloadPlatformMasterSubject.onNext();
}

// ストリームを流れるデータはこんな構造
// Immutable.Map({
//   loading: false,
//   items: Immutable.Map({
//     "ID1": Immutable.Map({
//       id: "ID1",
//       name: ...,
//     }),
//     ...
//   }),
// })
export const platformMasterLoadAllAction = createMasterLoadAllAction("platformMasterLoadAllAction", {
  getReloadSource: () => reloadPlatformMasterSubject,
  
  loadListQuery: () => {
    const query = new Parse.Query(Platform);
    return query;
  },
  
  makeListItem: (platform) => {
    return Immutable.Map({
      id: platform.id,
      name: platform.getName(),
    });
  },
  
  notifyError: (error) => {
    notifyError("プラットフォーム一覧の取得に失敗", error.message);
  },
});

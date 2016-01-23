import Immutable from "../stubs/immutable";
import Rx from "rx-lite-extras";

import createMasterLoadAllAction from "../actions/MasterActionCreator";
import { notifyError } from "../actions/ErrorActions";
import { Platform } from "../constants/DBSchema";

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
createMasterLoadAllAction("platformMasterLoadAllAction", {
  getReloadSource: () => reloadPlatformMasterSubject,
  
  loadListQuery: (db) => {
    return db.createQuery(Platform.CLASS_NAME);
  },
  
  makeListItem: (platform) => {
    return Immutable.Map({
      id: platform.getId(),
      name: platform.get(Platform.NAME),
    });
  },
  
  notifyError: (error) => {
    notifyError("プラットフォーム一覧の取得に失敗", error.message);
  },
});

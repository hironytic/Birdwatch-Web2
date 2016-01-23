import Immutable from "../stubs/immutable";
import Rx from "rx-lite-extras";

import createMasterLoadAllAction from "../actions/MasterActionCreator";
import { notifyError } from "../actions/ErrorActions";
import { Milestone } from "../constants/DBSchema";

const reloadMilestoneMasterSubject = new Rx.Subject();
export function reloadMilestoneMaster() {
  reloadMilestoneMasterSubject.onNext();
}

// ストリームを流れるデータはこんな構造
// Immutable.Map({
//   loading: false,
//   items: Immutable.Map({
//     "ID1": Immutable.Map({
//       id: "ID1",
//       name: ...,
//       order: ...,
//     }),
//     ...
//   }),
// })
createMasterLoadAllAction("milestoneMasterLoadAllAction", {
  getReloadSource: () => reloadMilestoneMasterSubject,
  
  loadListQuery: (db) => {
    return db.createQuery(Milestone.CLASS_NAME);
  },
  
  makeListItem: (milestone) => {
    return Immutable.Map({
      id: milestone.getId(),
      name: milestone.get(Milestone.NAME),
      order: milestone.get(Milestone.ORDER),
    })
  },

  notifyError: (error) => {
    notifyError("マイルストーン一覧の取得に失敗", error.message);
  },
});

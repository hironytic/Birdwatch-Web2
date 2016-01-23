import Immutable from "../stubs/immutable";
import Rx from "rx-lite-extras";

import createMasterLoadAllAction from "../actions/MasterActionCreator";
import { notifyError } from "../actions/ErrorActions";
import { Family } from "../constants/DBSchema";

const reloadFamilyMasterSubject = new Rx.Subject();

export function reloadFamilyMaster() {
  reloadFamilyMasterSubject.onNext();
}

// ストリームを流れるデータはこんな構造
// Immutable.Map({
//   loading: false,
//   items: Immutable.Map({
//     "ID1": Immutable.Map({
//       id: "ID1",
//       name: ...,
//       colorString: ...,
//     }),
//     ...
//   }),
// })
createMasterLoadAllAction("familyMasterLoadAllAction", {
  getReloadSource: () => reloadFamilyMasterSubject,
  
  loadListQuery: (db) => {
    return db.createQuery(Family.CLASS_NAME);
  },
  
  makeListItem: (family) => {
    return Immutable.Map({
      id: family.getId(),
      name: family.get(Family.NAME),
      colorString: family.get(Family.COLOR_STRING),
    });
  },

  notifyError: (error) => {
    notifyError("プロダクト一覧の取得に失敗", error.message);
  },
});

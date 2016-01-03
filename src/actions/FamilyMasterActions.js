import Immutable from "../stubs/immutable";
import Parse from "../stubs/parse";
import Rx from "rx-lite-extras";

import createMasterLoadAllAction from "../actions/MasterActionCreator";
import { notifyError } from "../actions/ErrorActions";
import Family from "../objects/Family";
import { createAction } from "../flux/Flux";

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
export const familyMasterLoadAllAction = createMasterLoadAllAction("familyMasterLoadAllAction", {
  getReloadSource: () => reloadFamilyMasterSubject,
  
  loadListQuery: () => {
    const query = new Parse.Query(Family);
    return query;
  },
  
  makeListItem: (family) => {
    return Immutable.Map({
      id: family.id,
      name: family.getName(),
      colorString: family.getColorString(),
    });
  },

  notifyError: (error) => {
    notifyError("プロダクト一覧の取得に失敗", error.message);
  },
});

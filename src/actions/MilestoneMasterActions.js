import Immutable from "../stubs/immutable";
import Parse from "../stubs/parse";
import Rx from "rx-lite-extras";

import createMasterLoadAllAction from "../actions/MasterActionCreator";
import { notifyError } from "../actions/ErrorActions";
import Milestone from "../objects/Milestone";
import { createAction } from "../utils/FluxUtils";

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
export const milestoneMasterLoadAllAction = createMasterLoadAllAction("milestoneMasterLoadAllAction", {
  getReloadSource: () => reloadMilestoneMasterSubject,
  
  loadListQuery: () => {
    const query = new Parse.Query(Milestone);
    return query;
  },
  
  makeListItem: (milestone) => {
    return Immutable.Map({
      id: milestone.id,
      name: milestone.getName(),
      order: milestone.getOrder(),
    })
  },

  notifyError: (error) => {
    notifyError("マイルストーン一覧の取得に失敗", error.message);
  },
});

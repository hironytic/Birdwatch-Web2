import Immutable from "../stubs/immutable";

import { milestoneMasterLoadAllAction } from "../actions/MilestoneMasterActions";
import createMasterStore from "../stores/MasterStoreCreator";

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
export default createMasterStore("milestoneMasterStore", {
  getMasterLoadAllAction: () => milestoneMasterLoadAllAction,
});

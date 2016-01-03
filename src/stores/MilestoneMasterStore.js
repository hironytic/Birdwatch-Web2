import Immutable from "../stubs/immutable";

import { actions } from "../flux/Flux";
import createMasterStore from "../stores/MasterStoreCreator";

const { milestoneMasterLoadAllAction } = actions();

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

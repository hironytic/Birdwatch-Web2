import Immutable from "../stubs/immutable";

import { familyMasterLoadAllAction } from "../actions/FamilyMasterActions";

import createMasterStore from "../stores/MasterStoreCreator";

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
export default createMasterStore("familyMasterStore", {
  getMasterLoadAllAction: () => familyMasterLoadAllAction,
});

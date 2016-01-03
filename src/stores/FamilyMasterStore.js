import Immutable from "../stubs/immutable";

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
createMasterStore("familyMasterStore", {
  getMasterLoadAllAction: ({ familyMasterLoadAllAction }) => familyMasterLoadAllAction,
});

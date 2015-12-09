import Immutable from "../stubs/immutable";
import Parse from "../stubs/parse";

import { milestoneMasterAction } from "../actions/MilestoneMasterActions";

import createMasterStore from "../stores/MasterStoreCreator";

export default createMasterStore("milestoneMasterStore", {
  getMasterAction: () => milestoneMasterAction,
  
  makeStoreItem: (milestone) => Immutable.Map({
    id: milestone.id,
    name: milestone.getName(),
    order: milestone.getOrder(),
  }),
});

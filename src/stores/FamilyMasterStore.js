import Immutable from "../stubs/immutable";
import Parse from "../stubs/parse";

import { familyMasterAction } from "../actions/FamilyMasterActions";

import createMasterStore from "../stores/MasterStoreCreator";

export default createMasterStore("familyMasterStore", {
  getMasterAction: () => familyMasterAction,
  
  makeStoreItem: (family) => Immutable.Map({
    id: family.id,
    name: family.getName(),
    colorString: family.getColorString(),
  }),
});

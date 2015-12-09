import Immutable from "../stubs/immutable";
import Parse from "../stubs/parse";

import { platformMasterAction } from "../actions/PlatformMasterActions";

import createMasterStore from "../stores/MasterStoreCreator";

export default createMasterStore("platformMasterStore", {
  getMasterAction: () => platformMasterAction,
  
  makeStoreItem: (platform) => Immutable.Map({
    id: platform.id,
    name: platform.getName(),
  }),
});

import Parse from "../utils/ParseStub";

import { reloadMilestoneMasterAction } from "../actions/MilestoneMasterActions";
import { notifyError } from "../actions/ErrorActions";

import Milestone from "../objects/Milestone";

import createMasterStore from "../stores/MasterStoreCreator";

export default createMasterStore("milestoneMasterStore", {
  reloadSource: () => reloadMilestoneMasterAction,
  
  loadListQuery: () => {
    const query = new Parse.Query(Milestone);
    query.ascending(Milestone.Key.ORDER);
    return query;
  },
  
  notifyError: (error) => {
    notifyError("マイルストーン一覧の取得に失敗", error.message);
  },
});

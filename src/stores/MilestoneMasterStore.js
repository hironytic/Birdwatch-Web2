import Parse from "../utils/ParseStub";

import * as MilestoneMasterActions from "../actions/MilestoneMasterActions";
import * as ErrorActions from "../actions/ErrorActions";

import Milestone from "../objects/Milestone";

import createMasterStore from "../stores/MasterStoreCreator";

export default createMasterStore({
  reloadSource: () => MilestoneMasterActions.reloadSource,
  
  loadListQuery: () => {
    var query = new Parse.Query(Milestone);
    query.ascending(Milestone.Key.ORDER);
    return query;
  },
  
  notifyError: (error) => {
    ErrorActions.notifyError("マイルストーン一覧の取得に失敗", error.message);
  },
});

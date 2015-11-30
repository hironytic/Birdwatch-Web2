import Parse from "../utils/ParseStub";

import * as FamilyMasterActions from "../actions/FamilyMasterActions";
import * as ErrorActions from "../actions/ErrorActions";

import Family from "../objects/Family";

import createMasterStore from "../stores/MasterStoreCreator";

export default createMasterStore({
  reloadSource: () => FamilyMasterActions.reloadSource,
  
  loadListQuery: () => {
    var query = new Parse.Query(Family);
    query.ascending(Family.Key.NAME);
    return query;
  },
  
  notifyError: (error) => {
    ErrorActions.notifyError("プロダクト一覧の取得に失敗", error.message);
  },
});

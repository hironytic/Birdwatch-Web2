import Parse from "parse";

import * as FamilyMasterActions from "../actions/FamilyMasterActions";
import * as ErrorActions from "../actions/ErrorActions";

import Family from "../objects/Family";

import MasterStoreBase from "../stores/MasterStoreBase";

export default class FamilyMasterStore extends MasterStoreBase {
  constructor(authStateStore) {
    super(authStateStore);
  }
  
  _reloadSource() {
    return FamilyMasterActions.reloadSource;
  }
  
  _loadListQuery() {
    var query = new Parse.Query(Family);
    query.ascending(Family.Key.NAME);
    return query;
  }
  
  _notifyError(error) {
    ErrorActions.notifyError("プロダクト一覧の取得に失敗", error.message);
  }  
}

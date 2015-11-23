import Parse from "parse";

import * as MilestoneMasterActions from "../actions/MilestoneMasterActions";
import * as ErrorActions from "../actions/ErrorActions";

import Milestone from "../objects/Milestone";

import MasterStoreBase from "../stores/MasterStoreBase";

export default class MilestoneMasterStore extends MasterStoreBase {
  constructor(authStateStore) {
    super(authStateStore);
  }
  
  _reloadSource() {
    return MilestoneMasterActions.reloadSource;
  }
  
  _loadListQuery() {
    var query = new Parse.Query(Milestone);
    query.ascending(Milestone.Key.ORDER);
    return query;
  }
  
  _notifyError(error) {
    ErrorActions.notifyError("マイルストーン一覧の取得に失敗", error.message);
  }  
}

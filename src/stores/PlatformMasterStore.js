import Parse from "../utils/ParseStub";

import * as PlatformMasterActions from "../actions/PlatformMasterActions";
import * as ErrorActions from "../actions/ErrorActions";

import Platform from "../objects/Platform";

import MasterStoreBase from "../stores/MasterStoreBase";

export default class PlatformMasterStore extends MasterStoreBase {
  constructor(authStateStore) {
    super(authStateStore);
  }
  
  _reloadSource() {
    return PlatformMasterActions.reloadSource;
  }
  
  _loadListQuery() {
    var query = new Parse.Query(Platform);
    query.ascending(Platform.Key.NAME);
    return query;
  }
  
  _notifyError(error) {
    ErrorActions.notifyError("プラットフォーム一覧の取得に失敗", error.message);
  }  
}

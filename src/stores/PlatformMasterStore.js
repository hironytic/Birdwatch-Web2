import Parse from "../utils/ParseStub";

import * as PlatformMasterActions from "../actions/PlatformMasterActions";
import * as ErrorActions from "../actions/ErrorActions";

import Platform from "../objects/Platform";

import createMasterStore from "../stores/MasterStoreCreator";

export default createMasterStore({
  reloadSource: () => PlatformMasterActions.reloadSource,
  
  loadListQuery: () => {
    const query = new Parse.Query(Platform);
    query.ascending(Platform.Key.NAME);
    return query;
  },
  
  notifyError: (error) => {
    ErrorActions.notifyError("プラットフォーム一覧の取得に失敗", error.message);
  },
});

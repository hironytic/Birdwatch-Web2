import Parse from "../stubs/parse";

import { reloadPlatformMasterAction } from "../actions/PlatformMasterActions";
import { notifyError } from "../actions/ErrorActions";

import Platform from "../objects/Platform";

import createMasterStore from "../stores/MasterStoreCreator";

export default createMasterStore("platformMasterStore", {
  reloadSource: () => reloadPlatformMasterAction,
  
  loadListQuery: () => {
    const query = new Parse.Query(Platform);
    query.ascending(Platform.Key.NAME);
    return query;
  },
  
  notifyError: (error) => {
    notifyError("プラットフォーム一覧の取得に失敗", error.message);
  },
});

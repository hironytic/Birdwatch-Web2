import Parse from "../utils/ParseStub";

import { reloadFamilyMasterAction } from "../actions/FamilyMasterActions";
import { notifyError } from "../actions/ErrorActions";

import Family from "../objects/Family";

import createMasterStore from "../stores/MasterStoreCreator";

export default createMasterStore("familyMasterStore", {
  reloadSource: () => reloadFamilyMasterAction,
  
  loadListQuery: () => {
    const query = new Parse.Query(Family);
    query.ascending(Family.Key.NAME);
    return query;
  },
  
  notifyError: (error) => {
    notifyError("プロダクト一覧の取得に失敗", error.message);
  },
});

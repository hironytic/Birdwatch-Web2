import Immutable from "immutable";
import Parse from "parse";
import Rx from "rx-lite-extras";

import * as FamilyMasterActions from "../actions/FamilyMasterActions";
import * as ErrorActions from "../actions/ErrorActions";

import Family from "../objects/Family";

import AuthStateStore from "../stores/AuthStateStore";

export default class FamilyMasterStore {
  constructor(authStateStore) {
    // サインインしたとき
    var loadTrigger1 = authStateStore.getSource()
    .map(value => value.get("status"))
    .distinctUntilChanged()
    .filter(status => status == AuthStateStore.Status.SIGNED_IN);

    // リロードアクションが実行されたとき（サインインしているなら）
    var loadTrigger2 = this._reloadSource()
    .withLatestFrom(authStateStore.getSource(), (x, y) => y)
    .filter(authState => authState.get("status") == AuthStateStore.Status.SIGNED_IN);
    
    var loadProcess = Rx.Observable.merge(loadTrigger1, loadTrigger2)
    .map(() => {
      return Rx.Observable.fromPromise(this._loadListQuery().find())
      .map((list) => Immutable.Map({
        loading: false,
        list: Immutable.List(list),
      }))
      .startWith(Immutable.Map({
        loading: true,
        list: Immutable.List(),
      }))
      .catch((error) => {
        this._notifyError(error);
        return Rx.Observable.just(
          Immutable.Map({
            loading: false,
            list: Immutable.List(),
          })
        );
      });
    })
    .switch()
    .shareReplay(1);
    
    this.source = loadProcess
    .startWith(Immutable.Map({
      loading: false,
      list: Immutable.List(),
    }));
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
  
  getSource() {
    return this.source;
  }  
}

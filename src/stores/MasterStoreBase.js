import Immutable from "immutable";
import Rx from "rx-lite-extras";

import AuthStateStore from "../stores/AuthStateStore";

export default class MasterStoreBase {
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
    }))
    .shareReplay(1);
  }
  
  _reloadSource() {
    return Rx.Observable.empty();
  }
  
  _loadListQuery() {
    return null;
  }
  
  _notifyError(error) {
  }
  
  getSource() {
    return this.source;
  }  
}

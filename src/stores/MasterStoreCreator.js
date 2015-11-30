import Immutable from "immutable";
import Rx from "rx-lite-extras";

import AuthStatus from "../constants/AuthStatus";

import AuthStateStore from "../stores/AuthStateStore";

export default function createMasterStore({reloadSource, loadListQuery, notifyError}) {
  // サインインしたとき
  var loadTrigger1 = AuthStateStore
  .map(value => value.get("status"))
  .distinctUntilChanged()
  .filter(status => status == AuthStatus.SIGNED_IN);

  // リロードアクションが実行されたとき（サインインしているなら）
  var loadTrigger2 = reloadSource()
  .withLatestFrom(AuthStateStore, (x, y) => y)
  .filter(authState => authState.get("status") == AuthStatus.SIGNED_IN);
  
  // ロード
  var loadProcess = Rx.Observable.merge(loadTrigger1, loadTrigger2)
  .map(() => {
    return Rx.Observable.fromPromise(loadListQuery().find())
    .map((list) => Immutable.Map({
      loading: false,
      list: Immutable.List(list),
    }))
    .startWith(Immutable.Map({
      loading: true,
      list: Immutable.List(),
    }))
    .catch((error) => {
      notifyError(error);
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

  return loadProcess
  .startWith(Immutable.Map({
    loading: false,
    list: Immutable.List(),
  }))
  .shareReplay(1);
}

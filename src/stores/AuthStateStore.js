import Immutable from "immutable";
import Parse from "../utils/ParseStub";
import Rx from "rx-lite";

import * as AuthActions from "../actions/AuthActions";
import * as ErrorActions from "../actions/ErrorActions";

import AuthStatus from "../constants/AuthStatus";

function getInitialState() {
  let initState;
  let user = Parse.User.current();
  if (user == null) {
    initState = Immutable.Map({
      status: AuthStatus.NOT_SIGNED_IN,
      user: null,
    });
  } else {
    initState = Immutable.Map({
      status: AuthStatus.SIGNED_IN,
      user: user,
    });
  }
  return initState;
}

// サインイン処理
let signInProcess = AuthActions.signInSource
.map((params) => {
  return Rx.Observable.fromPromise(Parse.User.logIn(params.name, params.password))
  .map(() => Immutable.Map({
    status: AuthStatus.SIGNED_IN,
    user: Parse.User.current(),
  }))
  .startWith(Immutable.Map({
    status: AuthStatus.SIGNING_IN,
    user: null,
  }))
  .catch((error) => {
    ErrorActions.notifyError("サインインできませんでした。", error.message);
    return Rx.Observable.just(
      Immutable.Map({
        status: AuthStatus.NOT_SIGNED_IN,
        user: null,
      })
    );
  });
})
.switch()
.shareReplay(1);

// サインアウト処理
let signOutProcess = AuthActions.signOutSource
.doOnNext(() => {
  Parse.User.logOut();
})
.map(() => Immutable.Map({
  status: AuthStatus.NOT_SIGNED_IN,
  user: null,
}))
.shareReplay(1);

// authStateStore
export default Rx.Observable.merge(signInProcess, signOutProcess)
.startWith(getInitialState())
.shareReplay(1);

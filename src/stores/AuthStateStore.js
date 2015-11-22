import Rx from "rx-lite";
import Immutable from "immutable";

import * as AuthActions from "../actions/AuthActions";
import * as ErrorActions from "../actions/ErrorActions";

var Status = {
  NOT_SIGNED_IN:      "not-signed-in",
  SIGNING_IN:         "signing-in",
  SIGNED_IN:          "signed-in",
};

export default class AuthStateStore {
  constructor() {
    var initState;
    var user = Parse.User.current();
    if (user == null) {
      initState = Immutable.Map({
        status: Status.NOT_SIGNED_IN,
        user: null,
      });
    } else {
      initState = Immutable.Map({
        status: Status.SIGNED_IN,
        user: user,
      });
    }
    
    // サインイン処理
    var signInProcess = AuthActions.signInSource
    .map((params) => {
      return Rx.Observable.fromPromise(Parse.User.logIn(params.name, params.password))
      .map(() => Immutable.Map({
        status: Status.SIGNED_IN,
        user: Parse.User.current(),
      }))
      .startWith(Immutable.Map({
        status: Status.SIGNING_IN,
        user: null,
      }))
      .catch((error) => {
        ErrorActions.notifyError("サインインできませんでした。", error.message);
        return Rx.Observable.just(
          Immutable.Map({
            status: Status.NOT_SIGNED_IN,
            user: null,
          })
        );
      });
    })
    .switch()
    .shareReplay(1);

    // サインアウト処理
    var signOutProcess = AuthActions.signOutSource
    .map(() => Immutable.Map({
      status: Status.NOT_SIGNED_IN,
      user: null,
    }))
    .shareReplay(1);

    this.source = Rx.Observable.merge(signInProcess, signOutProcess)
    .startWith(initState)
    .shareReplay(1);
  }

  getSource() {
    return this.source;
  }
}

AuthStateStore.Status = Status;

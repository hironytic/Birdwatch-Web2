import Immutable from "immutable";
import Parse from "../utils/ParseStub";
import Rx from "rx-lite";

import { signInAction, signOutAction } from "../actions/AuthActions";
import { notifyError } from "../actions/ErrorActions";

import AuthStatus from "../constants/AuthStatus";

import { createStore } from "../utils/FluxUtils";

function getInitialState() {
  let initState;
  const user = Parse.User.current();
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
const signInProcess = signInAction
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
        notifyError("サインインできませんでした。", error.message);
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
const signOutProcess = signOutAction
  .doOnNext(() => {
    Parse.User.logOut();
  })
  .map(() => Immutable.Map({
    status: AuthStatus.NOT_SIGNED_IN,
    user: null,
  }))
  .shareReplay(1);

// authStateStore
export default createStore("authStateStore",
  Rx.Observable.merge(signInProcess, signOutProcess)
    .startWith(getInitialState())
);

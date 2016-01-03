import Immutable from "../stubs/immutable";
import Parse from "../stubs/parse";
import Rx from "rx-lite-extras";

import { notifyError } from "../actions/ErrorActions";
import AuthStatus from "../constants/AuthStatus";
import { declareAction } from "../flux/Flux";

const signInSubject = new Rx.Subject();
const signOutSubject = new Rx.Subject();

export function signIn(name, password) {
  signInSubject.onNext({
    name: name,
    password: password,
  });
}

export function signOut() {
  signOutSubject.onNext();
}

// ストリームを流れるデータはこんな構造
// Immutable.Map({
//   status: AuthStatus.NOT_SIGNED_IN,
// })
declareAction("authAction", () => {
  const signInProcess = signInSubject
    .map(({ name, password }) => {
      return Rx.Observable
        .fromPromise(Parse.User.logIn(name, password))
        .map(() => Immutable.Map({
          status: AuthStatus.SIGNED_IN,
        }))
        .startWith(Immutable.Map({
          status: AuthStatus.SIGNING_IN,
        }))
        .catch((error) => {
          notifyError("サインインできませんでした。", error.message);
          return Rx.Observable.just(Immutable.Map({
              status: AuthStatus.NOT_SIGNED_IN,
          }));
        });
    })
    .switch()

  const signOutProcess = signOutSubject
    .doOnNext(() => {
      Parse.User.logOut();
    })
    .map(() => (Immutable.Map({
      status: AuthStatus.NOT_SIGNED_IN,
    })))
  
  return Rx.Observable.merge(signInProcess, signOutProcess);
});

import Parse from "../utils/ParseStub";
import Rx from "rx-lite-extras";

import { notifyError } from "../actions/ErrorActions";

import AuthStatus from "../constants/AuthStatus";

import { createAction } from "../utils/FluxUtils";

const signInSubject = new Rx.Subject();
const signInProcess = signInSubject
  .map((params) => {
    return Rx.Observable.fromPromise(Parse.User.logIn(params.name, params.password))
      .map(() => ({
        status: AuthStatus.SIGNED_IN,
        user: Parse.User.current(),
      }))
      .startWith({
        status: AuthStatus.SIGNING_IN,
        user: null,
      })
      .catch((error) => {
        notifyError("サインインできませんでした。", error.message);
        return Rx.Observable.just({
            status: AuthStatus.NOT_SIGNED_IN,
            user: null,
        });
      });
  })
  .switch()
  .shareReplay(1);

const signOutSubject = new Rx.Subject();
const signOutProcess = signOutSubject
  .doOnNext(() => {
    Parse.User.logOut();
  })
  .map(() => ({
    status: AuthStatus.NOT_SIGNED_IN,
    user: null,
  }))
  .shareReplay(1);


export const authAction = createAction("authAction",
  Rx.Observable.merge(signInProcess, signOutProcess)
);

export function signIn(name, password) {
  signInSubject.onNext({
    name: name,
    password: password,
  });
}

export function signOut() {
  signOutSubject.onNext();
}

import Rx from "rx-lite-extras";

import { createAction } from "../utils/FluxUtils";

const signInSubject = new Rx.Subject();
export const signInAction = createAction("signInAction", signInSubject);

const signOutSubject = new Rx.Subject();
export const signOutAction = createAction("signOutAction", signOutSubject);

export function signIn(name, password) {
  signInSubject.onNext({
    name: name,
    password: password,
  });
}

export function signOut() {
  signOutSubject.onNext();
}

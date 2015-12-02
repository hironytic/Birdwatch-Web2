import Rx from "rx-lite-extras";

const signInSubject = new Rx.Subject();
export const signInAction = signInSubject.observeOn(Rx.Scheduler.async);

const signOutSubject = new Rx.Subject();
export const signOutAction = signOutSubject.observeOn(Rx.Scheduler.async);

export function signIn(name, password) {
  signInSubject.onNext({
    name: name,
    password: password,
  });
}

export function signOut() {
  signOutSubject.onNext();
}

import Rx from "rx-lite";

var signInSubject = new Rx.Subject();
export var signInSource = signInSubject.observeOn(Rx.Scheduler.async);

var signOutSubject = new Rx.Subject();
export var signOutSource = signOutSubject.observeOn(Rx.Scheduler.async);

export function signIn(name, password) {
  signInSubject.onNext({
    name: name,
    password: password,
  });
}

export function signOut() {
  signOutSubject.onNext();
}

import Rx from "rx-lite-extras";

var reloadSubject = new Rx.Subject();
export var reloadSource = reloadSubject.observeOn(Rx.Scheduler.async);

export function reload() {
  reloadSubject.onNext();
}

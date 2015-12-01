import Rx from "rx-lite-extras";

const reloadSubject = new Rx.Subject();
export const reloadSource = reloadSubject.observeOn(Rx.Scheduler.async);

export function reload() {
  reloadSubject.onNext();
}

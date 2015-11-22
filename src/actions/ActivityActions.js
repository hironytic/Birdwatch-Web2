import Rx from "rx-lite-extras";

var activityChangeSubject = new Rx.Subject();
export var activityChangeSource = activityChangeSubject.observeOn(Rx.Scheduler.async);

export function activityChanged(fragment) {
  activityChangeSubject.onNext(fragment);
}

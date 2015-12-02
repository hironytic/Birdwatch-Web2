import Rx from "rx-lite-extras";

const activityChangeSubject = new Rx.Subject();
export const activityChangeAction = activityChangeSubject.observeOn(Rx.Scheduler.async);

export function activityChanged(fragment) {
  activityChangeSubject.onNext(fragment);
}

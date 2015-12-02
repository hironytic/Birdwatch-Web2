import Rx from "rx-lite-extras";

const reloadPlatformMasterSubject = new Rx.Subject();
export const reloadPlatformMasterAction = reloadPlatformMasterSubject.observeOn(Rx.Scheduler.async);

export function reloadPlatformMaster() {
  reloadPlatformMasterSubject.onNext();
}

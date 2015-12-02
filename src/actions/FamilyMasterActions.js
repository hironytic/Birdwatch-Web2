import Rx from "rx-lite-extras";

const reloadFamilyMasterSubject = new Rx.Subject();
export const reloadFamilyMasterAction = reloadFamilyMasterSubject.observeOn(Rx.Scheduler.async);

export function reloadFamilyMaster() {
  reloadFamilyMasterSubject.onNext();
}

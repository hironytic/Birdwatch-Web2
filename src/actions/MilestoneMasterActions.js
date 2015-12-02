import Rx from "rx-lite-extras";

const reloadMilestoneMasterSubject = new Rx.Subject();
export const reloadMilestoneMasterAction = reloadMilestoneMasterSubject.observeOn(Rx.Scheduler.async);

export function reloadMilestoneMaster() {
  reloadMilestoneMasterSubject.onNext();
}

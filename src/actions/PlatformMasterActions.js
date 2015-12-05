import Rx from "rx-lite-extras";

import { createAction } from "../utils/FluxUtils";

const reloadPlatformMasterSubject = new Rx.Subject();
export const reloadPlatformMasterAction = createAction("reloadPlatformMasterAction", reloadPlatformMasterSubject);

export function reloadPlatformMaster() {
  reloadPlatformMasterSubject.onNext();
}

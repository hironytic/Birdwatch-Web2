import Rx from "rx-lite-extras";

import { createAction } from "../utils/FluxUtils";

const reloadFamilyMasterSubject = new Rx.Subject();
export const reloadFamilyMasterAction = createAction("reloadFamilyMasterAction", reloadFamilyMasterSubject);

export function reloadFamilyMaster() {
  reloadFamilyMasterSubject.onNext();
}

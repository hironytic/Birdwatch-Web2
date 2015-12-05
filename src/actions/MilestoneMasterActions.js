import Rx from "rx-lite-extras";

import { createAction } from "../utils/FluxUtils";

const reloadMilestoneMasterSubject = new Rx.Subject();
export const reloadMilestoneMasterAction = createAction("reloadMilestoneMasterAction", reloadMilestoneMasterSubject);

export function reloadMilestoneMaster() {
  reloadMilestoneMasterSubject.onNext();
}

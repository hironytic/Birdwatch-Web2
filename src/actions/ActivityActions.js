import Rx from "rx-lite-extras";

import { createAction } from "../utils/FluxUtils";

const activityChangeSubject = new Rx.Subject();
export const activityChangeAction = createAction("activityChangeAction", activityChangeSubject);

export function activityChanged(fragment) {
  activityChangeSubject.onNext(fragment);
}

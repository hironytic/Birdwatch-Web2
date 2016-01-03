import Rx from "rx-lite-extras";

import { createAction } from "../flux/Flux";

const activityChangeSubject = new Rx.Subject();

export function activityChanged(fragment) {
  activityChangeSubject.onNext(fragment);
}

// ストリームを流れるデータは fragment の文字列
export const activityChangeAction = createAction("activityChangeAction", activityChangeSubject);

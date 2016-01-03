import Rx from "rx-lite-extras";

import { declareAction } from "../flux/Flux";

const activityChangeSubject = new Rx.Subject();

export function activityChanged(fragment) {
  activityChangeSubject.onNext(fragment);
}

// ストリームを流れるデータは fragment の文字列
declareAction("activityChangeAction", () => activityChangeSubject);

import Immutable from "../stubs/immutable";
import Rx from "rx-lite-extras";

import { declareAction } from "../flux/Flux";

const errorNotificationSubject = new Rx.Subject();
const clearErrorSubject = new Rx.Subject();
const clearAllErrorsSubject = new Rx.Subject();

export function notifyError(message1, message2) {
  errorNotificationSubject.onNext({
    message1: message1,
    message2: message2,
  });
}

export function clearError(errorId) {
  clearErrorSubject.onNext({
    id: errorId,
  });
}

export function clearAllErrors() {
  clearAllErrorsSubject.onNext();
}

// ストリームを流れるデータはこんな構造
// Immutable.Map({
//   message1: ...,
//   message2: ...,
// })
declareAction("errorNotificationAction", () => {
  return errorNotificationSubject
    .map(x => Immutable.fromJS(x))
});

// ストリームを流れるデータはこんな構造
// Immutable.Map({
//   id: "E1",
// })
declareAction("clearErrorAction", () => {
  return clearErrorSubject
    .map(x => Immutable.fromJS(x))  
});

// ストリームを流れるデータはundefiend（得に値なし）
declareAction("clearAllErrorsAction", () => clearAllErrorsSubject);

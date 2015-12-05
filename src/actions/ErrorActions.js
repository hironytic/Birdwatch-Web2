import Rx from "rx-lite-extras";

import { createAction } from "../utils/FluxUtils";

const errorNotificationSubject = new Rx.Subject();
export const errorNotificationAction = createAction("errorNotificationAction", errorNotificationSubject);

const clearErrorSubject = new Rx.Subject();
export const clearErrorAction = createAction("clearErrorAction", clearErrorSubject);

const clearAllErrorsSubject = new Rx.Subject();
export const clearAllErrorsAction = createAction("clearAllErrorsAction", clearAllErrorsSubject);

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

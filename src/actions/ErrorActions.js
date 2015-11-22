import Rx from "rx-lite-extras";

var errorNotificationSubject = new Rx.Subject();
export var errorNotificationSource = errorNotificationSubject.observeOn(Rx.Scheduler.async);

var clearErrorSubject = new Rx.Subject();
export var clearErrorSource = clearErrorSubject.observeOn(Rx.Scheduler.async);

var clearAllErrorsSubject = new Rx.Subject();
export var clearAllErrorsSource = clearAllErrorsSubject.observeOn(Rx.Scheduler.async);

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

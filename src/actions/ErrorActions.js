import Rx from "rx-lite-extras";

const errorNotificationSubject = new Rx.Subject();
export const errorNotificationSource = errorNotificationSubject.observeOn(Rx.Scheduler.async);

const clearErrorSubject = new Rx.Subject();
export const clearErrorSource = clearErrorSubject.observeOn(Rx.Scheduler.async);

const clearAllErrorsSubject = new Rx.Subject();
export const clearAllErrorsSource = clearAllErrorsSubject.observeOn(Rx.Scheduler.async);

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

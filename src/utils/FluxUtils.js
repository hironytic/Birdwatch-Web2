import Immutable from "immutable";
import Rx from "rx-lite-extras";

function asPlainObject(value) {
  if (value) {
    if (value.toJS) {
      value = value.toJS();
    }
  }
  return value;
}

export function createAction(name, observable) {
  return observable
    .doOnNext(value => {
      console.log(name + " :", asPlainObject(value));
    })
    .share()
    .observeOn(Rx.Scheduler.async)
}

export function createStore(name, observable) {
  return observable
    .doOnNext((value) => {
      console.log(name + " :", asPlainObject(value));
    })
    .shareReplay(1)
}

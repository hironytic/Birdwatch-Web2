import Rx from "rx-lite-extras";

export function createAction(name, observable) {
  return observable
    .doOnNext(value => {
      console.log(name + " :", value);
    })
    .share()
    .observeOn(Rx.Scheduler.async)
}

export function createStore(name, observable) {
  return observable
    .doOnNext((value) => {
      console.log(name + " :", value);
    })
    .shareReplay(1)
}

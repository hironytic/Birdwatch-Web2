import Rx from "rx-lite-extras";

export function createAction(name, observable) {
  return observable
    .doOnNext(value => {
      console.log("%c" + name + "%c :", "color:#24c", "",  value);
    })
    .share()
    .observeOn(Rx.Scheduler.async)
}

export function createStore(name, observable) {
  return observable
    .doOnNext((value) => {
      console.log("%c" + name + "%c :", "color:#284", "", value);
    })
    .shareReplay(1)
}

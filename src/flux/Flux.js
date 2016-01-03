import Immutable from "../stubs/immutable";
import Rx from "rx-lite-extras";

const actions = {};
const stores = {};

export function getStores() {
  return stores;
}

export function createAction(name, observableFunc) {
  actions[name] = observableFunc()
    .doOnNext(value => {
      console.log("%c" + name + "%c :", "color:#24c", "",  value);
    })
    .share()
    .observeOn(Rx.Scheduler.async)
}

export function createStore(name, observableFunc) {
  const store = observableFunc(actions)
    .doOnNext((value) => {
      console.log("%c" + name + "%c :", "color:#284", "", value);
    })
    .replay(1)

  // Storeのストリームはここで作られてずっと生きている状態にしておく
  store.connect();
  
  stores[name] = store
}

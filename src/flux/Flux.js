import Immutable from "../stubs/immutable";
import Rx from "rx-lite-extras";

let actionFactories = Immutable.Map();
let storeFactories = Immutable.Map();
let stores = {};

export function getActionFactory(name) {
  return actionFactories.get(name);
}

export function getStoreFactory(name) {
  return storeFactories.get(name);
}

export function getStores() {
  return stores;
}

export function declareAction(name, factory) {
  actionFactories = actionFactories.set(name, factory);
}

export function declareStore(name, factory) {
  storeFactories = storeFactories.set(name, factory);
}

function createActions() {
  const actions = {};
  actionFactories.forEach((factory, name) => {
    actions[name] = factory()
      .doOnNext(value => {
        console.log("%c" + name + "%c :", "color:#24c", "",  value);
      })
      .share()
      .observeOn(Rx.Scheduler.async)
  });
  return actions;
}

function createStores(actions) {
  stores = {};
  storeFactories.forEach((factory, name) => {
    const store = factory(actions)
      .debounce(10)
      .doOnNext((value) => {
        console.log("%c" + name + "%c :", "color:#284", "", value);
      })
      .replay(1)

    // Storeのストリームはここで作られてずっと生きている状態にしておく
    store.connect();
    
    stores[name] = store
  });
}

export function initFlux() {
  createStores(createActions());
}

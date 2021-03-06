import Immutable from "../stubs/immutable";
import Rx from "rx-lite-extras";

let actionFactories = Immutable.Map();
let storeFactories = Immutable.Map();
let storeDependencies = Immutable.Map();
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

export function declareStore(name, dependencies, factory) {
  if (factory == null) {
    factory = dependencies;
    dependencies = null;
  }
  
  if (dependencies != null) {
    if (!Array.isArray(dependencies)) {
      dependencies = [ dependencies ];
    }    
    storeDependencies = storeDependencies.set(name, dependencies);
  }  
  storeFactories = storeFactories.set(name, factory);
}

function createActions(params) {
  const actions = {};
  actionFactories.forEach((factory, name) => {
    actions[name] = factory(params)
      .doOnNext(value => {
        console.log("%c" + name + "%c :", "color:#24c", "",  value);
      })
      .share()
      .observeOn(Rx.Scheduler.async)
  });
  return actions;
}

function createOneStore(name, factory, actions, params) {
  if (stores[name] != null) {
    return;   // すでに作られているので何もしない
  }

  let factoryParams = { ...params, ...actions };
  
  // 依存関係があれば依存先を先に作成
  stores[name] = Rx.Observable.empty(); // 循環参照を避けるためのダミー
  const dependencies = storeDependencies.get(name);
  if (dependencies != null) {
    dependencies.forEach(depName => {
      createOneStore(actions, depName, null);
      factoryParams[depName] = stores[depName];
    });
  }

  // ストアを生成
  if (factory == null) {
    factory = storeFactories.get(name);
  }
  const store = factory(factoryParams)
    .debounce(10)
    .doOnNext((value) => {
      console.log("%c" + name + "%c :", "color:#284", "", value);
    })
    .replay(1)

  // Storeのストリームはここで作られてずっと生きている状態にしておく
  store.connect();
  
  stores[name] = store
}

function createStores(actions, params) {
  stores = {};
  storeFactories.forEach((factory, name) => {
    createOneStore(name, factory, actions, params);
  });
}

export function initFlux(params = {}) {
  createStores(createActions(params), params);
}

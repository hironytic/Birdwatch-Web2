import Rx from "rx-lite-extras";

const actionMap = {};

export function actions() {
  return actionMap;
}

export function createAction(name, observableFunc) {
  actionMap[name] = observableFunc()
    .doOnNext(value => {
      console.log("%c" + name + "%c :", "color:#24c", "",  value);
    })
    .share()
    .observeOn(Rx.Scheduler.async)
}

export function createStore(name, observable) {
  const store = observable
    .doOnNext((value) => {
      console.log("%c" + name + "%c :", "color:#284", "", value);
    })
    .replay(1)
  
  // Storeのストリームはここで作られてずっと生きている状態にしておく
  store.connect();
  
  return store;
}

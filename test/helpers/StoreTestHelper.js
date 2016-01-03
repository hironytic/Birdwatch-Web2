import Rx from "rx-lite-extras";
import { Promise } from "es6-promise";

import { getStoreFactory } from "../../src/flux/Flux";

export default class StoreTestHelper {
  constructor(storeName, mockActionNames) {
    this.isSubscribed = false;
    this.disposeBag = new Rx.CompositeDisposable();
    this.storeName = storeName;
    this.mockActions = {};
    mockActionNames.forEach(actionName => {
      this.mockActions[actionName] = new Rx.Subject();
    });    
  }
  
  dispose() {
    this.disposeBag.dispose();
  }
  
  _subscribe() {
    if (this.isSubscribed) {
      return;
    }
    
    const store = getStoreFactory(this.storeName)(this.mockActions)
      .share()
      .observeOn(Rx.Scheduler.async)
      .debounce(10)
    
    this.disposeBag.add(store.subscribe(data => {
      this.expectation(data);
      this.resolve(data);
    }));
    this.isSubscribed = true;
  }

  observe(proc, expectation) {
    return new Promise((resolve, reject) => {
      this.resolve = resolve;
      this.expectation = expectation;
      this._subscribe();
      proc(this.mockActions);
    });
  }
}

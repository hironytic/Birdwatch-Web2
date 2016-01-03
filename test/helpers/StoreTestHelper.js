import Immutable from "../../src/stubs/immutable";
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
    
    const store = getStoreFactory(this.storeName)(this.mockActions).observeOn(Rx.Scheduler.async);
    this.disposeBag.add(store.subscribe(data => {
      const expectation = this.expectations.first();
      expectation(data);
      
      this.expectations = this.expectations.shift();
      if (this.expectations.size == 0) {
        this.resolve(data);
      }
    }));
  }

  observe(proc, expectations) {
    return new Promise((resolve, reject) => {
      this.resolve = resolve;
      this.expectations = Immutable.fromJS(expectations);
      this._subscribe();
      proc(this.mockActions);
    });
  }
}

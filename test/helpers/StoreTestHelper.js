import Rx from "rx-lite-extras";

import { getStoreFactory } from "../../src/flux/Flux";

export default class StoreTestHelper {
  constructor(storeName, mockActionNames) {
    this.disposeBag = new Rx.CompositeDisposable();
    this.expectations = null;
    this.mockActions = {};
    mockActionNames.forEach(actionName => {
      this.mockActions[actionName] = new Rx.Subject();
    });
    
    const store = getStoreFactory(storeName)(this.mockActions);
    this.disposeBag.add(store.subscribe(data => {
      const expectation = this.expectations.shift();
      expectation(data);
    }));
  }
  
  dispose() {
    this.disposeBag.dispose();
  }
  
  observe(proc, expectations) {
    this.expectations = expectations;
    proc(this.mockActions);
  }
}

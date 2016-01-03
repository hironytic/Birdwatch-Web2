import Rx from "rx-lite-extras";

import { getStoreFactory } from "../../src/flux/Flux";

export default class StoreTestHelper {
  constructor(storeName, mockActionNames) {
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
  
  observe(proc, expectations) {
    const store = getStoreFactory(this.storeName)(this.mockActions);
    this.disposeBag.add(store.subscribe(data => {
      const expectation = expectations.shift();
      expectation(data);
    }));
    
    proc(this.mockActions);
  }
}

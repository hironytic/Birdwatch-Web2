import Rx from "rx-lite-extras";

import { getActionFactory } from "../../src/flux/Flux";

export default class ActionTestHelper {
  constructor(...actionNames) {
    this.disposeBag = new Rx.CompositeDisposable();
    this.actionNames = actionNames;
  }
  
  dispose() {
    this.disposeBag.dispose();
  }
  
  observe(proc, expectations) {
    this.actionNames.forEach(actionName => {
      const action = getActionFactory(actionName)();
      this.disposeBag.add(action.subscribe(data => {
        const expectation = expectations[actionName].shift();
        expectation(data);
      }));
    });
    
    proc();
  }
}

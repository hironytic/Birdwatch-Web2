import Immutable from "../../src/stubs/immutable";
import { Promise } from "es6-promise";
import Rx from "rx-lite-extras";

import { getActionFactory } from "../../src/flux/Flux";

export default class ActionTestHelper {
  constructor(...actionNames) {
    this.isSubscribed = false;
    this.disposeBag = new Rx.CompositeDisposable();
    this.actionNames = actionNames;
    this.fluxParams = {};
  }
  
  initFlux(fluxParams) {
    this.fluxParams = fluxParams;
  }
  
  dispose() {
    this.disposeBag.dispose();
  }

  _subscribe() {
    if (this.isSubscribed) {
      return;
    }

    this.actionNames.forEach(actionName => {
      const action = getActionFactory(actionName)(this.fluxParams).observeOn(Rx.Scheduler.async);
      this.disposeBag.add(action.subscribe(data => {
        let expectationsForAction = this.expectations.get(actionName);
        const expectation = expectationsForAction.first();
        expectation(data);
        
        expectationsForAction = expectationsForAction.shift();
        if (expectationsForAction.size == 0) {
          this.expectations = this.expectations.remove(actionName);
          if (this.expectations.size == 0) {
            this.resolve(data);
          }
        } else {
          this.expectations = this.expectations.set(actionName, expectationsForAction);
        }        
      }));
    });
    this.isSubscribed = true;
  }  
  
  observe(proc, expectations) {
    return new Promise((resolve, reject) => {
      this.resolve = resolve;
      this.expectations = Immutable.fromJS(expectations);
      this._subscribe();
      proc();
    });
  }
}

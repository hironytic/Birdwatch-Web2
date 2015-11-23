import Rx from "rx-lite-extras";
import Immutable from "immutable";

import * as ErrorActions from "../actions/ErrorActions";

var lastErrorId = 0;

export default class ErrorStore {
  constructor() {
    var newErrorSource = ErrorActions.errorNotificationSource
    .map((value) => ({type:"new", value:value}));
    var clearErrorSource = ErrorActions.clearErrorSource
    .map((value) => ({type:"clear", value:value}));
    var clearAllErrorsSource = ErrorActions.clearAllErrorsSource
    .map(() => ({type:"clearAll"}));
    
    this.source = Rx.Observable.merge(newErrorSource, clearErrorSource, clearAllErrorsSource)
    .scan((acc, cur) => {
      var index;
      switch(cur.type) {
        case "new":
          lastErrorId++;
          return acc.push(Immutable.Map().withMutations((map) => {
            map.merge(cur.value);
            map.set("id", "E" + lastErrorId);
          }));
          break;
        case "clear":
          index = acc.findIndex(value => value.get("id") == cur.value.id);
          return (index >= 0) ? acc.delete(index) : acc;
          break;
        case "clearAll":
          return Immutable.List();
          break;
      }
      return acc; // ここには来ないはず
    }, Immutable.List())
    .startWith(Immutable.List());
  }
  
  getSource() {
    return this.source;
  }
}
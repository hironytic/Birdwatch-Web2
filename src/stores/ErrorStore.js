import Rx from "rx-lite-extras";
import Immutable from "immutable";

import * as ErrorActions from "../actions/ErrorActions";

import { createStore } from "../utils/FluxUtils";

let lastErrorId = 0;

const newErrorSource = ErrorActions.errorNotificationAction
  .map((value) => ({type:"new", value:value}));

const clearErrorSource = ErrorActions.clearErrorAction
  .map((value) => ({type:"clear", value:value}));

const clearAllErrorsSource = ErrorActions.clearAllErrorsAction
  .map(() => ({type:"clearAll"}));

export default createStore("errorStore",
  Rx.Observable.merge(newErrorSource, clearErrorSource, clearAllErrorsSource)
    .scan((acc, cur) => {
      let index;
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
    .startWith(Immutable.List())
);

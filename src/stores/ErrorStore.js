import Immutable from "../stubs/immutable";
import Rx from "rx-lite-extras";

import { errorNotificationAction, clearErrorAction, clearAllErrorsAction } from "../actions/ErrorActions";
import { createStore } from "../utils/FluxUtils";

let lastErrorId = 0;

const newErrorOperation = errorNotificationAction
  .map(value => state => {
    lastErrorId++;
    return state.push(value.set("id", "E" + lastErrorId));
  })

const clearErrorOperation = clearErrorAction
  .map(value => state => {
    const index = state.findIndex(value => value.get("id") == value.get("id"));
    return (index >= 0) ? state.delete(index) : state;
  })

const clearAllErrorsOperation = clearAllErrorsAction
  .map(value => state => {
    return Immutable.List();
  })

const store = Rx.Observable
  .merge(newErrorOperation, clearErrorOperation, clearAllErrorsOperation)
  .scan((state, operation) => operation(state), Immutable.List())
  .startWith(Immutable.List())

// ストリームを流れるデータはこんな構造
// Immutable.List([
//   Immutable.Map({
//     id: "E1",
//     message1: ...,
//     message2: ...,
//   }),
//   ...
// ])
export default createStore("errorStore", store);

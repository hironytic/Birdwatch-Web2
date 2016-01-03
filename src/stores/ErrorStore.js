import Immutable from "../stubs/immutable";
import Rx from "rx-lite-extras";

import { declareStore } from "../flux/Flux";

// ストリームを流れるデータはこんな構造
// Immutable.List([
//   Immutable.Map({
//     id: "E1",
//     message1: ...,
//     message2: ...,
//   }),
//   ...
// ])
declareStore("errorStore", ({ errorNotificationAction, clearErrorAction, clearAllErrorsAction }) => {
  const newErrorOperation = errorNotificationAction
    .scan((acc, value) => {
      return acc.set("idSeed", acc.get("idSeed") + 1).set("data", value);
    }, Immutable.Map({"idSeed": 0}))
    .map(value => state => {
      return state.push(value.get("data").set("id", "E" + value.get("idSeed")));
    })

  const clearErrorOperation = clearErrorAction
    .map(value => state => {
      const index = state.findIndex(item => value.get("id") == item.get("id"));
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
  
  return store;
});

import Immutable from "../stubs/immutable";
import Rx from "rx-lite-extras";

import { createStore } from "../utils/FluxUtils";

export default function createMasterStore(name, { getMasterLoadAllAction }) {
  const masterLoadAllAction = getMasterLoadAllAction();
  const loadingState = masterLoadAllAction
    .map(item => item.get("loading"))
    .startWith(false)

  const reloadItemsOperation = masterLoadAllAction
  .map(item => item.get("items"))
  .filter(items => items != null)
  .map(items => state => {
    return items;
  })

  const itemsState = reloadItemsOperation
    .scan((state, operation) => operation(state), Immutable.Map())
    .startWith(Immutable.Map())
  
  const store = Rx.Observable
    .combineLatest(
      loadingState,
      itemsState,
      (loading, items) => (Immutable.Map({ loading, items })))
  
  return createStore(name, store);
}

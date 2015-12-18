import Immutable from "../stubs/immutable";
import Rx from "rx-lite-extras";

import LoadStatus from "../constants/LoadStatus";

import { createStore } from "../utils/FluxUtils";

export default function createMasterStore(name, { getMasterAction, makeStoreItem }) {
  const store = createStore(name,
    getMasterAction()
      .map(param => {
        const items = Immutable.Map().withMutations(map => {
          param.list.reduce((acc, item) => acc.set(item.id, makeStoreItem(item)), map);
        });
        return Immutable.Map({
          loadStatus: param.loadStatus,
          items: items,
        })
      })
      .startWith(Immutable.Map({
        loadStatus: LoadStatus.NOT_LOADED,
        items: Immutable.Map(),
      }))
  );
  
  // マスターは見ている人がいなくなっても、ずっといてほしいので
  // ここでずっと見ている人を作っておく
  store.subscribe();
  
  return store;
}

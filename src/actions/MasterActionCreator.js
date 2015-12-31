import Immutable from "../stubs/immutable";
import Rx from "rx-lite-extras";

import { createAction } from "../utils/FluxUtils";

export default function createMasterLoadAllAction(name, {getReloadSource, loadListQuery, makeListItem, notifyError}) {
  return createAction(name,
    getReloadSource()
      .map(() => {
        return Rx.Observable.fromPromise(loadListQuery().find())
          .map(list => {
            const items = Immutable.Map().withMutations(initial => {
              list.reduce((acc, item) => {
                return acc.set(item.id, makeListItem(item));
              }, initial);
            });
            
            return Immutable.Map({
              loading: false,
              items: items,
            });
          })
          .startWith(Immutable.Map({
            loading: true,
          }))
          .catch((error) => {
            notifyError(error);
            return Rx.Observable.just(Immutable.Map({
              loading: false,
            }));
          });
      })
      .switch()
  );
}

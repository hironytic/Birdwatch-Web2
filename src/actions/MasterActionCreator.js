import Immutable from "../stubs/immutable";
import Rx from "rx-lite-extras";

import { declareAction } from "../flux/Flux";

export default function createMasterLoadAllAction(name, {getReloadSource, loadListQuery, makeListItem, notifyError}) {
  declareAction(name, ({ db }) => {
    return getReloadSource()
      .map(() => {
        return Rx.Observable.fromPromise(db.find(loadListQuery(db)))
          .map(list => {
            const items = Immutable.Map().withMutations(initial => {
              list.reduce((acc, item) => {
                return acc.set(item.getId(), makeListItem(item));
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
  });
}

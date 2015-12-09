import Rx from "rx-lite-extras";

import LoadStatus from "../constants/LoadStatus";

import { createAction } from "../utils/FluxUtils";

export default function createMasterAction(name, {getReloadSource, loadListQuery, notifyError}) {
  return createAction(name,
    getReloadSource()
      .map(() => {
        return Rx.Observable.fromPromise(loadListQuery().find())
          .map((list) => ({
            loadStatus: LoadStatus.LOADED,
            list: list,
          }))
          .startWith({
            loadStatus: LoadStatus.LOADING,
            list: [],
          })
          .catch((error) => {
            notifyError(error);
            return Rx.Observable.just({
              loadStatus: LoadStatus.NOT_LOADED,
              list: [],
            });
          });
      })
      .switch()
  );
}

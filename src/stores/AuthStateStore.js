import Immutable from "immutable";
import Parse from "../utils/ParseStub";

import { authAction } from "../actions/AuthActions";

import AuthStatus from "../constants/AuthStatus";

import { createStore } from "../utils/FluxUtils";

function getInitialState() {
  let initState;
  const user = Parse.User.current();
  if (user == null) {
    initState = Immutable.Map({
      status: AuthStatus.NOT_SIGNED_IN,
      user: null,
    });
  } else {
    initState = Immutable.Map({
      status: AuthStatus.SIGNED_IN,
      user: user,
    });
  }
  return initState;
}

export default createStore("authStateStore",
  authAction
    .map(params => Immutable.Map({
      status: params.status,
      user: params.user,
    }))
    .startWith(getInitialState())
);

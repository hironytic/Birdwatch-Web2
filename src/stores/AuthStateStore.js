import Immutable from "../stubs/immutable";
import Parse from "../stubs/parse";

import AuthStatus from "../constants/AuthStatus";
import { declareStore } from "../flux/Flux";

function makeUserInfo(user) {
  return Immutable.Map({
    name: user.get("username"),
  });
}

function getInitialState() {
  const user = Parse.User.current();
  if (user == null) {
    return Immutable.Map({
      status: AuthStatus.NOT_SIGNED_IN,
    });
  } else {
    return Immutable.Map({
      status: AuthStatus.SIGNED_IN,
      user: makeUserInfo(user),
    });
  }
}

// ストリームを流れるデータはこんな構造
// Immutable.Map({
//   status: AuthStatus.SIGNED_IN,
//   user: ...,
// })
declareStore("authStateStore", ({ authAction }) => {
  return authAction
    .map(value => {
      if (value.get("status") == AuthStatus.SIGNED_IN) {
        return value.set("user", makeUserInfo(Parse.User.current()));
      } else {
        return value;
      }
    })
    .startWith(getInitialState())
});

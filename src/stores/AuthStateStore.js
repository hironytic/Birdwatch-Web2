import Immutable from "../stubs/immutable";

import AuthStatus from "../constants/AuthStatus";
import { declareStore } from "../flux/Flux";

function makeUserInfo(user) {
  return Immutable.Map({
    name: user.name,
  });
}

function getInitialState(auth) {
  const user = auth.getCurrentUserInfo();
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
declareStore("authStateStore", ({ auth, authAction }) => {
  return authAction
    .map(value => {
      if (value.get("status") == AuthStatus.SIGNED_IN) {
        return value.set("user", makeUserInfo(auth.getCurrentUserInfo()));
      } else {
        return value;
      }
    })
    .startWith(getInitialState(auth))
});

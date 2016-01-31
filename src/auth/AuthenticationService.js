import Parse from "../stubs/parse";
import { Promise } from "es6-promise";

export default class AuthenticationService {
  constructor() {
    
  }

  _currentUserInfo(user) {
    if (user == null) {
      return null;
    }
    
    return {
      name: user.getUsername(),
    };
  }

  getCurrentUserInfo() {
    const current = Parse.User.current();
    return this._currentUserInfo(current);
  }
  
  signIn(userName, password) {
    return Promise.resolve(Parse.User.logIn(userName, password))
      .then(user => this._currentUserInfo(user))
  }
  
  signOut() {
    return Promise.resolve(Parse.User.logOut());
  }
}

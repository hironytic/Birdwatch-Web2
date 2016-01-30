import Parse from "../stubs/parse";
import { Promise } from "es6-promise";

export default class AuthenticationService {
  constructor() {
    
  }

  getCurrentUserInfo() {
    const current = Parse.User.current();
    if (current == null) {
      return null;
    }
    
    return {
      name: current.getUsername(),
    };
  }
  
  signIn(userName, password) {
    return Promise.resolve(Parse.User.logIn(userName, password));
  }
  
  signOut() {
    return Promise.resolve(Parse.User.logOut());
  }
}

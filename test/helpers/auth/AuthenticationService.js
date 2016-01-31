import { Promise } from "es6-promise";

export default class AuthenticationService {
  constructor() {
    this.currentUserInfo = null;
    this.errorOnSigningIn = null;
    this.errorOnSigningOut = null;
  }

  getCurrentUserInfo() {
    return this.currentUserInfo;
  }
  
  signIn(userName, password) {
    if (this.errorOnSigningIn) {
      return Promise.reject(this.errorOnSigningIn);
    } else {
      this.currentUserInfo = {
        name: userName,
      };
      return Promise.resolve(this.getCurrentUserInfo());
    }
  }
  
  signOut() {
    if (this.errorOnSigningOut) {
      return Promise.reject(this.errorOnSigningOut);
    } else {
      this.currentUserInfo = null;
      return Promise.resolve();
    }
  }

  setErrorOnSigningIn(error) {
    this.errorOnSigningIn = error;
  }
  
  setErrorOnSigningOut(error) {
    this.errorOnSigningOut = error;    
  }
}

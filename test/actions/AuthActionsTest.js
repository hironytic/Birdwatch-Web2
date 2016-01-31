import Immutable from "../../src/stubs/immutable";
import { Promise } from "es6-promise";

import AuthenticationService from "../helpers/auth/AuthenticationService";
import ActionTestHelper from "../helpers/ActionTestHelper";
import { signIn, signOut } from "../../src/actions/AuthActions";
import AuthStatus from "../../src/constants/AuthStatus";

describe("AuthActions", function() {
  let helper;
  
  beforeEach(function() {
    helper = new ActionTestHelper("authAction", "errorNotificationAction");
  });
  
  afterEach(function() {
    helper.dispose();
  });
    
  describe("signIn", function() {
    it("should make user signed in, and generate authAction", function(done) {
      const auth = new AuthenticationService();
      helper.initFlux({ auth });
      
      helper.observe(
        () => {
          signIn("user", "password");
        },
        {
          "authAction": [
            data => {
              expect(data).to.be.an(Immutable.Map);
              expect(data.get("status")).to.be(AuthStatus.SIGNING_IN);
            },
            
            data => {
              expect(data).to.be.an(Immutable.Map);
              expect(data.get("status")).to.be(AuthStatus.SIGNED_IN);
            }
          ],
        }
      ).then(() => {
        expect(auth.getCurrentUserInfo()).to.be.ok();
        expect(auth.getCurrentUserInfo().name).to.be("user");
      }).then(() => { done() });
    });
    
    it("should generate errorNotificationAction on failure", function(done) {
      const auth = new AuthenticationService();
      helper.initFlux({ auth });
      
      auth.setErrorOnSigningIn({ message: "Invalid user or password" });
      
      helper.observe(
        () => {
          signIn("user", "password");
        },
        {
          "authAction": [
            data => {
              expect(data).to.be.an(Immutable.Map);
              expect(data.get("status")).to.be(AuthStatus.SIGNING_IN);
            },
            
            data => {
              expect(data).to.be.an(Immutable.Map);
              expect(data.get("status")).to.be(AuthStatus.NOT_SIGNED_IN);
            }
          ],
          
          "errorNotificationAction": [
            data => {
              expect(data.get("message2")).to.be("Invalid user or password");
            },
          ],
        }
      ).then(() => { done() });
    });
    
  });
  
  describe("signOut", function() {
    it("should make user signed out, and generate authAction", function() {
      const auth = new AuthenticationService();
      helper.initFlux({ auth });
      
      return Promise.resolve().then(() => {
        return auth.signIn("user1", "pass");
      }).then(() => {
        return helper.observe(
          () => {
            signOut();
          },
          {
            "authAction": [
              data => {
                expect(data).to.be.an(Immutable.Map);
                expect(data.get("status")).to.be(AuthStatus.NOT_SIGNED_IN);
              },
            ],
          }
        );
      }).then(() => {
        expect(auth.getCurrentUserInfo()).not.to.be.ok();
      });
    });
  });
  
});
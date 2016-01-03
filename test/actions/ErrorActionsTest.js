import Immutable from "../../src/stubs/immutable";

import ActionTestHelper from "../helpers/ActionTestHelper";
import { notifyError, clearError, clearAllErrors } from "../../src/actions/ErrorActions";

describe("ErrorActions", function() {
  let helper;

  beforeEach(function() {
    helper = new ActionTestHelper("errorNotificationAction", "clearErrorAction", "clearAllErrorsAction");
  });
  
  afterEach(function() {
    helper.dispose();
  });
    
  describe("notifyError", function() {
    it("should generate errorNotificationAction", function(done) {
      helper.observe(
        () => {
          notifyError("message one", "message two");
        },
        {
          "errorNotificationAction": [
            data => {
              expect(data).to.be.an(Immutable.Map);
              expect(data.get("message1")).to.be("message one");
              expect(data.get("message2")).to.be("message two");
            }
          ],
        }
      ).then(() => { done() });
    });
  });
  
  describe("clearError", function() {
    it("should generate clearErrorAction", function(done) {
      helper.observe(
        () => {
          clearError("E1");
        },
        {
          "clearErrorAction": [
            data => {
              expect(data).to.be.a(Immutable.Map);
              expect(data.get("id")).to.be("E1");
            }
          ],
        }
      ).then(() => { done() });
    });
  });
  
  describe("clearAllErrors", function() {
    it("should generate clearAllErrorsAction", function(done) {
      helper.observe(
        () => {
          clearAllErrors();
        },
        {
          "clearAllErrorsAction": [
            data => {
              expect(data).not.to.be.ok();
            }
          ]
        }
      ).then(() => { done() });
    });
  });
});

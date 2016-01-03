import Immutable from "../../src/stubs/immutable";

import StoreTestHelper from "../helpers/StoreTestHelper";
import "../../src/stores/ErrorStore";

describe("ErrorStore", function() {
  let helper;

  beforeEach(function() {
    helper = new StoreTestHelper("errorStore", [
      "errorNotificationAction",
      "clearErrorAction", 
      "clearAllErrorsAction"
    ]);
  });
  
  afterEach(function() {
    helper.dispose();
  });
  
  it("should have no error on beginning", function(done) {
    helper.observe(
      () => {
      },
      [
        data => {
          expect(data).to.be.an(Immutable.List);
          expect(data.size).to.be(0);
          done();
        },
      ]
    );
  });
  
  it("should hold an error", function(done) {
    helper.observe(
      ({ errorNotificationAction }) => {
        errorNotificationAction.onNext(Immutable.Map({
          message1: "message one",
          message2: "message two",
        }));
      },
      [
        data => {
          expect(data.size).to.be(0);
        },
        data => {
          expect(data.size).to.be(1);
          expect(data.get(0).get("message1")).to.be("message one");
          expect(data.get(0).get("message2")).to.be("message two");
          done();
        },
      ]
    );
  });
});

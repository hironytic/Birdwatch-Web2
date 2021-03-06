import Immutable from "../../src/stubs/immutable";

import StoreTestHelper from "../helpers/StoreTestHelper";
import "../../src/stores/ErrorStore";

describe("errorStore", function() {
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
  
  it("should have no error on beginning", function() {
    return helper.observe(
      () => {
      },
      data => {
        expect(data).to.be.an(Immutable.List);
        expect(data.size).to.be(0);
      }
    );
  });
  
  it("should hold an error", function() {
    return helper.observe(
      ({ errorNotificationAction }) => {
        errorNotificationAction.onNext(Immutable.Map({
          message1: "message one",
          message2: "message two",
        }));
      },
      data => {
        expect(data.size).to.be(1);
        expect(data.get(0).get("message1")).to.be("message one");
        expect(data.get(0).get("message2")).to.be("message two");
        expect(data.get(0).get("id")).to.be.ok();
      }
    );
  });
  
  it("should hold two errors", function() {
    return helper.observe(
      ({ errorNotificationAction }) => {
        errorNotificationAction.onNext(Immutable.Map({
          message1: "message 1-1",
          message2: "message 1-2",
        }));
        errorNotificationAction.onNext(Immutable.Map({
          message1: "message 2-1",
          message2: "message 2-2",
        }));
      },
      data => {
        expect(data.size).to.be(2);
        expect(data.get(0).get("message1")).to.be("message 1-1");
        expect(data.get(0).get("message2")).to.be("message 1-2");
        expect(data.get(1).get("message1")).to.be("message 2-1");
        expect(data.get(1).get("message2")).to.be("message 2-2");
      }
    );
  });
  
  it("should clear the error", function() {
    return helper.observe(
      ({ errorNotificationAction }) => {
        errorNotificationAction.onNext(Immutable.Map({
          message1: "message 1-1",
          message2: "message 1-2",
        }));
        errorNotificationAction.onNext(Immutable.Map({
          message1: "message 2-1",
          message2: "message 2-2",
        }));
      },
      data => {
        expect(data.size).to.be(2);
        expect(data.get(0).get("message1")).to.be("message 1-1");
        expect(data.get(0).get("message2")).to.be("message 1-2");
        expect(data.get(1).get("message1")).to.be("message 2-1");
        expect(data.get(1).get("message2")).to.be("message 2-2");
      }
    ).then((data) => helper.observe(
      ({ clearErrorAction }) => {
        const id = data.get(0).get("id");
        clearErrorAction.onNext(Immutable.Map({
          id: id,
        }));
      },
      data => {
        expect(data.size).to.be(1);
        expect(data.get(0).get("message1")).to.be("message 2-1");
        expect(data.get(0).get("message2")).to.be("message 2-2");
      }
    ));
  });
  
  it("should clear all errors", function() {
    return helper.observe(
      ({ errorNotificationAction }) => {
        errorNotificationAction.onNext(Immutable.Map({
          message1: "message 1-1",
          message2: "message 1-2",
        }));
        errorNotificationAction.onNext(Immutable.Map({
          message1: "message 2-1",
          message2: "message 2-2",
        }));
      },
      data => {
        expect(data.size).to.be(2);
      }
    ).then((data) => helper.observe(
      ({ clearAllErrorsAction }) => {
        clearAllErrorsAction.onNext();
      },
      data => {
        expect(data.size).to.be(0);
      }
    ));
  });
});

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
        },
      ]
    ).then(() => { done() });
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
          expect(data.get(0).get("id")).to.be.ok();
        },
      ]
    ).then(() => { done() });
  });
  
  it("should hold two errors", function(done) {
    helper.observe(
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
      [
        data => {
          expect(data.size).to.be(0);
        },
        data => {
          expect(data.size).to.be(1);
          expect(data.get(0).get("message1")).to.be("message 1-1");
          expect(data.get(0).get("message2")).to.be("message 1-2");
        },
        data => {
          expect(data.size).to.be(2);
          expect(data.get(0).get("message1")).to.be("message 1-1");
          expect(data.get(0).get("message2")).to.be("message 1-2");
          expect(data.get(1).get("message1")).to.be("message 2-1");
          expect(data.get(1).get("message2")).to.be("message 2-2");
        },
      ]
    ).then(() => { done() });
  });
  
  it("should clear the error", function(done) {
    helper.observe(
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
      [
        data => {
          expect(data.size).to.be(0);
        },
        data => {
          expect(data.size).to.be(1);
        },
        data => {
          expect(data.size).to.be(2);
          expect(data.get(0).get("message1")).to.be("message 1-1");
          expect(data.get(0).get("message2")).to.be("message 1-2");
          expect(data.get(1).get("message1")).to.be("message 2-1");
          expect(data.get(1).get("message2")).to.be("message 2-2");
        },
      ]
    ).then((data) => {
      const id = data.get(0).get("id");
      return helper.observe(
        ({ clearErrorAction }) => {
          clearErrorAction.onNext(Immutable.Map({
            id: id,
          }));
        },
        [
          data => {
            expect(data.size).to.be(1);
            expect(data.get(0).get("message1")).to.be("message 2-1");
            expect(data.get(0).get("message2")).to.be("message 2-2");
          },
        ]
      );
    }).then(() => { done() });    
  });
  
  it("should clear all errors", function(done) {
    helper.observe(
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
      [
        data => {
          expect(data.size).to.be(0);
        },
        data => {
          expect(data.size).to.be(1);
        },
        data => {
          expect(data.size).to.be(2);
          expect(data.get(0).get("message1")).to.be("message 1-1");
          expect(data.get(0).get("message2")).to.be("message 1-2");
          expect(data.get(1).get("message1")).to.be("message 2-1");
          expect(data.get(1).get("message2")).to.be("message 2-2");
        },
      ]
    ).then((data) => {
      const id = data.get(0).get("id");
      return helper.observe(
        ({ clearAllErrorsAction }) => {
          clearAllErrorsAction.onNext();
        },
        [
          data => {
            expect(data.size).to.be(0);
          },
        ]
      );
    }).then(() => { done() });    
  });  
});

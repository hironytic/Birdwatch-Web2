import Immutable from "../../src/stubs/immutable";

import StoreTestHelper from "../helpers/StoreTestHelper";
import "../../src/stores/ActivityStore";

describe("ActivityStore", function() {
  let helper;

  beforeEach(function() {
    helper = new StoreTestHelper("activityStore", ["activityChangeAction"]);
  });
  
  afterEach(function() {
    helper.dispose();
  });
  
  it("should hold activityPath and params", function(done) {
    helper.observe(
      ({ activityChangeAction }) => {
        activityChangeAction.onNext("/project");
      },
      [
        data => {
          expect(data).to.be.an(Immutable.Map);
          expect(data.get("activityPath")).to.be.an(Immutable.List);
          expect(data.get("activityPath").toJS()).to.eql(["project"]);
          expect(data.get("params")).to.be.an(Immutable.Map);
          expect(data.get("params").toJS()).to.eql({});
        },
      ]
    ).then(() => { done() });
  });
  
  it("should hold activityPath which is split as array", function(done) {
    helper.observe(
      ({ activityChangeAction }) => {
        activityChangeAction.onNext("/project/hogexegoh");
      },
      [
        data => {
          expect(data.get("activityPath").toJS()).to.eql(["project", "hogexegoh"]);
        },
      ]
    ).then(() => { done() });
  }); 
  
  it("should change activityPath", function(done) {
    helper.observe(
      ({ activityChangeAction }) => {
        activityChangeAction.onNext("/project");
        activityChangeAction.onNext("/settings");
      },
      [
        data => {
          expect(data.get("activityPath").toJS()).to.eql(["project"]);
        },
        data => {
          expect(data.get("activityPath").toJS()).to.eql(["settings"]);
        },
      ]   
    ).then(() => { done() });
  });
  
  it("should hold \"timeline\" when fragment is not specified", function(done) {
    helper.observe(
      ({ activityChangeAction }) => {
        activityChangeAction.onNext("");
      },
      [
        data => {
          expect(data.get("activityPath").toJS()).to.eql(["timeline"]);
        },
      ]
    ).then(() => { done() });
  });
});

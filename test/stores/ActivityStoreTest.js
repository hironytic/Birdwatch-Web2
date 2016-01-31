import Immutable from "../../src/stubs/immutable";

import StoreTestHelper from "../helpers/StoreTestHelper";
import "../../src/stores/ActivityStore";

describe("activityStore", function() {
  let helper;

  beforeEach(function() {
    helper = new StoreTestHelper("activityStore", ["activityChangeAction"]);
  });
  
  afterEach(function() {
    helper.dispose();
  });
  
  it("should hold activityPath and params", function() {
    return helper.observe(
      ({ activityChangeAction }) => {
        activityChangeAction.onNext("/project");
      },
      data => {
        expect(data).to.be.an(Immutable.Map);
        expect(data.get("activityPath")).to.be.an(Immutable.List);
        expect(data.get("activityPath").toJS()).to.eql(["project"]);
        expect(data.get("params")).to.be.an(Immutable.Map);
        expect(data.get("params").toJS()).to.eql({});
      }
    );
  });
  
  it("should hold activityPath which is split as array", function() {
    return helper.observe(
      ({ activityChangeAction }) => {
        activityChangeAction.onNext("/project/hogexegoh");
      },
      data => {
        expect(data.get("activityPath").toJS()).to.eql(["project", "hogexegoh"]);
      }
    );
  }); 
  
  it("should change activityPath", function() {
    return helper.observe(
      ({ activityChangeAction }) => {
        activityChangeAction.onNext("/project");
      },
      data => {
        expect(data.get("activityPath").toJS()).to.eql(["project"]);
      }
    ).then(() => helper.observe(
      ({ activityChangeAction }) => {
        activityChangeAction.onNext("/settings");
      },
      data => {
        expect(data.get("activityPath").toJS()).to.eql(["settings"]);
      }
    ));
  });
  
  it("should hold \"timeline\" when fragment is not specified", function() {
    return helper.observe(
      ({ activityChangeAction }) => {
        activityChangeAction.onNext("");
      },
      data => {
        expect(data.get("activityPath").toJS()).to.eql(["timeline"]);
      }
    );
  });
});

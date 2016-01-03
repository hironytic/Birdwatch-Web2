import ActionTestHelper from "../helpers/ActionTestHelper";
import { activityChanged } from "../../src/actions/ActivityActions";

describe("ActivityActions", function() {
  let helper;

  beforeEach(function() {
    helper = new ActionTestHelper("activityChangeAction");
  });
  
  afterEach(function() {
    helper.dispose();
  });
    
  describe("activityChanged", function() {
    it("should generate activityChangeAction", function(done) {
      helper.observe(
        () => {
          activityChanged("foo");
          activityChanged("hoge");
        },
        {
          "activityChangeAction": [
            data => { expect(data).to.be("foo"); },
            data => { expect(data).to.be("hoge"); },
          ]
        }
      ).then(() => { done() });
    });
  });
});

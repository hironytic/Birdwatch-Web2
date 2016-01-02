import { parseFragment, makeFragment } from "../../src/utils/ActivityUtils";

describe("ActivityUtils", function() {
  describe("parseFragment", function() {
    it("should parse activity path", function() {
      expect(parseFragment("/xxx/yyy/zzz").activityPath).to.eql(["xxx", "yyy", "zzz"]);
    });    
  });
  
  describe("makeFragment", function() {
    it("should transform activity path", function() {
      expect(makeFragment(["aaa", "bbb"])).to.be.equal("/aaa/bbb");
    })
  })
});

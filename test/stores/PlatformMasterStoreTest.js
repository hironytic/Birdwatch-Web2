import Immutable from "../../src/stubs/immutable";

import StoreTestHelper from "../helpers/StoreTestHelper";
import "../../src/stores/PlatformMasterStore";

describe("platformMasterStore", function() {
  let helper;

  beforeEach(function() {
    helper = new StoreTestHelper("platformMasterStore", ["platformMasterLoadAllAction"]);
  });
  
  afterEach(function() {
    helper.dispose();
  });
  
  it("should have no items on beginning", function(done) {
    helper.observe(
      () => {
        
      },
      data => {
        expect(data).to.be.an(Immutable.Map);
        expect(data.get("loading")).to.be(false);
        expect(data.get("items")).to.be.an(Immutable.Map);
        expect(data.get("items").size).to.be(0);
      }
    ).then(() => { done() });
  });
  
  it("should be loading when all items are being loaded", function(done) {
    helper.observe(
      () => {
        
      },
      data => {
        expect(data.get("loading")).to.be(false);
      }
    ).then(() => helper.observe(
      ({ platformMasterLoadAllAction }) => {
        platformMasterLoadAllAction.onNext(
          Immutable.Map({
            loading: true,
          })
        );
      },
      data => {
        expect(data.get("loading")).to.be(true);
      }
    )).then(() => { done() });
  });
  
  it("should not be loading after all items are loaded", function(done) {
    helper.observe(
      ({ platformMasterLoadAllAction }) => {
        platformMasterLoadAllAction.onNext(
          Immutable.Map({
            loading: true,
          })
        );
      },
      data => {
        expect(data.get("loading")).to.be(true);
      }
    ).then(() => helper.observe(
      ({ platformMasterLoadAllAction }) => {
        platformMasterLoadAllAction.onNext(
          Immutable.Map({
            loading: false,
            items: Immutable.Map({
              "ID1": Immutable.Map({
                id: "ID1",
                name: "iOS",
              }),
              "ID2": Immutable.Map({
                id: "ID2",
                name: "Android",
              }),
            }),              
          })
        );
      },
      data => {
        expect(data.get("loading")).to.be(false);
      }
    )).then(() => { done() });
  });
  
  it("should hold loaded items", function(done) {
    helper.observe(
      ({ platformMasterLoadAllAction }) => {
        platformMasterLoadAllAction.onNext(
          Immutable.Map({
            loading: true,
          })
        );
        platformMasterLoadAllAction.onNext(
          Immutable.Map({
            loading: false,
            items: Immutable.Map({
              "ID1": Immutable.Map({
                id: "ID1",
                name: "iOS",
              }),
              "ID2": Immutable.Map({
                id: "ID2",
                name: "Android",
              }),
            }),              
          })
        );
      },
      data => {
        expect(data.get("items")).to.be.an(Immutable.Map);
        expect(data.get("items").size).to.be(2);
        expect(data.get("items").get("ID1")).to.be.ok();
        expect(data.get("items").get("ID1")).to.be.an(Immutable.Map);
        expect(data.get("items").get("ID1").get("name")).to.be("iOS");
        expect(data.get("items").get("ID2")).to.be.ok();
        expect(data.get("items").get("ID2")).to.be.an(Immutable.Map);
        expect(data.get("items").get("ID2").get("name")).to.be("Android");
      }
    ).then(() => { done() });
  });
  
  it("should hold previous items on loading", function(done) {
    helper.observe(
      ({ platformMasterLoadAllAction }) => {
        platformMasterLoadAllAction.onNext(
          Immutable.Map({
            loading: true,
          })
        );
        platformMasterLoadAllAction.onNext(
          Immutable.Map({
            loading: false,
            items: Immutable.Map({
              "ID1": Immutable.Map({
                id: "ID1",
                name: "iOS",
              }),
              "ID2": Immutable.Map({
                id: "ID2",
                name: "Android",
              }),
            }),              
          })
        );
        platformMasterLoadAllAction.onNext(
          Immutable.Map({
            loading: true,
          })
        );
      },
      data => {
        expect(data.get("loading")).to.be(true);
        expect(data.get("items")).to.be.an(Immutable.Map);
        expect(data.get("items").size).to.be(2);
        expect(data.get("items").get("ID1")).to.be.ok();
        expect(data.get("items").get("ID1")).to.be.an(Immutable.Map);
        expect(data.get("items").get("ID1").get("name")).to.be("iOS");
        expect(data.get("items").get("ID2")).to.be.ok();
        expect(data.get("items").get("ID2")).to.be.an(Immutable.Map);
        expect(data.get("items").get("ID2").get("name")).to.be("Android");
      }
    ).then(() => { done() });
  });
  
  it("should refresh items on loading all items", function(done) {
    helper.observe(
      ({ platformMasterLoadAllAction }) => {
        platformMasterLoadAllAction.onNext(
          Immutable.Map({
            loading: true,
          })
        );
        platformMasterLoadAllAction.onNext(
          Immutable.Map({
            loading: false,
            items: Immutable.Map({
              "ID1": Immutable.Map({
                id: "ID1",
                name: "iOS",
              }),
              "ID2": Immutable.Map({
                id: "ID2",
                name: "Android",
              }),
            }),              
          })
        );
      },
      data => {
        expect(data.get("items")).to.be.an(Immutable.Map);
        expect(data.get("items").size).to.be(2);
        expect(data.get("items").get("ID1").get("name")).to.be("iOS");
        expect(data.get("items").get("ID2")).to.be.ok();
      }
    ).then(() => helper.observe(
      ({ platformMasterLoadAllAction }) => {
        platformMasterLoadAllAction.onNext(
          Immutable.Map({
            loading: true,
          })
        );
        platformMasterLoadAllAction.onNext(
          Immutable.Map({
            loading: false,
            items: Immutable.Map({
              "ID1": Immutable.Map({
                id: "ID1",
                name: "Mac OS",
              }),
              "ID4": Immutable.Map({
                id: "ID4",
                name: "Windows",
              }),
            }),              
          })
        );
      },
      data => {
        expect(data.get("items")).to.be.an(Immutable.Map);
        expect(data.get("items").size).to.be(2);
        expect(data.get("items").get("ID1").get("name")).to.be("Mac OS");
        expect(data.get("items").get("ID2")).not.to.be.ok();
        expect(data.get("items").get("ID4")).to.be.ok();
        expect(data.get("items").get("ID4").get("name")).to.be("Windows");
      }
    )).then(() => { done() });
  });  
});

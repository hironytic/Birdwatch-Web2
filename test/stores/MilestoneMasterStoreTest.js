import Immutable from "../../src/stubs/immutable";

import StoreTestHelper from "../helpers/StoreTestHelper";
import "../../src/stores/MilestoneMasterStore";

describe("milestoneMasterStore", function() {
  let helper;

  beforeEach(function() {
    helper = new StoreTestHelper("milestoneMasterStore", ["milestoneMasterLoadAllAction"]);
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
      ({ milestoneMasterLoadAllAction }) => {
        milestoneMasterLoadAllAction.onNext(
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
      ({ milestoneMasterLoadAllAction }) => {
        milestoneMasterLoadAllAction.onNext(
          Immutable.Map({
            loading: true,
          })
        );
      },
      data => {
        expect(data.get("loading")).to.be(true);
      }
    ).then(() => helper.observe(
      ({ milestoneMasterLoadAllAction }) => {
        milestoneMasterLoadAllAction.onNext(
          Immutable.Map({
            loading: false,
            items: Immutable.Map({
              "ID1": Immutable.Map({
                id: "ID1",
                name: "implemented on",
                order: 1,
              }),
              "ID2": Immutable.Map({
                id: "ID2",
                name: "start testing on",
                order: 2,
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
      ({ milestoneMasterLoadAllAction }) => {
        milestoneMasterLoadAllAction.onNext(
          Immutable.Map({
            loading: true,
          })
        );
        milestoneMasterLoadAllAction.onNext(
          Immutable.Map({
            loading: false,
            items: Immutable.Map({
              "ID1": Immutable.Map({
                id: "ID1",
                name: "implemented on",
                order: 1,
              }),
              "ID2": Immutable.Map({
                id: "ID2",
                name: "start testing on",
                order: 2,
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
        expect(data.get("items").get("ID1").get("name")).to.be("implemented on");
        expect(data.get("items").get("ID2")).to.be.ok();
        expect(data.get("items").get("ID2")).to.be.an(Immutable.Map);
        expect(data.get("items").get("ID2").get("order")).to.be(2);
      }
    ).then(() => { done() });
  });
  
  it("should hold previous items on loading", function(done) {
    helper.observe(
      ({ milestoneMasterLoadAllAction }) => {
        milestoneMasterLoadAllAction.onNext(
          Immutable.Map({
            loading: true,
          })
        );
        milestoneMasterLoadAllAction.onNext(
          Immutable.Map({
            loading: false,
            items: Immutable.Map({
              "ID1": Immutable.Map({
                id: "ID1",
                name: "implemented on",
                order: 1,
              }),
              "ID2": Immutable.Map({
                id: "ID2",
                name: "start testing on",
                order: 2,
              }),
            }),
          })
        );
        milestoneMasterLoadAllAction.onNext(
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
        expect(data.get("items").get("ID1").get("name")).to.be("implemented on");
        expect(data.get("items").get("ID2")).to.be.ok();
        expect(data.get("items").get("ID2")).to.be.an(Immutable.Map);
        expect(data.get("items").get("ID2").get("order")).to.be(2);
      }
    ).then(() => { done() });
  });
  
  it("should refresh items on loading all items", function(done) {
    helper.observe(
      ({ milestoneMasterLoadAllAction }) => {
        milestoneMasterLoadAllAction.onNext(
          Immutable.Map({
            loading: true,
          })
        );
        milestoneMasterLoadAllAction.onNext(
          Immutable.Map({
            loading: false,
            items: Immutable.Map({
              "ID1": Immutable.Map({
                id: "ID1",
                name: "implemented on",
                order: 1,
              }),
              "ID2": Immutable.Map({
                id: "ID2",
                name: "start testing on",
                order: 2,
              }),
            }),
          })
        );
      },
      data => {
        expect(data.get("items")).to.be.an(Immutable.Map);
        expect(data.get("items").size).to.be(2);
        expect(data.get("items").get("ID1").get("name")).to.be("implemented on");
        expect(data.get("items").get("ID2")).to.be.ok();
      }
    ).then(() => helper.observe(
      ({ milestoneMasterLoadAllAction }) => {
        milestoneMasterLoadAllAction.onNext(
          Immutable.Map({
            loading: true,
          })
        );
        milestoneMasterLoadAllAction.onNext(
          Immutable.Map({
            loading: false,
            items: Immutable.Map({
              "ID1": Immutable.Map({
                id: "ID1",
                name: "code fix on",
                order: 4,
              }),
              "ID3": Immutable.Map({
                id: "ID3",
                name: "post on",
                order: 5,
              }),
            }),
          })
        );
      },
      data => {
        expect(data.get("items")).to.be.an(Immutable.Map);
        expect(data.get("items").size).to.be(2);
        expect(data.get("items").get("ID1").get("name")).to.be("code fix on");
        expect(data.get("items").get("ID2")).not.to.be.ok();
        expect(data.get("items").get("ID3")).to.be.ok();
        expect(data.get("items").get("ID3").get("name")).to.be("post on");
      }
    )).then(() => { done() });
  });  
});

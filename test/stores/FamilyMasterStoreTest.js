import Immutable from "../../src/stubs/immutable";

import StoreTestHelper from "../helpers/StoreTestHelper";
import "../../src/stores/FamilyMasterStore";

describe("familyMasterStore", function() {
  let helper;

  beforeEach(function() {
    helper = new StoreTestHelper("familyMasterStore", ["familyMasterLoadAllAction"]);
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
      ({ familyMasterLoadAllAction }) => {
        familyMasterLoadAllAction.onNext(
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
      ({ familyMasterLoadAllAction }) => {
        familyMasterLoadAllAction.onNext(
          Immutable.Map({
            loading: true,
          })
        );
      },
      data => {
        expect(data.get("loading")).to.be(true);
      }
    ).then(() => helper.observe(
      ({ familyMasterLoadAllAction }) => {
        familyMasterLoadAllAction.onNext(
          Immutable.Map({
            loading: false,
            items: Immutable.Map({
              "ID1": Immutable.Map({
                id: "ID1",
                name: "Note",
                colorString: "#ff0000",
              }),
              "ID2": Immutable.Map({
                id: "ID2",
                name: "mazec",
                colorString: "#0000ff",
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
      ({ familyMasterLoadAllAction }) => {
        familyMasterLoadAllAction.onNext(
          Immutable.Map({
            loading: true,
          })
        );
        familyMasterLoadAllAction.onNext(
          Immutable.Map({
            loading: false,
            items: Immutable.Map({
              "ID1": Immutable.Map({
                id: "ID1",
                name: "Note",
                colorString: "#ff0000",
              }),
              "ID2": Immutable.Map({
                id: "ID2",
                name: "mazec",
                colorString: "#0000ff",
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
        expect(data.get("items").get("ID1").get("name")).to.be("Note");
        expect(data.get("items").get("ID2")).to.be.ok();
        expect(data.get("items").get("ID2")).to.be.an(Immutable.Map);
        expect(data.get("items").get("ID2").get("colorString")).to.be("#0000ff");
      }
    ).then(() => { done() });
  });
  
  it("should hold previous items on loading", function(done) {
    helper.observe(
      ({ familyMasterLoadAllAction }) => {
        familyMasterLoadAllAction.onNext(
          Immutable.Map({
            loading: true,
          })
        );
        familyMasterLoadAllAction.onNext(
          Immutable.Map({
            loading: false,
            items: Immutable.Map({
              "ID1": Immutable.Map({
                id: "ID1",
                name: "Note",
                colorString: "#ff0000",
              }),
              "ID2": Immutable.Map({
                id: "ID2",
                name: "mazec",
                colorString: "#0000ff",
              }),
            }),              
          })
        );
        familyMasterLoadAllAction.onNext(
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
        expect(data.get("items").get("ID1").get("name")).to.be("Note");
        expect(data.get("items").get("ID2")).to.be.ok();
        expect(data.get("items").get("ID2")).to.be.an(Immutable.Map);
        expect(data.get("items").get("ID2").get("colorString")).to.be("#0000ff");
      }
    ).then(() => { done() });
  });
  
  it("should refresh items on loading all items", function(done) {
    helper.observe(
      ({ familyMasterLoadAllAction }) => {
        familyMasterLoadAllAction.onNext(
          Immutable.Map({
            loading: true,
          })
        );
        familyMasterLoadAllAction.onNext(
          Immutable.Map({
            loading: false,
            items: Immutable.Map({
              "ID1": Immutable.Map({
                id: "ID1",
                name: "Note",
                colorString: "#ff0000",
              }),
              "ID2": Immutable.Map({
                id: "ID2",
                name: "mazec",
                colorString: "#0000ff",
              }),
            }),
          })
        );
      },
      data => {
        expect(data.get("items")).to.be.an(Immutable.Map);
        expect(data.get("items").size).to.be(2);
        expect(data.get("items").get("ID1").get("name")).to.be("Note");
        expect(data.get("items").get("ID2")).to.be.ok();
      }
    ).then(() => helper.observe(
      ({ familyMasterLoadAllAction }) => {
        familyMasterLoadAllAction.onNext(
          Immutable.Map({
            loading: true,
          })
        );
        familyMasterLoadAllAction.onNext(
          Immutable.Map({
            loading: false,
            items: Immutable.Map({
              "ID1": Immutable.Map({
                id: "ID1",
                name: "Share",
                colorString: "#ff0000",
              }),
              "ID4": Immutable.Map({
                id: "ID4",
                name: "Yacho",
                colorString: "#00ff00",
              }),
              "ID3": Immutable.Map({
                id: "ID3",
                name: "Fly",
                colorString: "#000000",
              }),
            }),            
          })
        );
      },
      data => {
        expect(data.get("items")).to.be.an(Immutable.Map);
        expect(data.get("items").size).to.be(3);
        expect(data.get("items").get("ID1").get("name")).to.be("Share");
        expect(data.get("items").get("ID2")).not.to.be.ok();
        expect(data.get("items").get("ID3")).to.be.ok();
        expect(data.get("items").get("ID3").get("name")).to.be("Fly");
        expect(data.get("items").get("ID4")).to.be.ok();
        expect(data.get("items").get("ID4").get("name")).to.be("Yacho");
      }
    )).then(() => { done() });
  });  
});

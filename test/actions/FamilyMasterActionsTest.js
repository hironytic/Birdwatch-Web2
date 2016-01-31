import Immutable from "../../src/stubs/immutable";
import { Promise } from "es6-promise";

import DatabaseService from "../helpers/database/DatabaseService";
import ActionTestHelper from "../helpers/ActionTestHelper";
import { reloadFamilyMaster } from "../../src/actions/FamilyMasterActions";
import { Family } from "../../src/constants/DBSchema";

describe("FamilyMasterActions", function() {
  let helper;
  
  beforeEach(function() {
    helper = new ActionTestHelper("familyMasterLoadAllAction", "errorNotificationAction");
  });
  
  afterEach(function() {
    helper.dispose();
  });
    
  describe("reloadFamilyMaster", function() {
    it("should generate familyMasterLoadAllAction on success", function() {
      const db = new DatabaseService();
      helper.initFlux({ db });
      
      return Promise.resolve().then(() => {
        const family1 = db.createEntity(Family.CLASS_NAME);
        family1.setId("F1");
        family1.set(Family.NAME, "family1");
        family1.set(Family.COLOR_STRING, "ff0000");
        
        const family2 = db.createEntity(Family.CLASS_NAME);
        family2.setId("F2");
        family2.set(Family.NAME, "family2");
        family2.set(Family.COLOR_STRING, "00ff00");

        const family3 = db.createEntity(Family.CLASS_NAME);
        family3.setId("F3");
        family3.set(Family.NAME, "family3");
        family3.set(Family.COLOR_STRING, "0000ff");

        return db.saveAll([family1, family2, family3]);
      }).then(() => {
        return helper.observe(
          () => {
            reloadFamilyMaster();
          },
          {
            "familyMasterLoadAllAction": [
              data => {
                expect(data).to.be.an(Immutable.Map);
                expect(data.get("loading")).to.be(true);
              },
              
              data => {
                expect(data).to.be.an(Immutable.Map);
                expect(data.get("loading")).to.be(false);
                expect(data.get("items")).to.be.an(Immutable.Map);
                expect(data.get("items").size).to.be(3);
                
                let f1 = data.get("items").get("F1");
                expect(f1).to.be.ok();
                expect(f1.get("id")).to.be("F1");
                expect(f1.get("name")).to.be("family1");
                expect(f1.get("colorString")).to.be("ff0000");
                
                let f2 = data.get("items").get("F2");
                expect(f2).to.be.ok();
                expect(f2.get("id")).to.be("F2");
                expect(f2.get("name")).to.be("family2");
                expect(f2.get("colorString")).to.be("00ff00");
                
                let f3 = data.get("items").get("F3");
                expect(f3).to.be.ok();
                expect(f3.get("id")).to.be("F3");
                expect(f3.get("name")).to.be("family3");
                expect(f3.get("colorString")).to.be("0000ff");
              },
            ]
          }
        );
      });
    });
    
    it("should generate errorNotificationAction on failure", function() {
      const db = new DatabaseService();
      helper.initFlux({ db });
      
      db.setErrorOnReading({ message: "read error" });
      
      return helper.observe(
        () => {
          reloadFamilyMaster();
        },
        {
          "familyMasterLoadAllAction": [
            data => {
              expect(data.get("loading")).to.be(true);
            },
            data => {
              expect(data.get("loading")).to.be(false);
            },
          ],          
          "errorNotificationAction": [      
            data => {
              expect(data.get("message2")).to.be("read error");
            },
          ],
        }
      );
    });
    
  });
});
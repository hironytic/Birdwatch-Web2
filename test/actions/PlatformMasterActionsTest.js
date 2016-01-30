import Immutable from "../../src/stubs/immutable";
import { Promise } from "es6-promise";

import DatabaseService from "../helpers/database/DatabaseService";
import ActionTestHelper from "../helpers/ActionTestHelper";
import { reloadPlatformMaster } from "../../src/actions/PlatformMasterActions";
import { Platform } from "../../src/constants/DBSchema";

describe("PlatformMasterActions", function() {
  let helper;
  
  beforeEach(function() {
    helper = new ActionTestHelper("platformMasterLoadAllAction", "errorNotificationAction");
  });
  
  afterEach(function() {
    helper.dispose();
  });
    
  describe("reloadPlatformMaster", function() {
    it("should generate platformMasterLoadAllAction on success", function(done) {
      const db = new DatabaseService();
      helper.initFlux({ db });
      
      Promise.resolve().then(() => {
        const platform1 = db.createEntity(Platform.CLASS_NAME);
        platform1.setId("PL1");
        platform1.set(Platform.NAME, "platform1");
        
        const platform2 = db.createEntity(Platform.CLASS_NAME);
        platform2.setId("PL2");
        platform2.set(Platform.NAME, "platform2");

        const platform3 = db.createEntity(Platform.CLASS_NAME);
        platform3.setId("PL3");
        platform3.set(Platform.NAME, "platform3");

        return db.saveAll([platform1, platform2, platform3]);
      }).then(() => {
        return helper.observe(
          () => {
            reloadPlatformMaster();
          },
          {
            "platformMasterLoadAllAction": [
              data => {
                expect(data).to.be.an(Immutable.Map);
                expect(data.get("loading")).to.be(true);
              },
              
              data => {
                expect(data).to.be.an(Immutable.Map);
                expect(data.get("loading")).to.be(false);
                expect(data.get("items")).to.be.an(Immutable.Map);
                expect(data.get("items").size).to.be(3);
                
                let pl1 = data.get("items").get("PL1");
                expect(pl1).to.be.ok();
                expect(pl1.get("id")).to.be("PL1");
                expect(pl1.get("name")).to.be("platform1");
                
                let pl2 = data.get("items").get("PL2");
                expect(pl2).to.be.ok();
                expect(pl2.get("id")).to.be("PL2");
                expect(pl2.get("name")).to.be("platform2");
                
                let pl3 = data.get("items").get("PL3");
                expect(pl3).to.be.ok();
                expect(pl3.get("id")).to.be("PL3");
                expect(pl3.get("name")).to.be("platform3");
              },
            ]
          }
        );
      }).then(() => { done(); })
    });
    
    it("should generate errorNotificationAction on failure", function(done) {
      const db = new DatabaseService();
      helper.initFlux({ db });
      
      db.setErrorOnReading({ message: "read error" });
      
      helper.observe(
        () => {
          reloadPlatformMaster();
        },
        {
          "platformMasterLoadAllAction": [
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
      ).then(() => { done(); });
    });
    
  });
});
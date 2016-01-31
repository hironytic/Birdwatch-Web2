import Immutable from "../../src/stubs/immutable";
import { Promise } from "es6-promise";

import DatabaseService from "../helpers/database/DatabaseService";
import ActionTestHelper from "../helpers/ActionTestHelper";
import { reloadMilestoneMaster } from "../../src/actions/MilestoneMasterActions";
import { Milestone } from "../../src/constants/DBSchema";

describe("MilestoneMasterActions", function() {
  let helper;
  
  beforeEach(function() {
    helper = new ActionTestHelper("milestoneMasterLoadAllAction", "errorNotificationAction");
  });
  
  afterEach(function() {
    helper.dispose();
  });
    
  describe("reloadMilestoneMaster", function() {
    it("should generate milestoneMasterLoadAllAction on success", function() {
      const db = new DatabaseService();
      helper.initFlux({ db });
      
      return Promise.resolve().then(() => {
        const milestone1 = db.createEntity(Milestone.CLASS_NAME);
        milestone1.setId("M1");
        milestone1.set(Milestone.NAME, "milestone1");
        milestone1.set(Milestone.ORDER, 1);

        const milestone2 = db.createEntity(Milestone.CLASS_NAME);
        milestone2.setId("M2");
        milestone2.set(Milestone.NAME, "milestone2");
        milestone2.set(Milestone.ORDER, 5);

        const milestone3 = db.createEntity(Milestone.CLASS_NAME);
        milestone3.setId("M3");
        milestone3.set(Milestone.NAME, "milestone3");
        milestone3.set(Milestone.ORDER, 3);

        return db.saveAll([milestone1, milestone2, milestone3]);
      }).then(() => {
        return helper.observe(
          () => {
            reloadMilestoneMaster();
          },
          {
            "milestoneMasterLoadAllAction": [
              data => {
                expect(data).to.be.an(Immutable.Map);
                expect(data.get("loading")).to.be(true);
              },
              
              data => {
                expect(data).to.be.an(Immutable.Map);
                expect(data.get("loading")).to.be(false);
                expect(data.get("items")).to.be.an(Immutable.Map);
                expect(data.get("items").size).to.be(3);
                
                let m1 = data.get("items").get("M1");
                expect(m1).to.be.ok();
                expect(m1.get("id")).to.be("M1");
                expect(m1.get("name")).to.be("milestone1");
                expect(m1.get("order")).to.be(1);

                let m2 = data.get("items").get("M2");
                expect(m2).to.be.ok();
                expect(m2.get("id")).to.be("M2");
                expect(m2.get("name")).to.be("milestone2");
                expect(m2.get("order")).to.be(5);

                let m3 = data.get("items").get("M3");
                expect(m3).to.be.ok();
                expect(m3.get("id")).to.be("M3");
                expect(m3.get("name")).to.be("milestone3");
                expect(m3.get("order")).to.be(3);                
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
          reloadMilestoneMaster();
        },
        {
          "milestoneMasterLoadAllAction": [
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
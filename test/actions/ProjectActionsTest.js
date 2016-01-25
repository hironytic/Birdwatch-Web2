import Immutable from "../../src/stubs/immutable";
import { Promise } from "es6-promise";

import Database from "../helpers/database/Database";
import ActionTestHelper from "../helpers/ActionTestHelper";
import { reloadProjectList, reloadMilestones } from "../../src/actions/ProjectActions";
import { Family, Platform, Project } from "../../src/constants/DBSchema";

describe("ProjectActions", function() {
  let helper;
  
  beforeEach(function() {
    helper = new ActionTestHelper("projectLoadAllAction", "projectMilestoneLoadAction", "errorNotificationAction");
  });
  
  afterEach(function() {
    helper.dispose();
  });
    
  describe("reloadProjectList", function() {
    it("should generate projectLoadAllAction on success", function(done) {
      const db = new Database();
      helper.initFlux({ db });
      
      Promise.resolve().then(() => {
        const family1 = db.createEntity(Family.CLASS_NAME);
        family1.setId("F1");
        family1.set(Family.NAME, "family1");
        family1.set(Family.COLOR_STRING, "ff0000");
        
        const platform1 = db.createEntity(Platform.CLASS_NAME);
        platform1.setId("PL1");
        platform1.set(Platform.NAME, "platform1");
        
        const platform2 = db.createEntity(Platform.CLASS_NAME);
        platform2.setId("PL2");
        platform2.set(Platform.NAME, "platform2");

        const project1 = db.createEntity(Project.CLASS_NAME);
        project1.setId("P1");
        project1.set(Project.NAME, "proj1");
        project1.set(Project.FAMILY, family1);
        project1.set(Project.PLATFORM, platform1);
        project1.set(Project.PROJECT_CODE, "code1");
        project1.set(Project.VERSION, "ver1");
        
        const project2 = db.createEntity(Project.CLASS_NAME);
        project2.setId("P2");
        project2.set(Project.NAME, "proj2");
        project2.set(Project.FAMILY, family1);
        project2.set(Project.PLATFORM, platform2);
        project2.set(Project.PROJECT_CODE, "code2");
        project2.set(Project.VERSION, "ver2");

        return db.saveAll([family1, platform1, platform2, project1, project2]);
      }).then(() => {
        return helper.observe(
          () => {
            reloadProjectList();
          },
          {
            "projectLoadAllAction": [
              data => {
                expect(data).to.be.an(Immutable.Map);
                expect(data.get("loading")).to.be(true);
              },
              
              data => {
                expect(data).to.be.an(Immutable.Map);
                expect(data.get("loading")).to.be(false);
                expect(data.get("projects")).to.be.an(Immutable.Map);
                expect(data.get("projects").size).to.be(2);
                
                let p1 = data.get("projects").get("P1");
                expect(p1.get("id")).to.be("P1");
                expect(p1.get("name")).to.be("proj1");
                expect(p1.get("familyId")).to.be("F1");
                expect(p1.get("platformId")).to.be("PL1");
                expect(p1.get("projectCode")).to.be("code1");
                expect(p1.get("version")).to.be("ver1");
                
                let p2 = data.get("projects").get("P2");
                expect(p2.get("id")).to.be("P2");
                expect(p2.get("name")).to.be("proj2");
                expect(p2.get("familyId")).to.be("F1");
                expect(p2.get("platformId")).to.be("PL2");
                expect(p2.get("projectCode")).to.be("code2");
                expect(p2.get("version")).to.be("ver2");
              }
            ],
          }
        );        
      }).then(() => { done(); });
    });
    
    it("should generate errorNotificationAction on failure", function(done) {
      const db = new Database();
      helper.initFlux({ db });
      
      db.installOutputHook("find", (value) => {
        return Promise.reject({ message: "error!!" });
      });
      
      helper.observe(
        () => {
          reloadProjectList();
        },
        {
          "projectLoadAllAction": [
            data => {
              expect(data.get("loading")).to.be(true);
            },
            data => {
              expect(data.get("loading")).to.be(false);
            },
          ],          
          "errorNotificationAction": [      
            data => {
              expect(data.get("message2")).to.be("error!!");
            },
          ],
        }
      ).then(() => { done(); });
    });
  });
});

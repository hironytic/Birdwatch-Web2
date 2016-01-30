import Immutable from "../../src/stubs/immutable";
import { Promise } from "es6-promise";

import DatabaseService from "../helpers/database/DatabaseService";
import ActionTestHelper from "../helpers/ActionTestHelper";
import { reloadProjectList, reloadMilestones } from "../../src/actions/ProjectActions";
import { Family, Platform, Project, Milestone, ProjectMilestone } from "../../src/constants/DBSchema";

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
      const db = new DatabaseService();
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
      const db = new DatabaseService();
      helper.initFlux({ db });
      
      db.setErrorOnReading({ message: "read error" });
      
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
              expect(data.get("message2")).to.be("read error");
            },
          ],
        }
      ).then(() => { done(); });
    });
  });
  
  describe("reloadMilestones", function() {
    it("should generate projectMilestoneLoadAction on success", function(done) {
      const db = new DatabaseService();
      helper.initFlux({ db });
      
      Promise.resolve().then(() => {
        const entities = [];
        
        const family1 = db.createEntity(Family.CLASS_NAME);
        family1.setId("F1");
        family1.set(Family.NAME, "family1");
        family1.set(Family.COLOR_STRING, "ff0000");
        entities.push(family1);
        
        const platform1 = db.createEntity(Platform.CLASS_NAME);
        platform1.setId("PL1");
        platform1.set(Platform.NAME, "platform1");
        entities.push(platform1);
        
        const project1 = db.createEntity(Project.CLASS_NAME);
        project1.setId("P1");
        project1.set(Project.NAME, "proj1");
        project1.set(Project.FAMILY, family1);
        project1.set(Project.PLATFORM, platform1);
        project1.set(Project.PROJECT_CODE, "code1");
        project1.set(Project.VERSION, "ver1");
        entities.push(project1);

        const project2 = db.createEntity(Project.CLASS_NAME);
        project2.setId("P2");
        project2.set(Project.NAME, "proj2");
        project2.set(Project.FAMILY, family1);
        project2.set(Project.PLATFORM, platform1);
        project2.set(Project.PROJECT_CODE, "code2");
        project2.set(Project.VERSION, "ver2");
        entities.push(project2);

        const milestone1 = db.createEntity(Milestone.CLASS_NAME);
        milestone1.setId("M1");
        milestone1.set(Milestone.NAME, "milestone1");
        milestone1.set(Milestone.ORDER, 1);
        entities.push(milestone1);

        const milestone2 = db.createEntity(Milestone.CLASS_NAME);
        milestone2.setId("M2");
        milestone2.set(Milestone.NAME, "milestone2");
        milestone2.set(Milestone.ORDER, 2);
        entities.push(milestone2);
        
        const projectMilestone1 = db.createEntity(ProjectMilestone.CLASS_NAME);
        projectMilestone1.setId("PM1");
        projectMilestone1.set(ProjectMilestone.PROJECT, project1);
        projectMilestone1.set(ProjectMilestone.MILESTONE, milestone1);
        projectMilestone1.set(ProjectMilestone.INTERNAL_DATE, new Date(2015, 10, 1));
        projectMilestone1.set(ProjectMilestone.DATE_STRING, null);
        entities.push(projectMilestone1);
        
        const projectMilestone2 = db.createEntity(ProjectMilestone.CLASS_NAME);
        projectMilestone2.setId("PM2");
        projectMilestone2.set(ProjectMilestone.PROJECT, project2);
        projectMilestone2.set(ProjectMilestone.MILESTONE, milestone1);
        projectMilestone2.set(ProjectMilestone.INTERNAL_DATE, new Date(2015, 11, 1));
        projectMilestone2.set(ProjectMilestone.DATE_STRING, null);
        entities.push(projectMilestone2);
        
        const projectMilestone3 = db.createEntity(ProjectMilestone.CLASS_NAME);
        projectMilestone3.setId("PM3");
        projectMilestone3.set(ProjectMilestone.PROJECT, project1);
        projectMilestone3.set(ProjectMilestone.MILESTONE, milestone2);
        projectMilestone3.set(ProjectMilestone.INTERNAL_DATE, new Date(2016, 1, 23));
        projectMilestone3.set(ProjectMilestone.DATE_STRING, "1/23");
        entities.push(projectMilestone3);

        return db.saveAll(entities);
      }).then(() => {
        return helper.observe(
          () => {
            reloadMilestones("P1");
          },
          {
            "projectMilestoneLoadAction": [
              data => {
                expect(data).to.be.an(Immutable.Map);
                expect(data.get("loading")).to.be(true);
                expect(data.get("projectId")).to.be("P1");
              },

              data => {
                expect(data).to.be.an(Immutable.Map);
                expect(data.get("loading")).to.be(false);
                expect(data.get("projectId")).to.be("P1");
                expect(data.get("projectMilestones")).to.be.an(Immutable.Map);
                expect(data.get("projectMilestones").size).to.be(2);
                
                let pm1 = data.get("projectMilestones").get("PM1");
                expect(pm1).to.be.ok();
                expect(pm1.get("id")).to.be("PM1");
                expect(pm1.get("projectId")).to.be("P1");
                expect(pm1.get("milestoneId")).to.be("M1");
                expect(pm1.get("internalDate").getTime()).to.be((new Date(2015, 10, 1)).getTime());
                expect(pm1.get("dateString")).not.to.be.ok();
                
                let pm3 = data.get("projectMilestones").get("PM3");
                expect(pm3).to.be.ok();
                expect(pm3.get("id")).to.be("PM3");
                expect(pm3.get("projectId")).to.be("P1");
                expect(pm3.get("milestoneId")).to.be("M2");
                expect(pm3.get("internalDate").getTime()).to.be((new Date(2016, 1, 23)).getTime());
                expect(pm3.get("dateString")).to.be("1/23");
              },              
            ],
          }
        );        
      }).then(() => { done(); });
    });
    
    it("should generate errorNotificationAction on failure", function(done) {
      const db = new DatabaseService();
      helper.initFlux({ db });
      
      db.setErrorOnReading({ message: "read error" });
      
      helper.observe(
        () => {
          reloadMilestones("P1");
        },
        {
          "projectMilestoneLoadAction": [
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

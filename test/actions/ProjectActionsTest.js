import Immutable from "../../src/stubs/immutable";
import { Promise } from "es6-promise";

import DatabaseService from "../helpers/database/DatabaseService";
import ActionTestHelper from "../helpers/ActionTestHelper";
import { reloadProjectList, reloadMilestones, updateProject } from "../../src/actions/ProjectActions";
import { Family, Platform, Project, Milestone, ProjectMilestone } from "../../src/constants/DBSchema";

describe("ProjectActions", function() {
  let helper;
  
  beforeEach(function() {
    helper = new ActionTestHelper(
      "projectLoadAllAction", "projectMilestoneLoadAction", "projectUpdateAction",
      "errorNotificationAction"
    );
  });
  
  afterEach(function() {
    helper.dispose();
  });
    
  describe("reloadProjectList", function() {
    it("should generate projectLoadAllAction on success", function() {
      const db = new DatabaseService();
      helper.initFlux({ db });
      
      return Promise.resolve().then(() => {
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
      });
    });
    
    it("should generate errorNotificationAction on failure", function() {
      const db = new DatabaseService();
      helper.initFlux({ db });
      
      db.setErrorOnReading({ message: "read error" });
      
      return helper.observe(
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
      );
    });
  });
  
  describe("reloadMilestones", function() {
    it("should generate projectMilestoneLoadAction on success", function() {
      const db = new DatabaseService();
      helper.initFlux({ db });
      
      return Promise.resolve().then(() => {
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
      });
    });
    
    it("should generate errorNotificationAction on failure", function() {
      const db = new DatabaseService();
      helper.initFlux({ db });
      
      db.setErrorOnReading({ message: "read error" });
      
      return helper.observe(
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
      );
    });
    
  });
  
  describe("projectUpdateAction", function() {
    it("should update project and generate projectUpdateAction", function() {
      const db = new DatabaseService();
      helper.initFlux({ db });
      
      return Promise.resolve().then(() => {
        const entities = [];
        
        const family1 = db.createEntity(Family.CLASS_NAME);
        family1.setId("F1");
        family1.set(Family.NAME, "family1");
        family1.set(Family.COLOR_STRING, "ff0000");
        entities.push(family1);
        
        const family2 = db.createEntity(Family.CLASS_NAME);
        family2.setId("F2");
        family2.set(Family.NAME, "family2");
        family2.set(Family.COLOR_STRING, "ffff00");
        entities.push(family2);
        
        const platform1 = db.createEntity(Platform.CLASS_NAME);
        platform1.setId("PL1");
        platform1.set(Platform.NAME, "platform1");
        entities.push(platform1);

        const platform2 = db.createEntity(Platform.CLASS_NAME);
        platform2.setId("PL2");
        platform2.set(Platform.NAME, "platform2");
        entities.push(platform2);
        
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
        
        const project1 = db.createEntity(Project.CLASS_NAME);
        project1.setId("P1");
        project1.set(Project.NAME, "proj1");
        project1.set(Project.FAMILY, family1);
        project1.set(Project.PLATFORM, platform1);
        project1.set(Project.PROJECT_CODE, "code1");
        project1.set(Project.VERSION, "ver1");
        entities.push(project1);

        const projectMilestone1 = db.createEntity(ProjectMilestone.CLASS_NAME);
        projectMilestone1.setId("PM1");
        projectMilestone1.set(ProjectMilestone.PROJECT, project1);
        projectMilestone1.set(ProjectMilestone.MILESTONE, milestone1);
        projectMilestone1.set(ProjectMilestone.INTERNAL_DATE, new Date(2015, 10, 1));
        projectMilestone1.set(ProjectMilestone.DATE_STRING, null);
        entities.push(projectMilestone1);
        
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
            const oldProject = Immutable.Map({
              id: "P1",
              name: "proj1",
              familyId: "F1",
              platformId: "PL1",
              projectCode: "code1",
              version: "ver1",
            });
            
            const newValues = {
              name: "newProj1",
              familyId: "F2",
              platformId: "PL2",
              projectCode: "newCode",
              version: "newVer",
            };
            
            const oldMilestones = Immutable.Map({
              "PM1": Immutable.Map({
                id: "PM1",
                projectId: "P1",
                milestoneId: "M1",
                internalDate: new Date(2015, 10, 1),
                dateString: null,
              }),
              "PM3": Immutable.Map({
                id: "PM3",
                projectId: "P1",
                milestoneId: "M2",
                internalDate: new Date(2016, 1, 23),
                dateString: "1/23",
              }),
            });
            
            const newMilestones = [
              {
                id: "PM1",
                milestoneId: "M1",
                internalDate: new Date(2016, 2, 1),
                dateString: "2/1",                
              },
              {
                isNew: true,
                milestoneId: "M2",
                internalDate: new Date(2016, 3, 3),
                dateString: "3/3",
              }
            ];
            
            updateProject(oldProject, newValues, oldMilestones, newMilestones);
          },
          {
            "projectUpdateAction": [
              data => {
                expect(data).to.be.an(Immutable.Map);
                expect(data.get("updating")).to.be(true);
                expect(data.get("projectId")).to.be("P1");
              },
              
              data => {
                expect(data).to.be.an(Immutable.Map);
                expect(data.get("updating")).to.be(false);
                expect(data.get("projectId")).to.be("P1");
                
                const project = data.get("project");
                expect(project).to.be.an(Immutable.Map);
                expect(project.get("id")).to.be("P1");
                expect(project.get("name")).to.be("newProj1");
                expect(project.get("familyId")).to.be("F2");
                expect(project.get("platformId")).to.be("PL2");
                expect(project.get("projectCode")).to.be("newCode");
                expect(project.get("version")).to.be("newVer");
                
                const projectMilestones = data.get("projectMilestones");
                expect(projectMilestones).to.be.an(Immutable.Map);
                expect(projectMilestones.size).to.be(2);

                projectMilestones.forEach((value, key) => {
                  if (key == "PM1") {
                    expect(value.get("id")).to.be("PM1");
                    expect(value.get("projectId")).to.be("P1");
                    expect(value.get("milestoneId")).to.be("M1");
                    expect(value.get("internalDate").getTime()).to.be((new Date(2016, 2, 1)).getTime());
                    expect(value.get("dateString")).to.be("2/1");                
                  } else {
                    expect(value.get("id")).to.be(key);
                    expect(value.get("projectId")).to.be("P1");
                    expect(value.get("milestoneId")).to.be("M2");
                    expect(value.get("internalDate").getTime()).to.be((new Date(2016, 3, 3)).getTime());
                    expect(value.get("dateString")).to.be("3/3");
                  }
                });
              },
            ],
          }
        );
      }).then(() => {
        const data1 = db.createEntity(Project.CLASS_NAME);
        data1.setId("P1");
        return db.fetch(data1).then((data) => {
          expect(data.get(Project.NAME)).to.be("newProj1");
          expect(data.get(Project.FAMILY).getId()).to.be("F2");
          expect(data.get(Project.PLATFORM).getId()).to.be("PL2");
          expect(data.get(Project.PROJECT_CODE)).to.be("newCode");
          expect(data.get(Project.VERSION)).to.be("newVer");
        });
      }).then(() => {
        const query = db.createQuery(ProjectMilestone.CLASS_NAME);
        const p1 = db.createEntity(Project.CLASS_NAME).setId("P1");
        query.equalTo(ProjectMilestone.PROJECT, p1);
        return db.find(query).then((dataList) => {
          dataList.forEach((data) => {
            if (data.getId() == "PM1") {
              expect(data.get(ProjectMilestone.PROJECT).getId()).to.be("P1");
              expect(data.get(ProjectMilestone.MILESTONE).getId()).to.be("M1");
              expect(data.get(ProjectMilestone.INTERNAL_DATE).getTime()).to.be((new Date(2016, 2, 1)).getTime());
              expect(data.get(ProjectMilestone.DATE_STRING)).to.be("2/1");
            } else {
              expect(data.get(ProjectMilestone.MILESTONE).getId()).to.be("M2");
              expect(data.get(ProjectMilestone.INTERNAL_DATE).getTime()).to.be((new Date(2016, 3, 3)).getTime());
              expect(data.get(ProjectMilestone.DATE_STRING)).to.be("3/3");              
            }
          });
        });
      });
      
    });
  
  });

});

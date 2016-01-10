import Immutable from "../../src/stubs/immutable";

import StoreTestHelper from "../helpers/StoreTestHelper";
import "../../src/stores/ProjectStore";

describe("projectStore", function() {
  let helper;

  beforeEach(function() {
    helper = new StoreTestHelper("projectStore", ["timelineAction", "projectLoadAllAction"]);
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
        expect(data.get("projects")).to.be.an(Immutable.Map);
        expect(data.get("projects").size).to.be(0);
      }
    ).then(() => { done(); });
  });
  
  it("should be loading while a project is loading", function(done) {
    helper.observe(
      ({ projectLoadAllAction }) => {
        projectLoadAllAction.onNext(
          Immutable.Map({
            loading: true,
          })
        );
      },
      data => {
        expect(data.get("loading")).to.be(true);
      }
    ).then(() => helper.observe(
      ({ projectLoadAllAction }) => {
        projectLoadAllAction.onNext(
          Immutable.Map({
            loading: false,
          })
        );
      },
      data => {
        expect(data.get("loading")).to.be(false);
      }
    )).then(() => { done(); });
  });
  
  it("should be loading while a timeline is loading", function(done) {
    helper.observe(
      ({ timelineAction }) => {
        timelineAction.onNext(
          Immutable.Map({
            loading: true,
          })
        );
      },
      data => {
        expect(data.get("loading")).to.be(true);
      }
    ).then(() => helper.observe(
      ({ timelineAction }) => {
        timelineAction.onNext(
          Immutable.Map({
            loading: false,
          })
        );
      },
      data => {
        expect(data.get("loading")).to.be(false);
      }
    )).then(() => { done(); });
  });

  it("should be loading while either project or timeline is loading", function(done) {
    helper.observe(
      ({ projectLoadAllAction }) => {
        projectLoadAllAction.onNext(
          Immutable.Map({
            loading: true,
          })
        );
      },
      data => {
        expect(data.get("loading")).to.be(true);
      }
    ).then(() => helper.observe(
      ({ timelineAction }) => {
        timelineAction.onNext(
          Immutable.Map({
            loading: true,
          })
        );
        timelineAction.onNext(
          Immutable.Map({
            loading: false,
          })
        );
      },
      data => {
        expect(data.get("loading")).to.be(true);
      }
    )).then(() => helper.observe(
      ({ projectLoadAllAction }) => {
        projectLoadAllAction.onNext(
          Immutable.Map({
            loading: false,
          })
        );
      },
      data => {
        expect(data.get("loading")).to.be(false);
      }
    )).then(() => helper.observe(
      ({ timelineAction }) => {
        timelineAction.onNext(
          Immutable.Map({
            loading: true,
          })
        );
      },
      data => {
        expect(data.get("loading")).to.be(true);
      }
    )).then(() => helper.observe(
      ({ projectLoadAllAction }) => {
        projectLoadAllAction.onNext(
          Immutable.Map({
            loading: true,
          })
        );
        projectLoadAllAction.onNext(
          Immutable.Map({
            loading: false,
          })
        );
      },
      data => {
        expect(data.get("loading")).to.be(true);
      }
    )).then(() => helper.observe(
      ({ timelineAction }) => {
        timelineAction.onNext(
          Immutable.Map({
            loading: false,
          })
        );
      },
      data => {
        expect(data.get("loading")).to.be(false);
      }
    )).then(() => { done(); });
  });

  it("should hold projects loaded by projectLoadAllAction", function(done) {
    helper.observe(
      ({ projectLoadAllAction }) => {
        projectLoadAllAction.onNext(
          Immutable.Map({
            loading: true,
          })
        );
        projectLoadAllAction.onNext(
          Immutable.Map({
            loading: false,
            projects: Immutable.Map({
              "P1": Immutable.Map({
                id: "P1",
                name: "Project 1",
                familyId: "F1",
                platformId: "PL1",
                projectCode: "Proj 1",
                version: "0.0.0",
              }),
              "P2": Immutable.Map({
                id: "P2",
                name: "Project 2",
                familyId: "F3",
                platformId: "PL1",
                projectCode: "Proj 2",
                version: "0.1.0",
              }),
            }),
          })
        );
      },
      data => {
        expect(data.get("projects").size).to.be(2);
        expect(data.get("projects").get("P1")).to.be.an(Immutable.Map);
        expect(data.get("projects").get("P1").get("name")).to.be("Project 1");
        expect(data.get("projects").get("P2").get("version")).to.be("0.1.0");
      }
    ).then(() => { done(); });    
  });
  
  it("should hold projects loaded by timelineAction", function(done) {
    helper.observe(
      ({ timelineAction }) => {
        timelineAction.onNext(
          Immutable.Map({
            loading: true,
          })
        );
        timelineAction.onNext(
          Immutable.Map({
            loading: false,
            projects: Immutable.Map({
              "P1": Immutable.Map({
                id: "P1",
                name: "Project 1",
                familyId: "F1",
                platformId: "PL1",
                projectCode: "Proj 1",
                version: "0.0.0",
              }),
              "P2": Immutable.Map({
                id: "P2",
                name: "Project 2",
                familyId: "F3",
                platformId: "PL1",
                projectCode: "Proj 2",
                version: "0.1.0",
              }),
            }),
            projectMilestones: Immutable.Map({
              "PM20": Immutable.Map({
                id: "PM20",
                projectId: "P1",
                milestoneId: "M1",
                internalDate: new Date(2015, 10, 1),
                dateString: null,
              }),
              "PM21": Immutable.Map({
                id: "PM21",
                projectId: "P2",
                milestoneId: "M2",
                internalDate: new Date(2015, 11, 15),
                dateString: "11/M",
              }),
            }),
          })          
        )
      },
      data => {
        expect(data.get("projects").size).to.be(2);
        expect(data.get("projects").get("P1")).to.be.an(Immutable.Map);
        expect(data.get("projects").get("P1").get("platformId")).to.be("PL1");
        expect(data.get("projects").get("P2").get("projectCode")).to.be("Proj 2");
      }
    ).then(() => { done(); });
  });
  
  it("should replace projects by projectLoadAllAction", function(done) {
    helper.observe(
      ({ projectLoadAllAction }) => {
        projectLoadAllAction.onNext(
          Immutable.Map({
            loading: true,
          })
        );
        projectLoadAllAction.onNext(
          Immutable.Map({
            loading: false,
            projects: Immutable.Map({
              "P1": Immutable.Map({
                id: "P1",
                name: "Project 1",
                familyId: "F1",
                platformId: "PL1",
                projectCode: "Proj 1",
                version: "0.0.0",
              }),
              "P2": Immutable.Map({
                id: "P2",
                name: "Project 2",
                familyId: "F3",
                platformId: "PL1",
                projectCode: "Proj 2",
                version: "0.1.0",
              }),
            }),
          })
        );
      },
      data => {
        expect(data.get("projects").size).to.be(2);
        expect(data.get("projects").get("P1")).to.be.ok();
        expect(data.get("projects").get("P2")).to.be.ok();
        expect(data.get("projects").get("P1").get("name")).to.be("Project 1");
        expect(data.get("projects").get("P1").get("familyId")).to.be("F1");
        expect(data.get("projects").get("P1").get("platformId")).to.be("PL1");
        expect(data.get("projects").get("P1").get("projectCode")).to.be("Proj 1");
        expect(data.get("projects").get("P1").get("version")).to.be("0.0.0");
      }
    ).then(() => helper.observe(
      ({ projectLoadAllAction }) => {
        projectLoadAllAction.onNext(
          Immutable.Map({
            loading: true,
          })
        );
        projectLoadAllAction.onNext(
          Immutable.Map({
            loading: false,
            projects: Immutable.Map({
              "P1": Immutable.Map({
                id: "P1",
                name: "Project 1a",
                familyId: "F2",
                platformId: "PL2",
                projectCode: "Proj 1a",
                version: "0.1.0",
              }),
              "P3": Immutable.Map({
                id: "P3",
                name: "Project 3",
                familyId: "F3",
                platformId: "PL1",
                projectCode: "Proj 3",
                version: "1.5.0",
              }),
            }),
          })
        );
      },
      data => {
        expect(data.get("projects").size).to.be(2);
        expect(data.get("projects").get("P1")).to.be.ok();
        expect(data.get("projects").get("P2")).not.to.be.ok();
        expect(data.get("projects").get("P3")).to.be.ok();
        expect(data.get("projects").get("P1").get("name")).to.be("Project 1a");
        expect(data.get("projects").get("P1").get("familyId")).to.be("F2");
        expect(data.get("projects").get("P1").get("platformId")).to.be("PL2");
        expect(data.get("projects").get("P1").get("projectCode")).to.be("Proj 1a");
        expect(data.get("projects").get("P1").get("version")).to.be("0.1.0");
      }
    )).then(() => { done(); });    
  });
  
  it("shuold only insert or update projects by timelineAction", function(done) {
    helper.observe(
      ({ projectLoadAllAction }) => {
        projectLoadAllAction.onNext(
          Immutable.Map({
            loading: true,
          })
        );
        projectLoadAllAction.onNext(
          Immutable.Map({
            loading: false,
            projects: Immutable.Map({
              "P1": Immutable.Map({
                id: "P1",
                name: "Project 1",
                familyId: "F1",
                platformId: "PL1",
                projectCode: "Proj 1",
                version: "0.0.0",
              }),
              "P2": Immutable.Map({
                id: "P2",
                name: "Project 2",
                familyId: "F3",
                platformId: "PL1",
                projectCode: "Proj 2",
                version: "0.1.0",
              }),
            }),
          })
        );
      },
      data => {
        expect(data.get("projects").size).to.be(2);
        expect(data.get("projects").get("P1")).to.be.ok();
        expect(data.get("projects").get("P2")).to.be.ok();
        expect(data.get("projects").get("P1").get("name")).to.be("Project 1");
        expect(data.get("projects").get("P1").get("familyId")).to.be("F1");
        expect(data.get("projects").get("P1").get("platformId")).to.be("PL1");
        expect(data.get("projects").get("P1").get("projectCode")).to.be("Proj 1");
        expect(data.get("projects").get("P1").get("version")).to.be("0.0.0");
      }
    ).then(() => helper.observe(
      ({ timelineAction }) => {
        timelineAction.onNext(
          Immutable.Map({
            loading: true,
          })
        );
        timelineAction.onNext(
          Immutable.Map({
            loading: false,
            projects: Immutable.Map({
              "P1": Immutable.Map({
                id: "P1",
                name: "Project 1a",
                familyId: "F2",
                platformId: "PL2",
                projectCode: "Proj 1a",
                version: "0.1.0",
              }),
              "P3": Immutable.Map({
                id: "P3",
                name: "Project 3",
                familyId: "F3",
                platformId: "PL1",
                projectCode: "Proj 3",
                version: "1.5.0",
              }),
            }),
            projectMilestones: Immutable.Map({
              "PM20": Immutable.Map({
                id: "PM20",
                projectId: "P1",
                milestoneId: "M1",
                internalDate: new Date(2015, 10, 1),
                dateString: null,
              }),
              "PM31": Immutable.Map({
                id: "PM31",
                projectId: "P3",
                milestoneId: "M2",
                internalDate: new Date(2016, 1, 15),
                dateString: null,
              }),
            }),
          })          
        )
      },
      data => {
        expect(data.get("projects").size).to.be(3);
        expect(data.get("projects").get("P1")).to.be.ok();
        expect(data.get("projects").get("P2")).to.be.ok();
        expect(data.get("projects").get("P3")).to.be.ok();
        expect(data.get("projects").get("P1").get("name")).to.be("Project 1a");
        expect(data.get("projects").get("P1").get("familyId")).to.be("F2");
        expect(data.get("projects").get("P1").get("platformId")).to.be("PL2");
        expect(data.get("projects").get("P1").get("projectCode")).to.be("Proj 1a");
        expect(data.get("projects").get("P1").get("version")).to.be("0.1.0");
      }
    )).then(() => { done(); });    
  });
});

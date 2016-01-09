import Immutable from "../../src/stubs/immutable";
import moment from "moment";

import StoreTestHelper from "../helpers/StoreTestHelper";
import "../../src/stores/ProjectMilestoneStore";

describe("projectMilestoneStore", function() {
  let helper;

  beforeEach(function() {
    helper = new StoreTestHelper("projectMilestoneStore", ["projectMilestoneLoadAction", "timelineAction"]);
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
        expect(data.get("projectMilestones")).to.be.an(Immutable.Map);
        expect(data.get("projectMilestones").size).to.be(0);
      }
    ).then(() => { done(); });
  });
  
  it("should be loading while projectMilestone is loading", function(done) {
    helper.observe(
      ({ projectMilestoneLoadAction }) => {
        projectMilestoneLoadAction.onNext(
          Immutable.Map({
            loading: true,
          })
        );
      },
      data => {
        expect(data.get("loading")).to.be(true);
      }
    ).then(() => helper.observe(
      ({ projectMilestoneLoadAction }) => {
        projectMilestoneLoadAction.onNext(
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
  
  it("should be loading while either projectMilestone or timeline is loading", function(done) {
    helper.observe(
      ({ projectMilestoneLoadAction }) => {
        projectMilestoneLoadAction.onNext(
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
      ({ projectMilestoneLoadAction }) => {
        projectMilestoneLoadAction.onNext(
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
      ({ projectMilestoneLoadAction }) => {
        projectMilestoneLoadAction.onNext(
          Immutable.Map({
            loading: true,
          })
        );
        projectMilestoneLoadAction.onNext(
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
  
  it("should hold project milestones loaded by projectMilestoneLoadAction", function(done) {
    helper.observe(
      ({ projectMilestoneLoadAction }) => {
        projectMilestoneLoadAction.onNext(
          Immutable.Map({
            loading: true,
          })
        );
        projectMilestoneLoadAction.onNext(
          Immutable.Map({
            loading: false,
            projectId: "P1",
            projectMilestones: Immutable.Map({
              "PM20": Immutable.Map({
                id: "PM20",
                projectId: "P1",
                milestoneId: "M1",
                internalDate: new Date(2015, 10, 1),
                dateString: null,
              }),
              "PM22": Immutable.Map({
                id: "PM22",
                projectId: "P1",
                milestoneId: "M2",
                internalDate: new Date(2015, 12, 31),
                dateString: "12/E",
              }),
            }),
          })
        );
      },
      data => {
        expect(data.get("projectMilestones").size).to.be(2);
        expect(data.get("projectMilestones").get("PM20")).to.be.an(Immutable.Map);
        expect(data.get("projectMilestones").get("PM20").get("projectId")).to.be("P1");
        expect(data.get("projectMilestones").get("PM22").get("milestoneId")).to.be("M2");
      }
    ).then(() => { done(); });
  });

  it("should hold project milestones loaded by timelineAction", function(done) {
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
        expect(data.get("projectMilestones").size).to.be(2);
        expect(data.get("projectMilestones").get("PM20")).to.be.an(Immutable.Map);
        expect(data.get("projectMilestones").get("PM20").get("projectId")).to.be("P1");
        expect(data.get("projectMilestones").get("PM21").get("milestoneId")).to.be("M2");
      }
    ).then(() => { done(); });
  });
  
  it("should replace project milestones by projectMilestoneLoadAction", function(done) {
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
              "PM22": Immutable.Map({
                id: "PM22",
                projectId: "P1",
                milestoneId: "M2",
                internalDate: new Date(2015, 12, 31),
                dateString: "12/E",
              }),
            }),
          })          
        )
      },
      data => {
        expect(data.get("projectMilestones").size).to.be(3);
        expect(data.get("projectMilestones").get("PM20")).to.be.ok();
        expect(data.get("projectMilestones").get("PM21")).to.be.ok();
        expect(data.get("projectMilestones").get("PM22")).to.be.ok();
        expect(data.get("projectMilestones").get("PM20").get("milestoneId")).to.be("M1");
        expect(data.get("projectMilestones").get("PM20").get("internalDate").getTime()).to.be(new Date(2015, 10, 1).getTime());
        expect(data.get("projectMilestones").get("PM20").get("dateString")).not.to.be.ok();
      }
    ).then(() => helper.observe(
      ({ projectMilestoneLoadAction }) => {
        projectMilestoneLoadAction.onNext(
          Immutable.Map({
            loading: true,
          })
        );
        projectMilestoneLoadAction.onNext(
          Immutable.Map({
            loading: false,
            projectId: "P1",
            projectMilestones: Immutable.Map({
              "PM20": Immutable.Map({
                id: "PM20",
                projectId: "P1",
                milestoneId: "M2",
                internalDate: new Date(2015, 12, 5),
                dateString: "Someday",
              }),
              "PM25": Immutable.Map({
                id: "PM25",
                projectId: "P1",
                milestoneId: "M3",
                internalDate: new Date(2016, 1, 31),
                dateString: null,
              }),
            }),
          })
        );
      },
      data => {
        expect(data.get("projectMilestones").size).to.be(3);
        expect(data.get("projectMilestones").get("PM20")).to.be.ok();
        expect(data.get("projectMilestones").get("PM21")).to.be.ok();
        expect(data.get("projectMilestones").get("PM22")).not.to.be.ok();
        expect(data.get("projectMilestones").get("PM25")).to.be.ok();
        expect(data.get("projectMilestones").get("PM20").get("milestoneId")).to.be("M2");
        expect(data.get("projectMilestones").get("PM20").get("internalDate").getTime()).to.be(new Date(2015, 12, 5).getTime());
        expect(data.get("projectMilestones").get("PM20").get("dateString")).to.be("Someday");
      }      
    )).then(() => { done(); });
  });
  
  it("shuold only insert or update project milestones by timelineAction", function(done) {
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
              "PM22": Immutable.Map({
                id: "PM22",
                projectId: "P1",
                milestoneId: "M2",
                internalDate: new Date(2015, 12, 31),
                dateString: "12/E",
              }),
            }),
          })          
        )
      },
      data => {
        expect(data.get("projectMilestones").size).to.be(3);
        expect(data.get("projectMilestones").get("PM20")).to.be.ok();
        expect(data.get("projectMilestones").get("PM21")).to.be.ok();
        expect(data.get("projectMilestones").get("PM22")).to.be.ok();
        expect(data.get("projectMilestones").get("PM20").get("milestoneId")).to.be("M1");
        expect(data.get("projectMilestones").get("PM20").get("internalDate").getTime()).to.be(new Date(2015, 10, 1).getTime());
        expect(data.get("projectMilestones").get("PM20").get("dateString")).not.to.be.ok();
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
                name: "Project 1",
                familyId: "F1",
                platformId: "PL1",
                projectCode: "Proj 1",
                version: "0.0.0",
              }),
            }),
            projectMilestones: Immutable.Map({
              "PM20": Immutable.Map({
                id: "PM20",
                projectId: "P1",
                milestoneId: "M2",
                internalDate: new Date(2015, 12, 5),
                dateString: "Someday",
              }),
              "PM25": Immutable.Map({
                id: "PM25",
                projectId: "P1",
                milestoneId: "M3",
                internalDate: new Date(2016, 1, 31),
                dateString: null,
              }),
            }),
          })          
        )
      },
      data => {
        expect(data.get("projectMilestones").size).to.be(4);
        expect(data.get("projectMilestones").get("PM20")).to.be.ok();
        expect(data.get("projectMilestones").get("PM21")).to.be.ok();
        expect(data.get("projectMilestones").get("PM22")).to.be.ok();
        expect(data.get("projectMilestones").get("PM25")).to.be.ok();
        expect(data.get("projectMilestones").get("PM20").get("milestoneId")).to.be("M2");
        expect(data.get("projectMilestones").get("PM20").get("internalDate").getTime()).to.be(new Date(2015, 12, 5).getTime());
        expect(data.get("projectMilestones").get("PM20").get("dateString")).to.be("Someday");
      }
    )).then(() => { done(); });    
  });
});

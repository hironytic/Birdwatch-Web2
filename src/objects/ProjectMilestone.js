import Parse from "../utils/ParseStub";

const Key = {
  PROJECT: "project",
  MILESTONE: "milestone",
  INTERNAL_DATE: "internalDate",
  DATE_STRING: "dateString"
};

export default class ProjectMilestone extends Parse.Object {
  constructor() {
    super("ProjectMilestone");
  }

  getProject() {
    return this.get(Key.PROJECT);
  }

  setProject(value) {
    this.set(Key.PROJECT, value);
  }

  getMilestone() {
    return this.get(Key.MILESTONE);
  }

  setMilestone(value) {
    this.set(Key.MILESTONE, value);
  }

  getInternalDate() {
    return this.get(Key.INTERNAL_DATE);
  }

  setInternalDate(value) {
    this.set(Key.INTERNAL_DATE, value);
  }

  getDateString() {
    return this.get(Key.DATE_STRING);
  }

  setDateString(value) {
    this.set(Key.DATE_STRING, value);
  }
}

ProjectMilestone.Key = Key;
Parse.Object.registerSubclass("ProjectMilestone", ProjectMilestone);

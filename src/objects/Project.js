import Parse from "../utils/ParseStub";

const Key = {
  NAME: "name",
  FAMILY: "family",
  PLATFORM: "platform",
  PROJECT_CODE: "projectCode",
  VERSION: "version"
};

export default class Project extends Parse.Object {
  constructor() {
    super("Project");
  }

  getName() {
    return this.get(Key.NAME);
  }

  setName(value) {
    this.set(Key.NAME, value);
  }

  getFamily() {
    return this.get(Key.FAMILY);
  }

  setFamily(value) {
    this.set(Key.FAMILY, value);
  }

  getPlatform() {
    return this.get(Key.PLATFORM);
  }

  setPlatform(value) {
    this.set(Key.PLATFORM, value);
  }

  getProjectCode() {
    return this.get(Key.PROJECT_CODE);
  }

  setProjectCode(value) {
    this.set(Key.PROJECT_CODE, value);
  }

  getVersion() {
    return this.get(Key.VERSION);
  }

  setVersion(value) {
    this.set(Key.VERSION, value);
  }
}

Project.Key = Key;
Parse.Object.registerSubclass("Project", Project);

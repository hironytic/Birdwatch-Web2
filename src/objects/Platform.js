import Parse from "parse";

var Key = {
  NAME: "name"
};

export default class Platform extends Parse.Object {
  constructor() {
    super("Platform");
  }
  
  getName() {
    return this.get(Key.NAME);
  }

  setName(value) {
    this.set(Key.NAME, value);
  }
}

Platform.Key = Key;
Parse.Object.registerSubclass("Platform", Platform);

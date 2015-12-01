import Parse from "../utils/ParseStub";

const Key = {
  NAME: "name",
  COLOR_STRING: "colorString"
};

export default class Family extends Parse.Object {
  constructor() {
    super("Family");
  }
  
  getName() {
    return this.get(Key.NAME);
  }

  setName(value) {
    this.set(Key.NAME, value);
  }

  getColorString() {
    return this.get(Key.COLOR_STRING);
  }

  setColorString(value) {
    this.set(Key.COLOR_STRING, value);
  }
}

Family.Key = Key;
Parse.Object.registerSubclass("Family", Family);

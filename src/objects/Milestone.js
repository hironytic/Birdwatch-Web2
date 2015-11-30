import Parse from "../utils/ParseStub";

var Key = {
  NAME: "name",
  ORDER: "order"
};

export default class Milestone extends Parse.Object {
  constructor() {
    super("Milestone");
  }
  
  getName() {
    return this.get(Key.NAME);
  }

  setName(value) {
    this.set(Key.NAME, value);
  }

  getOrder() {
    return this.get(Key.ORDER);
  }

  setOrder(value) {
    this.set(Key.ORDER, value);
  }
}

Milestone.Key = Key;
Parse.Object.registerSubclass("Milestone", Milestone);

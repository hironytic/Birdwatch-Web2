import Parse from "../stubs/parse";

export default class Entity {
  constructor(parseObject) {
    this.parseObject = parseObject;
  }
  
  getId() {
    return this.parseObject.id;
  }
  
  setId(id) {
    this.parseObject.id = id;
  }
  
  get(column) {
    let value = this.parseObject.get(column);
    if (value instanceof Parse.Object) {
      value = new Entity(value);
    }
    return value;
  }
  
  set(column, value) {
    if (value instanceof Entity) {
      value = value.getParseObject();
    }
    this.parseObject.set(column, value);
  }
  
  getParseObject() {
    return this.parseObject;
  }
}

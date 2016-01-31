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
    return this;
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
      value = value._getParseObject();
    }
    this.parseObject.set(column, value);
    return this;
  }
  
  _getParseObject() {
    return this.parseObject;
  }
  
  _getClassName() {
    return this.parseObject.className;
  }
}

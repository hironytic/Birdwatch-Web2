import Map from "es6-map";

export default class Entity {
  constructor(className, id, attrs = new Map()) {
    this.className = className;
    this.id = id;
    this.attrs = attrs;
  }
  
  getId() {
    return this.id;
  }
  
  setId(id) {
    this.id = id;
    return this;
  }
  
  get(column) {
    return this.attrs.get(column);
  }
  
  set(column, value) {
    this.attrs.set(column, value);
    return this;
  }
  
  _getClassName() {
    return this.className;
  }
  
  _getAttrs() {
    return this.attrs;
  }
  
  _setAttrs(attrs) {
    this.attrs = attrs;
  }
}

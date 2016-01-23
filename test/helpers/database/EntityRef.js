export default class EntityRef {
  constructor(className, id) {
    this.className = className;
    this.id = id;
  }
  
  getClassName() {
    return this.className;
  }
  
  getId() {
    return this.id;
  }
}

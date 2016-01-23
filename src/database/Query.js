import Parse from "../stubs/parse";

import Entity from "../database/Entity";

function convertValue(value) {
  if (value instanceof Entity) {
    value = value._getParseObject();
  }
  return value;
}

export default class Query {
  constructor(className) {
    this.parseQuery = new Parse.Query(className);
  }

  equalTo(column, value) {
    this.parseQuery.equalTo(column, convertValue(value));
    return this;
  }
  
  notEqualTo(column, value) {
    this.parseQuery.notEqualTo(column, convertValue(value));
    return this;
  }

  greaterThan(column, value) {
    this.parseQuery.greaterThan(column, convertValue(value));
    return this;
  }
  
  greaterThanOrEqualTo(column, value) {
    this.parseQuery.greaterThanOrEqualTo(column, convertValue(value));
    return this;
  }
  
  lessThan(column, value) {
    this.parseQuery.lessThan(column, convertValue(value));
    return this;
  }
  
  lessThanOrEqualTo(column, value) {
    this.parseQuery.lessThanOrEqualTo(column, convertValue(value));    
    return this;
  }

  include(column) {
    this.parseQuery.include(column);
    return this;
  }
  
  _getParseQuery() {
    return this.parseQuery;
  }
}

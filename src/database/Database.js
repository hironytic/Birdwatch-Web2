import Parse from "../stubs/parse";
import { Promise } from "es6-promise";

import Entity from "../database/Entity";
import Query from "../database/Query";

export default class Database {
  constructor() {
    
  }
  
  createEntity(className) {
    const parseObject = new Parse.Object(className);
    return new Entity(parseObject);
  }

  createQuery(className) {
    return new Query(className);
  }
  
  find(query) {
    return Promise.resolve(query.getParseQuery().find()).then(values => {
      return values.map(value => new Entity(value));
    });
  }  
}

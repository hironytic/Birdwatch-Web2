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
  
  fetch(entity) {
    return Promise.resolve(entity._getParseObject().fetch());
  }
  
  find(query) {
    return Promise.resolve(query._getParseQuery().find()).then(values => {
      return values.map(value => new Entity(value));
    });
  }
  
  save(entity) {
    return Promise.resolve(entity._getParseObject().save());
  }
  
  saveAll(entities) {
    return Promsie.resolve(Parse.Object.saveAll(entities.map(entity => entity._getParseObject())));
  }
}

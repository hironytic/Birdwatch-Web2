import Parse from "../stubs/parse";
import { Promise } from "es6-promise";

import Entity from "../database/Entity";
import Query from "../database/Query";

export default class DatabaseService {
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
    return Promise.resolve(entity._getParseObject().fetch()).then(value => new Entity(value));
  }
  
  find(query) {
    return Promise.resolve(query._getParseQuery().find()).then(values => {
      return values.map(value => new Entity(value));
    });
  }
  
  save(entity) {
    return Promise.resolve(entity._getParseObject().save()).then(value => new Entity(value));
  }
  
  saveAll(entities) {
    return Promsie.resolve(Parse.Object.saveAll(entities.map(entity => entity._getParseObject()))).then(values => {
      return values.map(value => new Entity(value));
    });
  }
}

import Immutable from "../../../src/stubs/immutable";
import { Promise } from "es6-promise";
import Map from "es6-map";

import Entity from "../database/Entity";
import EntityRef from "../database/EntityRef";
import Query from "../database/Query";

export default class Database {
  constructor() {
    // こんな感じの構造ですべてのデータがここに入る。
    // this.classes = Map({
    //   "className1": [
    //     Immutable.Map({ "@id": "id1", ... }),
    //     Immutable.Map({ "@id": "id2", ... }),
    //   ],
    //   "className2": [
    //     ...
    //   ],
    // });
    this.classes = new Map();
    this.nextId = 1;
    this.inputHooks = {};
    this.outputHooks = {};
  }
  
  createEntity(className) {
    const entity = new Entity(className);
    const nextId = this.nextId++;
    entity.setId("id" + nextId);
    return entity;
  }

  createQuery(className) {
    return new Query(className);
  }
  
  _convertRecord(record, fetchKeys) {
    return record.reduce((acc, value, key) => {
      if (key == "@id") {
        acc.id = value;
      } else if (value instanceof EntityRef) {
        const entityValue = new Entity(value.getClassName(), value.getId());
        if (fetchKeys != null && fetchKeys.indexOf(key) >= 0) {
          this.fetch(entityValue);
        }
        acc.attrs.set(key, entityValue);
      } else {
        acc.attrs.set(key, value);
      }
      return acc;
    }, { id: null, attrs: new Map() });
  }
  
  _callInputHook(name, args) {
    if (this.inputHooks[name]) {
      this.inputHooks[name](...args);
    }
  }
  
  _chainOutputHook(name, promise) {
    if (this.outputHooks[name]) {
      promise = promise.then(this.outputHooks[name]);
    }
    return promise;
  }
  
  _doWithHooks(name, args, body) {
    this._callInputHook(name, args);
    return this._chainOutputHook(name, body(...args));
  }
  
  fetch(...args) {
    return this._doWithHooks("fetch", args, (entity) => {
      const id = entity.getId();
      const className = entity._getClassName();
      
      const records = this.classes.get(className);
      if (records == null) {
        return Promise.resolve(null);
      }
      let record = null;
      for (let ix = 0; ix < records.length; ix++) {
        if (records[ix].get("@id") == id) {
          record = records[ix];
          break;
        }
      }
      
      if (record != null) {
        const { attrs } = this._convertRecord(record);
        entity._setAttrs(attrs);
      }
      
      return Promise.resolve(entity);
    });
  }
  
  find(...args) {
    return this._doWithHooks("find", args, (query) => {
      const className = query._getClassName();
      const records = this.classes.get(className);
      if (records == null) {
        return Promise.resolve([]);
      }

      // recordsはImmutable.MapのArray
      // これにqueryのフィルタを適用して残ったものを
      // それぞれEntityにmapしたものがentities
      const entities = query._getFilters()
        .reduce((records, filter) => records.filter(filter), records)
        .map(record => {
          const { id, attrs } = this._convertRecord(record, query._getFetchKeys());
          return new Entity(className, id, attrs);
        });
      
      return Promise.resolve(entities);
    });
  }
  
  save(...args) {
    return this._doWithHooks("save", args, (entity) => {
      const className = entity._getClassName();
      const attrs = entity._getAttrs();
      const id = entity.getId();
      const record = Immutable.Map({ "@id": id }).withMutations(mutableMap => {
        attrs.forEach((value, key) => {
          if (value instanceof Entity) {
            value = new EntityRef(value._getClassName(), value.getId());
          }
          mutableMap.set(key, value);
        });
      });
      
      let records = this.classes.get(className);
      if (records == null) {
        records = [];
        this.classes.set(className, records);
      }
      let isReplaced = false;
      for (let ix = 0; ix < records.length; ix++) {
        if (records[ix].get("@id") == id) {
          records[ix] = record;
          isReplaced = true;
          break;
        }
      }
      if (!isReplaced) {
        records.push(record);
      }
      return Promise.resolve(entity);
    });
  }
  
  saveAll(...args) {
    return this._doWithHooks("saveAll", args, (entities) => {
      const { promise, results } = entities.reduce((acc, entity) => {
        acc.promise = acc.promise
          .then(() => this.save(entity))
          .then(result => {
            acc.results.push(result);
          });
        return acc;
      }, { promise: Promise.resolve(), results: [] });
      
      return promise.then(() => results);
    });
  }
  
  
  // hooks for testing
  installInputHook(name, hook) {
    this.inputHooks[name] = hook;
  }
  
  installOutputHook(name, hook) {
    this.outputHooks[name] = hook;
  }
}

import Immutable from "../../../src/stubs/immutable";
import { Promise } from "es6-promise";
import Map from "es6-map";

import Entity from "../database/Entity";
import EntityRef from "../database/EntityRef";
import Query from "../database/Query";

export default class DatabaseService {
  constructor() {
    // こんな感じの構造ですべてのデータがここに入る。
    // this.allData = Map({
    //   "className1": [
    //     Immutable.Map({ "@id": "id1", ... }),
    //     Immutable.Map({ "@id": "id2", ... }),
    //   ],
    //   "className2": [
    //     ...
    //   ],
    // });
    this.allData = new Map();
    this.nextId = 1;
    this.errorOnReading = null;
    this.errorOnWriting = null;
  }
  
  createEntity(className, isForNew = false) {
    const entity = new Entity(className);
    const nextId = this.nextId++;
    if (isForNew) {
      entity.setId("id" + nextId);
    }
    return entity;
  }

  createQuery(className) {
    return new Query(className);
  }
  
  _convertRecord(dataForReading, record, fetchKeys) {
    return record.reduce((acc, value, key) => {
      if (key == "@id") {
        acc.id = value;
      } else if (value instanceof EntityRef) {
        const entityValue = new Entity(value.getClassName(), value.getId());
        if (fetchKeys != null && fetchKeys.indexOf(key) >= 0) {
          this._fetchSync(dataForReading, entityValue);
        }
        acc.attrs.set(key, entityValue);
      } else {
        acc.attrs.set(key, value);
      }
      return acc;
    }, { id: null, attrs: new Map() });
  }
  
  _accessDataForReading() {
    if (this.errorOnReading) {
      return Promise.reject(this.errorOnReading);
    } else {
      return Promise.resolve(this.allData);
    }
  }
  
  _accessDataForWriting() {
    if (this.errorOnWriting) {
      return Promise.reject(this.errorOnWriting);
    } else {
      return Promise.resolve(this.allData);
    }
  }
  
  _fetchSync(dataForReading, entity) {
    const id = entity.getId();
    const className = entity._getClassName();

    const records = dataForReading.get(className);
    if (records == null) {
      throw { message: "object not found" };
    }
    let record = null;
    for (let ix = 0; ix < records.length; ix++) {
      if (records[ix].get("@id") == id) {
        record = records[ix];
        break;
      }
    }
    
    if (record != null) {
      const { attrs } = this._convertRecord(dataForReading, record);
      entity._setAttrs(attrs);
      return entity;
    } else {
      throw { message: "object not found" };
    }
  }
  
  fetch(entity) {
    return this._accessDataForReading().then((data) => {
      const result = this._fetchSync(data, entity);
      return Promise.resolve(result);
    });
  }
  
  find(query) {
    const className = query._getClassName();
    
    return this._accessDataForReading().then((data) => {
      const records = data.get(className);
      if (records == null) {
        return Promise.resolve([]);
      }

      // recordsはImmutable.MapのArray
      // これにqueryのフィルタを適用して残ったものを
      // それぞれEntityにmapしたものがentities
      const entities = query._getFilters()
        .reduce((records, filter) => records.filter(filter), records)
        .map(record => {
          const { id, attrs } = this._convertRecord(data, record, query._getFetchKeys());
          return new Entity(className, id, attrs);
        });
      
      return Promise.resolve(entities);
    });
  }
  
  _saveSync(dataForWriting, entity) {
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

    let records = dataForWriting.get(className);
    if (records == null) {
      records = [];
      dataForWriting.set(className, records);
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
    return entity;
  }
  
  save(entity) {
    return this._accessDataForWriting().then((data) => {
      const result = this._saveSync(data, entity);
      return Promise.resolve(result);
    });
  }
  
  saveAll(entities) {
    return this._accessDataForWriting().then((data) => {
      const results = [];
      entities.forEach(entity => {
        results.push(this._saveSync(data, entity));
      });
      return Promise.resolve(results);
    });
  }
  
  destory(entity) {
    return this._accessDataForWriting().then((data) => {
      const id = entity.getId();
      const className = entity._getClassName();

      let records = data.get(className);
      records = records.filter(record => record.get("@id") != id);
      data.set(className, records);
      return Promise.resolve();
    });
  }
  
  destroyAll(entities) {
    return this._accessDataForWriting().then((data) => {
      const classes = entities.reduce((classes, entity) => {
        const id = entity.getId();
        const className = entity._getClassName();
        
        let ids = classes.get(className);
        if (ids == null) {
          ids = [];
          classes.set(className, ids);
        }
        ids.push(id);
        
        return classes;
      }, new Map());

      classes.forEach((ids, className) => {
        let records = data.get(className);
        records = records.filter(record => {
          let id = record.get("@id");
          return (ids.indexOf(id) < 0);
        });
        data.set(className, records);
      });
      return Promise.resolve();
    });
  }
  
  setErrorOnReading(error) {
    this.errorOnReading = error;
  }
  
  setErrorOnWriting(error) {
    this.errorOnWriting = error;
  }
}

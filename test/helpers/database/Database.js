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
  }
  
  createEntity(className) {
    return new Entity(className);
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
  
  fetch(entity) {
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
  }
  
  find(query) {
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
  }  
}

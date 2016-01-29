import EntityRef from "../database/EntityRef";

export default class Query {
  constructor(className) {
    this.className = className;
    this.filters = [];
    this.fetchKeys = [];
  }

  equalTo(column, value) {
    this.filters.push(target => {
      const targetValue = target.get(column);
      if (targetValue instanceof EntityRef) {
        return targetValue.getId() == value.getId();
      } else if (targetValue instanceof Date) {
        return targetValue.getTime() == value.getTime();
      } else {
        return targetValue == value;
      }
    });
    return this;
  }
  
  notEqualTo(column, value) {
    this.filters.push(target => {
      const targetValue = target.get(column);
      if (targetValue instanceof EntityRef) {
        return targetValue.getId() != value.getId();
      } else if (targetValue instanceof Date) {
        return targetValue.getTime() != value.getTime();
      } else {
        return targetValue != value;
      }
    });
    return this;
  }

  greaterThan(column, value) {
    this.filters.push(target => {
      const targetValue = target.get(column);
      if (targetValue instanceof Date) {
        return targetValue.getTime() > value.getTime();
      } else {
        return targetValue > value;
      }
    });
    return this;
  }
  
  greaterThanOrEqualTo(column, value) {
    this.filters.push(target => {
      const targetValue = target.get(column);
      if (targetValue instanceof Date) {
        return targetValue.getTime() >= value.getTime();
      } else {
        return targetValue >= value;
      }
    });
    return this;
  }
  
  lessThan(column, value) {
    this.filters.push(target => {
      const targetValue = target.get(column);
      if (targetValue instanceof Date) {
        return targetValue.getTime() < value.getTime();
      } else {
        return targetValue < value;
      }
    });
    return this;
  }
  
  lessThanOrEqualTo(column, value) {
    this.filters.push(target => {
      const targetValue = target.get(column);
      if (targetValue instanceof Date) {
        return targetValue.getTime() <= value.getTime();
      } else {
        return targetValue <= value;
      }
    });
    return this;
  }

  include(column) {
    this.fetchKeys.push(column);
    return this;
  }

  _getClassName() {
    return this.className;
  }
  
  _getFilters() {
    return this.filters;
  }
  
  _getFetchKeys() {
    return this.fetchKeys;
  }
}

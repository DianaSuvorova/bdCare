var Mapping = require('./mapping');
var assign = require('object-assign');
var Helpers = require('./helpers');

var Student = function () {
  this.initialize.apply(this, arguments);
  return this;
};

Student.prototype = {};

Student.prototype.initialize = function (o) {
  this.id = o.id || 'new';
  this.name = o.name;
  this.dateOfBirth = new Date(o.dateOfBirth) || null;
  if (o && o.mappings) {
    this.mappings = o.mappings;
  }
  else {
      var mapping = new Mapping({studentId: 'new', groupId: o.groupId})
      this.mappings = [mapping];
  }
};

Student.prototype.addMapping = function (mapping) {
  this.mappings.push(mapping);
};

Student.prototype.getMappings = function (pFilter) {
  var defaultFilter = {groupId: null, dateRange: null}
  var filter = assign(defaultFilter, pFilter);
  var mappings = [];
  if (filter.dateRange) {
    var listOfDates = Helpers.getListOfDates(filter.dateRange);

    listOfDates.forEach( function(date) {
      this.mappings.forEach(function (mapping) {
        if (mapping.isActive(date) && (!mapping.groupId || mapping.groupId === filter.groupId)) {
          mappings.push(mapping);
        }
      });
    }.bind(this));
  }
  else {
    this.mappings.forEach(function (mapping) {
      if (!filter.groupId || mapping.groupId === filter.groupId) {
        mappings.push(mapping);
      }
    });

  }

  mappings.sort(function (a,b) {
    return a.startDate - b.startDate
  });

  return mappings;
};
//getLatest mapping for filter
Student.prototype.getMapping = function (pFilter) {
  var mappings = this.getMappings(pFilter);
  return mappings[(mappings.length - 1)];
};

Student.prototype.getNewMapping = function () {
  var currentMapping = this.getMapping();
  var newMapping = currentMapping.clone();
  newMapping.setAttributes({startDate: Helpers.getDateMonthFromToday()});
  return newMapping;
};

Student.prototype.toExcelFormat = function (pFilter) {
  var formattedMapping = this.getMapping(pFilter).toExcelFormat();
  formattedMapping.unshift(this.name);
  return formattedMapping;


}

module.exports = Student;

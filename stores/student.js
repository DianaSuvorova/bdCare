var Mapping = require('./mapping');
var assign = require('object-assign');

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
    this.mappings = o.mappings.map(function (mapping) {
      return new Mapping(mapping);
    });
  }
  else {
      var mapping = new Mapping({studentId: 'new', groupId: o.groupId})
      this.mappings = [mapping];
  }
};

module.exports = Student;

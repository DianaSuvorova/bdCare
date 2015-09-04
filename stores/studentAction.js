var Dispatcher = require('../dispatcher/dispatcher');
var Constants = require('../dispatcher/constants');
var Api = require('./api');

var studentAction = module.exports = {

  loadStudents: function (schoolId) {
    Api.getStudents(schoolId);
  },

  saveStudent: function (studentEntry) {
    Api.saveStudent(studentEntry)
  },

  addMapping: function (mapping) {
    Api.addMapping(mapping);
  },

  updateName: function (studentId, name) {
    Api.updateName(studentId, name);
  },

  updateBirthdate: function (studentId, birthdate) {
    Api.updateBirthdate(studentId, birthdate);
  }
}

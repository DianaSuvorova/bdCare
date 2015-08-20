var Parse = require('parse').Parse;
var Dispatcher = require('../dispatcher/dispatcher');
var Constants = require('../dispatcher/constants');
var assign = require('object-assign');

Parse.initialize("nV79RgGdpHJuLACeL96jDcybxA5fcLBSYmYbYH5u", "FSPoK1VgkgJF75rDHxZgICXp2BYNtMnZdwk12jYr");

var Api = module.exports = {

  getStudents: function (schoolId) {

    var qStudent = new Parse.Query(Parse.Object.extend('Student')).descending('createdAt').find();
    var qGroup = new Parse.Query(Parse.Object.extend('Group')).descending('createdAt').find();
    var qMapping = new Parse.Query(Parse.Object.extend('Mapping')).descending('createdAt').find();

    Promise.all([qStudent, qGroup, qMapping]).then(function (result) {
      Dispatcher.dispatch({
        actionType: Constants.API_GET_STUDENTS_SUCCESS,
        students: result[0],
        groups: result[1],
        mappings: result[2]
      });
    });

  },

  saveStudent: function(studentEntry) {
    var pStudent = Parse.Object.extend('Student');
    var student = new pStudent();

    var onSuccess = function (student) {
      console.log(student)
    };

    var onError = function (student, error) {
      console.log(error)
    };

    student.save({name: studentEntry.name}).then(onSuccess, onError);
  }



};

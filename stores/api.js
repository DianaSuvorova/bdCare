var Parse = require('parse').Parse;
var Dispatcher = require('../dispatcher/dispatcher');
var Constants = require('../dispatcher/constants');
var assign = require('object-assign');

Parse.initialize("nV79RgGdpHJuLACeL96jDcybxA5fcLBSYmYbYH5u", "FSPoK1VgkgJF75rDHxZgICXp2BYNtMnZdwk12jYr");

var Api = module.exports = {

  getStudentsForSchool: function (schoolId) {
    var query = new Parse.Query(Parse.Object.extend('student'));
    query.equalTo('schoolId', schoolId).descending('createdAt');

    var onSuccess = function (students) {
      Dispatcher.dispatch({
        actionType: Constants.API_GET_STUDENTS_SUCCESS,
        students: students
      })
    },
    onError = function (students, error) {
      console.log('error loading students', students, error);
    };

    query.find().then(onSuccess, onError);

  },

  getClassesForSchool: function (schoolId) {
    var query = new Parse.Query(Parse.Object.extend('class'));
    query.equalTo('schoolId', schoolId).descending('createdAt');

    var onSuccess = function (classes) {
      Dispatcher.dispatch({
        actionType: Constants.API_GET_CLASSES_SUCCESS,
        classes: classes
      })
    },
    onError = function (classes, error) {
      console.log('error loading classes', classes, error);
    };

    query.find().then(onSuccess, onError);

  }

};

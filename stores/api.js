var Parse = require('parse').Parse;
var Dispatcher = require('../dispatcher/dispatcher');
var Constants = require('../dispatcher/constants');
var assign = require('object-assign');

Parse.initialize("nV79RgGdpHJuLACeL96jDcybxA5fcLBSYmYbYH5u", "FSPoK1VgkgJF75rDHxZgICXp2BYNtMnZdwk12jYr");

function getStudentById(studentId, onSuccess, onError) {
  var qStudent = new Parse.Query(Parse.Object.extend('Student'));
  qStudent.equalTo('objectId', studentId);
  qStudent.find().then(onSuccess, onError);
}

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

  addStudent: function(studentEntry, mappingEntry) {
    var pStudent = Parse.Object.extend('Student');
    var student = new pStudent();

    var onSuccess = function (student) {
      var onMappingSuccess = function (mapping) {
        Dispatcher.dispatch({
          actionType: Constants.API_ADD_STUDENT_SUCCESS,
          student: student,
          mapping: mapping
        });
      };
      this.addMapping(assign(mappingEntry, {studentId: student.id}), onMappingSuccess);

    }.bind(this);

    var onError = function (student, error) {
      console.log(error)
    };

    student.save({name: studentEntry.name, birthdate: new Date(studentEntry.birthdate)}).then(onSuccess, onError);
  },

  addMapping: function (mappingEntry, onSuccess) {
    var pMapping = Parse.Object.extend('Mapping');
    var mapping = new pMapping();

    var onSuccess = onSuccess || function (mapping) {
      Dispatcher.dispatch({
        actionType: Constants.API_ADD_MAPPING_SUCCESS,
        mapping: mapping
      });
    };

    var onError = function (mapping, error) {
      console.log(error)
    };

    var pMappingEntry = assign(
      {},
        {groupId: mappingEntry.groupId,
          studentId: mappingEntry.studentId,
          start_date: mappingEntry.startDate,
          isOnWaitlist: false},
        mappingEntry.schedule
      );
    mapping.save(pMappingEntry).then(onSuccess, onError);
  },


  updateName: function (studentId, name) {

    var onSuccess = function (students) {
      var onSaveSuccess = function (student) {
        Dispatcher.dispatch({
          actionType: Constants.API_UPDATE_STUDENT_SUCCESS,
          student: student
        });
      };
      var onSaveError = function (student, error) {
        console.log(error);
      };
      var student = students[0];
      student.set('name', name);
      student.save().then(onSaveSuccess, onSaveError);
    };

    var onError = function (students, error) {
      console.log(error)
    };

    getStudentById(studentId, onSuccess, onError);
  },

  updateBirthdate: function (studentId, birthdate) {

    var onSuccess = function (students) {
      var onSaveSuccess = function (student) {
        Dispatcher.dispatch({
          actionType: Constants.API_UPDATE_STUDENT_SUCCESS,
          student: student
        });

      };
      var onSaveError = function (student, error) {
        console.log(error);
      };
      var student = students[0];
      student.set('birthdate', new Date(birthdate));
      student.save().then(onSaveSuccess, onSaveError);
    };

    var onError = function (students, error) {
      console.log(error)
    };

    getStudentById(studentId, onSuccess, onError);
  }

};

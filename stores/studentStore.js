var Api = require('./api');
var assign = require('object-assign');
var Dispatcher = require('../dispatcher/dispatcher');
var Constants = require('../dispatcher/constants');
var EventEmitter = require('events').EventEmitter;

var CHANGE_EVENT = 'change';

var _students = [];

function set(students) {
  _students = students.map(function (student) {
    return assign(
        {},
        {id: student.id, name: student.attributes.name, dateOfBirth: student.attributes.dateOfBirth, classId: student.attributes.classId  },
        {schedule: {
          mon_am: student.attributes.mon_am || false,
          mon_pm: student.attributes.mon_am || false,
          tue_am: student.attributes.tue_am || false,
          tue_pm: student.attributes.tue_pm || false,
          wed_am: student.attributes.wed_am || false,
          wed_pm: student.attributes.wed_pm || false,
          thu_am: student.attributes.thu_am || false,
          thu_pm: student.attributes.thu_pm || false,
          fri_am: student.attributes.fri_am || false,
          fri_pm: student.attributes.fri_pm || false
        }
      }
    )
  });
}

var studentStore = module.exports = assign({}, EventEmitter.prototype, {

  emitChange: function () {
    this.emit(CHANGE_EVENT);
  },

  addChangeListener: function (callback) {
    this.on(CHANGE_EVENT, callback);
  },

  removeChangeListener: function (callback) {
    this.removeListener(CHANGE_EVENT, callback);
  },

  getStudents: function () {
    return _students;
  }

});


Dispatcher.register( function (action) {
  switch(action.actionType) {
    case Constants.API_GET_STUDENTS_SUCCESS:
      if(action.students) {
        set(action.students);
      }
      studentStore.emitChange();
      break;

    case Constants.GET_STUDENTS:
      studentStore.emitChange();
      break;

  }
});

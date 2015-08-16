var Api = require('./api');
var assign = require('object-assign');
var Dispatcher = require('../dispatcher/dispatcher');
var Constants = require('../dispatcher/constants');
var EventEmitter = require('events').EventEmitter;

var CHANGE_EVENT = 'change';

var _students = [];

function set(students) {
  _students = students.map(function (student) {
    return assign({}, student.attributes, {id: student.id})
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

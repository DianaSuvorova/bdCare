var Api = require('./api');
var assign = require('object-assign');
var Dispatcher = require('../dispatcher/dispatcher');
var Constants = require('../dispatcher/constants');
var EventEmitter = require('events').EventEmitter;

var CHANGE_EVENT = 'change';

var _students = {};
var _groups = {};
var _mappings = [];
var isEmpty = true;

function setData(students, groups, mappings) {
  students.forEach(function (student) {
    _students[student.id] = student.attributes
  });

  groups.forEach(function (group) {
    _groups[group.id] = group.attributes
  });

  _mappings = mappings.map(function (mapping) {
    return mapping.attributes;
  });

  isEmpty = false;
}

function getMappings(date) {
  var mappings = [];
  for (var i = 0; i < _mappings.length; i++) {
    var mapping = _mappings[i];
    if (date > mapping.start_date && date < mapping.end_date) {
      mappings.push(mapping);
    }
  }
  return mappings;
}

function getStudents(date) {

  return getMappings(date).map(function (mapping) {
    return assign(
      {},
      _students[mapping.studentId],
      {group: _groups[mapping.groupId].name},
      {schedule:
        {
          mon_am: mapping.mon_am,
          mon_pm: mapping.mon_pm,
          tue_am: mapping.tue_am,
          tue_pm: mapping.tue_pm,
          wed_am: mapping.wed_am,
          wed_pm: mapping.wed_pm,
          thu_am: mapping.thu_am,
          thu_pm: mapping.thu_pm,
          fri_am: mapping.fri_am,
          fri_pm: mapping.fri_pm
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
    return getStudents(new Date);
  },

  isEmpty: function () {
    return isEmpty;
  }

});

studentStore.dispatchToken = Dispatcher.register( function (action) {
  switch(action.actionType) {
    case Constants.API_GET_STUDENTS_SUCCESS:
      setData(action.students, action.groups, action.mappings);
      studentStore.emitChange();
      break;

  }
});

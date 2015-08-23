var Api = require('./api');
var assign = require('object-assign');
var Dispatcher = require('../dispatcher/dispatcher');
var Constants = require('../dispatcher/constants');
var EventEmitter = require('events').EventEmitter;

var CHANGE_EVENT = 'change';

var _students = {};
var _groups = {};
var _mappings = [];
var _isEmpty = true;
var _slotsDict = ['mon_am', 'mon_pm', 'tue_am', 'tue_pm', 'wed_am', 'wed_pm', 'thu_am', 'thu_pm', 'fri_am', 'fri_pm'];

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

  _isEmpty = false;
}

function getMappings(date) {
  var mappings = [];
  for (var i = 0; i < _mappings.length; i++) {
    var mapping = _mappings[i];
    if (date > mapping.start_date && (mapping.end_date) ? date < mapping.start_date : true ) {
      mappings.push(mapping);
    }
  }
  return mappings;
}

function getStudents(date) {
  var schedule = {};

  return getMappings(date).map(function (mapping) {
    _slotsDict.forEach(function (slot) {
      schedule[slot] = mapping[slot]
    });

    return assign(
      {},
      _students[mapping.studentId],
      {group: _groups[mapping.groupId].name},
      {schedule: schedule}
    )
  });
}

function getAvailableScheduleForSlot (group, dateRange, slot) {
  //getAvailableScheduleForSlot("abc", [d1, d2], "mon_am") -> 3
  return Math.round(Math.random() * 3);
}

function getAvailableScheduleForGroup (group, dateRange) {
  var schedule = {};
  _slotsDict.forEach( function (slot) {
    schedule[slot] = getAvailableScheduleForSlot(group, dateRange, slot);
  });
  return schedule;
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
    return _isEmpty;
  },

  getAvailableSchedule: function (dateRange, group) {

    if (!dateRange) {
      var date = new Date(), y = date.getFullYear(), m = date.getMonth();
      var dateRange = [new Date(y, m, 1), new Date(y, m + 1, 0)];
    }
    var groups = group || Object.keys(_groups);
    var groupsSchedule = [];

    groups.forEach( function (id) {
      groupsSchedule.push(assign(
        {},
        {id: id},
        _groups[id],
        {schedule: getAvailableScheduleForGroup(id, dateRange)})
      );
    })
    return groupsSchedule;
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

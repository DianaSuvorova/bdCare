var Api = require('./api');
var assign = require('object-assign');
var Dispatcher = require('../dispatcher/dispatcher');
var Constants = require('../dispatcher/constants');
var EventEmitter = require('events').EventEmitter;

var OffLineData = require('./offlineData');
var FileSaver = require('filesaver.js');

var DateRangeStore = require('./dateRangeStore.js');

var Mapping = require('./mapping');
var Student = require('./student');
var Group = require('./group');
var Helpers = require('./helpers');
var Excel = require('./excel');

var CHANGE_EVENT = 'change';
var isOffline = false;

var _students = {};
var _groups = {};
var _mappings = [];
var _isEmpty = true;

if (isOffline) {
    setData(OffLineData.students, OffLineData.groups, OffLineData.mappings);
    _isEmpty = false;
}

function setData(students, groups, mappings) {
  _mappings = mappings.map(function (mapping) {
    return new Mapping(mapping.attributes);
  });

  students.forEach(function (student) {
    _students[student.id] = new Student(assign({}, {id: student.id}, student.attributes, {mappings: getMappings({studentId: student.id})}));
  });

  groups.forEach(function (group) {
    _groups[group.id] = new Group(assign({}, {id: group.id}, group.attributes, {mappings: getMappings({groupId: group.id})}));
  });

  _isEmpty = false;
}

function addMapping(mapping) {
  _mappings.push(new Mapping(mapping.attributes));
}

function updateStudent(student) {
  _students[student.id] = new Student(assign({}, {id: student.id}, student.attributes))
}

function addStudent(student) {
  _students[student.id] = new Student(assign({}, {id: student.id}, student.attributes));
}

function getMappings(pFilter) {
  var defaultFilter = { groupId: null, studentId: null, date: null};
  var filter = assign(defaultFilter, pFilter);

  return _mappings.filter(function (mapping) {
    return (
      (!filter.groupId || filter.groupId && mapping.groupId === filter.groupId)
      && (!filter.studentId || filter.studentId && mapping.studentId === filter.studentId)
      && (!filter.date || filter.date && (filter.date >= mapping.start_date && !mapping.end_date || date <= mapping.end_date))
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

  isEmpty: function () {
    return _isEmpty;
  },

  getStudents: function (pFilter) {
    var defaultFilter = {groupId: null, dateRange: null}
    var filter = assign(defaultFilter, pFilter);
    var studentsMap = {};
    if (filter.studentId === 'new') {
      var student = new Student({groupId: filter.groupId});
      studentsMap['new'] = student;
      return studentsMap;
    }

    //if dateRange
    if (filter.dateRange) {
      var listOfDates = Helpers.getListOfDates(filter.dateRange);
      listOfDates.forEach( function(date) {
        Object.keys(_students).forEach( function(studentId) {
          _students[studentId].mappings.forEach( function (mapping) {
            if (mapping.isActive(date) && (!filter.groupId || mapping.groupId === filter.groupId)) {
              studentsMap[studentId] = _students[studentId];
            }
          })
        });
      })
    }
    else {
      Object.keys(_students).forEach( function(studentId) {
        _students[studentId].mappings.forEach( function (mapping) {
          if (!filter.groupId || mapping.groupId === filter.groupId) {
            studentsMap[studentId] = _students[studentId];
          }
        })
      });
    }
    return studentsMap;
  },

  getGroups: function (pFilter) {
    var defaultFilter = {groupId: null, studentId: null, dateRange: null}
    var filter = assign(pFilter || {}, defaultFilter);

    var startDate = filter.dateRange && filter.dateRange[0];
    var endDate = filter.dateRange && filter.dateRange[1];
    if (startDate > endDate) {
      console.error('Requested start date=', startDate, ' is later than end date=', endDate);
      return null;
    }

    var groupIds = filter.groupId || Object.keys(_groups);
    var groups = {};
    groupIds.forEach( function (groupId) {
      groups[groupId] = _groups[groupId];
    }.bind(this));
     return groups;
  },

  getNewStudent: function (groupId) {
    return new Student(groupId);
  },

  getNewMapping: function (student) {
    var latestMapping = student.mappings[student.mappings.length -1];
    var mapping = new Mapping(latestMapping);
    return mapping;
  },

  getExcel: function () {
    Excel(_groups, _students);
  },

  //dummy implementation of a function.
  //Gonna return random students from store.
  getWaitlistForGroupAndDateRange: function () {
    var waitlist = {};
    numWaitlisted = Math.floor(Math.random() * 4);
    var keys =  Object.keys(_students);
    for (var i = 0; i < numWaitlisted; i++) {
      var idx = Math.floor(Math.random() * keys.length);
      var mappingIdx = Math.floor(Math.random() * _mappings.length);
      var mapping = _mappings[mappingIdx];
      var student = assign({}, _students[keys[idx]], {schedule: mapping});
      waitlist[student.id] = student;
    }
    return waitlist;
  },

  //another dummy function.
  getActionablesForGroupAndDateRange: function () {
    var actionables = [];
    var numActionables = Math.floor(Math.random() * 3);
    var keys =  Object.keys(_students);
    for (var i = 0; i < numActionables; i++) {
      var idx = Math.floor(Math.random() * keys.length);
      var student = _students[keys[idx]];
      var rnd = Math.random();
      var text;
      if (rnd < 0.3) text = 'is leaving the daycare next month';
      else if (rnd < 0.6) text = 'is having birthday party next Friday';
      else text = 'is ready to move to Preschoolers group';
      actionables.push({id: '_a' + student.id, text: student.name + ' ' + text})
    }
    return actionables;
  }
});

studentStore.dispatchToken = Dispatcher.register( function (action) {
  switch(action.actionType) {
    case Constants.API_GET_STUDENTS_SUCCESS:
      setData(action.students, action.groups, action.mappings);
      studentStore.emitChange();
      break;
    case Constants.API_ADD_MAPPING_SUCCESS:
      addMapping(action.mapping);
      studentStore.emitChange();
      break;
    case Constants.API_UPDATE_STUDENT_SUCCESS:
      updateStudent(action.student);
      studentStore.emitChange();
      break;
    case Constants.API_ADD_STUDENT_SUCCESS:
      addStudent(action.student);
      addMapping(action.mapping);
      studentStore.emitChange();
      break;


  }
});

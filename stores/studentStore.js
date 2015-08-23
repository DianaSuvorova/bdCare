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

function getMappings(groupId, date) {
  var mappings = [];
  for (var i = 0; i < _mappings.length; i++) {
    var mapping = _mappings[i];
    if (groupId === mapping.groupId && date > mapping.start_date && ((mapping.end_date) ? date < mapping.start_date : true )) {
      mappings.push(mapping);
    }
  }
  return mappings;
}

function getStudents(groupId, date) {
    return getMappings(groupId, date).map(function (mapping) {
    var schedule = {};

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

function createListOfDatesForDateRange(dateRange) {
  localStartDate = new Date(startDate);
  var listOfDates = []
  for (var d = localStartDate; d <= endDate; d.setDate(d.getDate() + 1)) {
    dayOfWeek = d.getDay()
    if (dayOfWeek != 0 && dayOfWeek != 6) {
      listOfDates.push(new Date(d));
    }
  }
  return listOfDates;
}


function slotKeysDictForDate(d) {
  date = new Date(d);
  keyIndex = date.getDay() - 1;
  amKey = _slotsDict[keyIndex * 2];
  pmKey = _slotsDict[keyIndex * 2 + 1];
  return {'am' : amKey, 'pm' : pmKey};
}

function dailyStudentCountFoGroupForDate(group, date) {
  group_mappings = _mappings.filter(function (mapping) {
    return mapping.groupId == group
  });

  amCount = 0;
  pmCount = 0;

  slotKeys = slotKeysDictForDate(date)
  amKey = slotKeys['am'];
  pmKey = slotKeys['pm'];
  group_mappings.forEach( function(mapping) {
    amCount += mapping[amKey];
    pmCount += mapping[pmKey];
  });

  return {'am' : amCount, 'pm': pmCount};
}

function minimumSlotsLoadForGroupForDateRange(group, dateRange) {
  _slotsBreakdown = {};
  studentLoadPerDate = studentLoadForGroupForDateRange(group, dateRange)

  for (var date in studentLoadPerDate) {
    slotKeyDict = slotKeysDictForDate(date)
    for (var timeOfDay in slotKeyDict) {
      if (!slotKeyDict.hasOwnProperty(timeOfDay)) continue;

      slotKey = slotKeyDict[timeOfDay];
      timeOfDayLoad = studentLoadPerDate[date][timeOfDay];
      if  (!(slotKey in _slotsBreakdown) ||
            (timeOfDayLoad < _slotsBreakdown[timeOfDay])) {
        _slotsBreakdown[slotKey] = timeOfDayLoad;
      }
    }
  }

//  console.log(group, _slotsBreakdown);
  return _slotsBreakdown;
}

function studentLoadForGroupForDateRange(group, dateRange) {
    var _studentsCountPerDay = {};

    var listOfDates = createListOfDatesForDateRange(dateRange)
    listOfDates.forEach( function(date) {
      dailyCount = dailyStudentCountFoGroupForDate(group, date)
      _studentsCountPerDay[date] = {'am': dailyCount['am'], 'pm': dailyCount['pm']};
    });

    return _studentsCountPerDay;
}

function getAvailableScheduleForGroup (group, dateRange) {
  startDate = dateRange[0];
  endDate = dateRange[1];
  if (startDate > endDate) {
    console.log('Error: requested start date is later than end date')
    console.log('StartDate:', startDate)
    console.log('EndDate:', endDate)
    return null;
  }
  var slotsTaken = minimumSlotsLoadForGroupForDateRange(group, dateRange);
  var slotsAvailable = {};

  for (slot in slotsTaken) {
    slotsAvailable[slot] = _groups[group].capacity - slotsTaken[slot];
  }

  return slotsAvailable;
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

  getStudents: function (groupId, date) {
    return getStudents(groupId || Object.keys(_groups)[0], date || new Date);
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

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
    _students[student.id] = assign({}, {id: student.id}, student.attributes)
  });

  groups.forEach(function (group) {
    _groups[group.id] = assign({}, {id: group.id}, group.attributes)
  });

  _mappings = mappings.map(function (mapping) {
    return mapping.attributes;
  });

  _isEmpty = false;
}

function getMappingsByGroupdIdAndDate(groupId, date) {
  return _mappings.filter(function (mapping) {
    return (mapping.groupId === groupId)
    && (date > mapping.start_date)
    && (!mapping.end_date || date < mapping.end_date)
  });
}

function getMappingsByStudentIdAndDate(studentId, date) {
  return _mappings.filter(function (mapping) {
    return (mapping.studentId === studentId)
    && (date > mapping.start_date)
    && (!mapping.end_date || date < mapping.end_date)
  });
}

function createListOfDatesForDateRange(dateRange) {
  var startDate = dateRange[0];
  var endDate = dateRange[1];
  var localStartDate = new Date(startDate);
  var listOfDates = []
  for (var d = localStartDate; d <= endDate; d.setDate(d.getDate() + 1)) {
    var dayOfWeek = d.getDay()
    if (dayOfWeek != 0 && dayOfWeek != 6) {
      listOfDates.push(new Date(d));
    }
  }
  return listOfDates;
}

function slotKeysDictForDate(d) {
  var date = new Date(d);
  var keyIndex = date.getDay() - 1;
  return {'am' : _slotsDict[keyIndex * 2], 'pm' : _slotsDict[keyIndex * 2 + 1]};
}


function dailyStudentCountForGroupIdForDate(groupId, date) {
  var groupMappings = getMappingsByGroupdIdAndDate(groupId, date)

  var amCount = 0;
  var pmCount = 0;

  var slotKeys = slotKeysDictForDate(date)
  var amKey = slotKeys['am'];
  var pmKey = slotKeys['pm'];
  groupMappings.forEach( function(mapping) {
    amCount += mapping[amKey];
    pmCount += mapping[pmKey];
  });

  return {'am' : amCount, 'pm': pmCount};
}

function minimumSlotsLoadForGroupIdForDateRange(groupId, dateRange) {
  var slotsBreakdown = {};
  var studentLoadPerDate = studentLoadForGroupIdForDateRange(groupId, dateRange)

  for (var date in studentLoadPerDate) {
    var slotKeyDict = slotKeysDictForDate(date)
    for (var timeOfDay in slotKeyDict) {
      var slotKey = slotKeyDict[timeOfDay];
      var timeOfDayLoad = studentLoadPerDate[date][timeOfDay];
      if  (!(slotKey in slotsBreakdown) ||
            (timeOfDayLoad < slotsBreakdown[slotKey])) {
        slotsBreakdown[slotKey] = timeOfDayLoad;
      }
    }
  }
  return slotsBreakdown;
}

function studentLoadForGroupIdForDateRange(groupId, dateRange) {
    var studentsCountPerDay = {};

    var listOfDates = createListOfDatesForDateRange(dateRange)
    listOfDates.forEach( function(date) {
      var dailyCount = dailyStudentCountForGroupIdForDate(groupId, date)
      studentsCountPerDay[date] = {'am': dailyCount['am'], 'pm': dailyCount['pm']};
    });

    return studentsCountPerDay;
}

function getAvailableScheduleForGroupId(groupId, dateRange) {
  var slotsTaken = minimumSlotsLoadForGroupIdForDateRange(groupId, dateRange);
  var slotsAvailable = {};

  for (slot in slotsTaken) {
    slotsAvailable[slot] = _groups[groupId].capacity - slotsTaken[slot];
  }

  return slotsAvailable;
}

function getMappingsByGroupdIdWithProjectedDateInRange(groupId, dateRange) {
  var rangeStartDate = dateRange[0];
  var rangeEndDate = dateRange[1];

  return _mappings.filter(function (mapping) {

    return (mapping.groupId === groupId)
    && (rangeStartDate < mapping.projected_end_date)
    && (rangeEndDate > mapping.projected_end_date)
    && (!mapping.end_date || mapping.projected_end_date <= mapping.end_date)
  });
}

function getStudentsIdsEligibleForUpgrade(groupId, dateRange) {
  var startDate = dateRange[0];
  var endDate = dateRange[1];
  eligible_mappings = getMappingsByGroupdIdWithProjectedDateInRange(groupId, dateRange)
  var studentIds = [];
  eligible_mappings.forEach(function (mapping){
      studentIds.push(mapping.studentId)
  });

  return studentIds;
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

  getStudentsMapForGroupIdAndDateRange: function (groupId, dateRange) {
    var startDate = dateRange[0];
    var endDate = dateRange[1];
    if (startDate > endDate) {
      console.error('Requested start date=', startDate, ' is later than end date=', endDate);
      return null;
    }

    var studentsMap = [];
    var listOfDates = createListOfDatesForDateRange(dateRange);

    listOfDates.forEach( function(date) {
      var groupMappings = getMappingsByGroupdIdAndDate(groupId, date);
      groupMappings.forEach(function (mapping) {
        var schedule = {};

        _slotsDict.forEach(function (slot) {
          schedule[slot] = mapping[slot]
        });

        var student = assign(
          {},
          _students[mapping.studentId],
          {group: _groups[mapping.groupId].name},
          {groupId: _groups[mapping.groupId].id},
          {schedule: schedule}
        )

        studentsMap[mapping.studentId] = student;
      })
    });

    return studentsMap;
  },

  getStudentByStudentIdAndDateRange: function (studentId, dateRange) {
    var startDate = dateRange[0];
    var endDate = dateRange[1];
    if (startDate > endDate) {
      console.error('Requested start date=', startDate, ' is later than end date=', endDate);
      return null;
    }
    //if multiple mappings this returns the lattest
    var student;
    var listOfDates = createListOfDatesForDateRange(dateRange);

    listOfDates.forEach(function(date) {
      var groupMappings = getMappingsByStudentIdAndDate(studentId, date);
      groupMappings.forEach(function (mapping) {
        var schedule = {};

        _slotsDict.forEach(function (slot) {
          schedule[slot] = mapping[slot]
        });

        student = assign(
          {},
          _students[mapping.studentId],
          {group: _groups[mapping.groupId].name},
          {schedule: schedule}
        )

      })
    });

    return student;
  },

  getGroupsMap: function () {
    return _groups;
  },

  getGroupSummaryForGroupIdAndDateRange: function (groupId, dateRange) {

    var startDate = dateRange[0];
    var endDate = dateRange[1];
    if (startDate > endDate) {
      console.error('Requested start date=', startDate, ' is later than end date=', endDate);
      return null;
    }

    return assign(
      {},
      _groups[groupId],
      {schedule: getAvailableScheduleForGroupId(groupId, dateRange)},
      {studentIdsEligibleForUpgrade: getStudentsIdsEligibleForUpgrade(groupId, dateRange)}
    )
  },

  getDashboardSummaryForDateRange: function(dateRange) {
    var groupsSchedule = [];
    Object.keys(_groups).forEach( function (groupId) {
      groupsSchedule.push(this.getGroupSummaryForGroupIdAndDateRange(groupId, dateRange));
    }.bind(this))
    return groupsSchedule;
  },

  getEmptySchedule: function() {
    var schedule = {};
    _slotsDict.forEach(function (slot){
        schedule[slot] = 0;
    })
    return schedule;
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

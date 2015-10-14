var Mapping = require('./mapping');
var Helpers = require('./helpers');
var assign = require('object-assign');

var _slotsDict = ['mon_am', 'mon_pm', 'tue_am', 'tue_pm', 'wed_am', 'wed_pm', 'thu_am', 'thu_pm', 'fri_am', 'fri_pm'];

var Group = function () {
  this.initialize.apply(this, arguments);
  return this;
};

Group.prototype = {};

Group.prototype.initialize = function (o) {
  this.id = o.id;
  this.capacity = o.capacity;
  this.name = o.name;
  this.mappings = o.mappings;
};

Group.prototype.getAvailableSchedule = function (dateRange) {
  var slotsTaken = this._getMinimumSlotsLoad(dateRange);
  var slotsAvailable = {};

  for (slot in slotsTaken) {
    slotsAvailable[slot] = this.capacity - slotsTaken[slot] || 0;
  }

  return slotsAvailable;
};

Group.prototype.getStudentsIdsEligibleForUpgrade = function (dateRange) {
  var startDate = dateRange[0];
  var endDate = dateRange[1];
  var eligibleMappings = this._getMappingsBWithProjectedDateInRange(dateRange)
  var studentIds = [];
  eligibleMappings.forEach(function (mapping){
      studentIds.push(mapping.studentId)
  });

  return studentIds;
};

Group.prototype._getMappingsWithProjectedDateInRange = function (dateRange) {
  var rangeStartDate = dateRange[0];
  var rangeEndDate = dateRange[1];

  return this.mappings.filter(function (mapping) {

    return (rangeStartDate < mapping.projected_end_date)
    && (rangeEndDate > mapping.projected_end_date)
    && (!mapping.end_date || mapping.projected_end_date <= mapping.end_date)
  });
};


Group.prototype._getMinimumSlotsLoad = function(dateRange) {
  var studentLoadPerDate = this._getStudentLoad(dateRange);

  var slotsBreakdown = {};
  for (var date in studentLoadPerDate) {
    var slotKeyDict = Helpers.slotKeysDictForDate(date)
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

Group.prototype._getMappings = function(date) {
  return this.mappings.filter(function (mapping) {
    return mapping.isActive(date);
  });
}

Group.prototype._getStudentCount = function(date) {
  var groupMappings = this._getMappings(date);

  var amCount = 0;
  var pmCount = 0;

  var slotKeys = Helpers.slotKeysDictForDate(date);
  var amKey = slotKeys['am'];
  var pmKey = slotKeys['pm'];
  groupMappings.forEach( function(mapping) {
    amCount += mapping.schedule[amKey];
    pmCount += mapping.schedule[pmKey];
  });

  return {'am' : amCount, 'pm': pmCount};
};

// returns a dictionary of date to dictionary of total count in am and pm range for this date
// i.e. {"12-01-2015": {'am' : 10, 'pm':9}}
Group.prototype._getStudentLoad = function (dateRange) {
    var studentsCountPerDay = {};

    var listOfDates = Helpers.getListOfDates(dateRange)
    listOfDates.forEach( function(date) {
      var dailyCount = this._getStudentCount(date)
      studentsCountPerDay[date] = {'am': dailyCount['am'], 'pm': dailyCount['pm']};
    }.bind(this));

    return studentsCountPerDay;
};

Group.prototype.getStudentIds = function (dateRange) {
  var studentIds = {};
  var listOfDates = Helpers.getListOfDates(dateRange);
  listOfDates.forEach( function(date) {
    this.mappings.forEach(function (mapping) {
      if(mapping.isActive(date)) {
        studentIds[mapping.studentId] = mapping.studentId
      }
    });
  }.bind(this))
  return Object.keys(studentIds);
};

Group.prototype.getWaitlistStudentIds = function (dateRange) {
  var waitlist = [];
  numWaitlisted = Math.floor(Math.random() * 4);
  for (var i = 0; i < numWaitlisted; i++) {
    var mappingIdx = Math.floor(Math.random() * this.mappings.length);
    var mapping = this.mappings[mappingIdx];
    waitlist.push(mapping.studentId)
  }
  return waitlist;

};

Group.prototype.toExcelFormat = function(dateRange, students) {
  var studentLoadPerDate = this._getStudentLoad(dateRange);

  var groupHeader = [this.name].concat(_slotsDict);

  var formattedGroup = [groupHeader];
  this.getStudentIds(dateRange).forEach(function (studentId) {
    if (students[studentId]) formattedGroup.push(students[studentId].toExcelFormat({groupId: this.id, dateRange: dateRange}))
  }.bind(this))

  var reservedSchedule = this._getMinimumSlotsLoad(dateRange);
  var reservedScheduleArray = [""];
  _slotsDict.forEach(function (slot) {
    reservedScheduleArray.push(reservedSchedule[slot]);
  });

  formattedGroup.push(reservedScheduleArray);
  formattedGroup.push([""]);

  return formattedGroup;

};

module.exports = Group;

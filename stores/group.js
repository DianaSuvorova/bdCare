var Mapping = require('./mapping');
var assign = require('object-assign');

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
    slotsAvailable[slot] = this.capacity - slotsTaken[slot];
  }

  return slotsAvailable;
};

Group.prototype.getStudentsIdsEligibleForUpgrade = function (dateRange) {
  return [];
}

Group.prototype._getMinimumSlotsLoad = function(dateRange) {
  var studentLoadPerDate = this._getStudentLoad(dateRange)

  var slotsBreakdown = {};
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

Group.prototype._getMappings = function(date) {
  return this.mappings.filter(function (mapping) {
    return mapping.isActive(date);
  });
}

Group.prototype._getStudentCount = function(date) {
  var groupMappings = this._getMappings(date);

  var amCount = 0;
  var pmCount = 0;

  var slotKeys = slotKeysDictForDate(date);
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
Group.prototype._getStudentLoad = function(dateRange) {
    var studentsCountPerDay = {};

    var listOfDates = getListOfDates(dateRange)
    listOfDates.forEach( function(date) {
      var dailyCount = this._getStudentCount(date)
      studentsCountPerDay[date] = {'am': dailyCount['am'], 'pm': dailyCount['pm']};
    }.bind(this));

    return studentsCountPerDay;
};


function getListOfDates(dateRange) {
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
  var _slotsDict = ['mon_am', 'mon_pm', 'tue_am', 'tue_pm', 'wed_am', 'wed_pm', 'thu_am', 'thu_pm', 'fri_am', 'fri_pm'];
  var date = new Date(d);
  var keyIndex = date.getDay() - 1;
  return {'am' : _slotsDict[keyIndex * 2], 'pm' : _slotsDict[keyIndex * 2 + 1]};
}

module.exports = Group;

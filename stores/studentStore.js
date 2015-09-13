var Api = require('./api');
var assign = require('object-assign');
var Dispatcher = require('../dispatcher/dispatcher');
var Constants = require('../dispatcher/constants');
var EventEmitter = require('events').EventEmitter;

var OffLineData = require('./offlineData');
var FileSaver = require('filesaver.js');

var DateRangeStore = require('./dateRangeStore.js');


var CHANGE_EVENT = 'change';
var isOffline = false;

var _students = {};
var _groups = {};
var _mappings = [];
var _isEmpty = true;
var _slotsDict = ['mon_am', 'mon_pm', 'tue_am', 'tue_pm', 'wed_am', 'wed_pm', 'thu_am', 'thu_pm', 'fri_am', 'fri_pm'];

if (isOffline) {
    _students = OffLineData.students;
    _groups = OffLineData.groups;
    _mappings= OffLineData.mappings;
    _isEmpty = false;
}

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

function addMapping(mapping) {
  _mappings.push(mapping.attributes);
}

function updateStudent(student) {
  _students[student.id] = assign({}, {id: student.id}, student.attributes)
}

function addStudent(student) {
  _students[student.id] = assign({}, {id: student.id}, student.attributes);
}

function getMappingsByGroupdIdAndDate(groupId, date) {
  return _mappings.filter(function (mapping) {
    return (mapping.groupId === groupId)
    && (date >= mapping.start_date)
    && (!mapping.end_date || date <= mapping.end_date)
  });
}

function getMappingsByStudentId(studentId) {
  return _mappings.filter(function (mapping) {
    return (mapping.studentId === studentId)
  });
}


function getMappingsByStudentIdAndDate(studentId, date) {
  return _mappings.filter(function (mapping) {
    return (mapping.studentId === studentId)
    && (date >= mapping.start_date)
    && (!mapping.end_date || date <= mapping.end_date)
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

// returns a dictionary of date to dictionary of total count in am and pm range for this date
// i.e. {"12-01-2015": {'am' : 10, 'pm':9}}
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

var StudentWeeklyScheduleRow = function () {
  this.initialize.apply(this, arguments);
  return this;
};

StudentWeeklyScheduleRow.prototype = {};

StudentWeeklyScheduleRow.prototype.initialize = function (student, mapping) {
  this.student = student;
  this.mapping = mapping;
}

StudentWeeklyScheduleRow.prototype.serializeToList = function () {
  var result = _slotsDict.map(function (dayTime){
    if (this.mapping[dayTime] > 0) {
      return (dayTime.indexOf("am") > -1) ? "8:00-12:30" : "12:30 - 5:00";
    } else {
      return "";
    }
  }.bind(this));
  result.unshift(this.student.name)
  return result;
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

  getStudentsScheduleRowsForGroupIdDataRange: function(groupId, dateRange) {
    var startDate = dateRange[0];
    var endDate = dateRange[1];
    if (startDate > endDate) {
      console.error('Requested start date=', startDate, ' is later than end date=', endDate);
      return null;
    }

    var studentsList = getMappingsByGroupdIdAndDate(groupId, startDate).map(function (mapping) {
      return new StudentWeeklyScheduleRow(_students[mapping.studentId], mapping);
    });
    return studentsList;
  },

  getStudentsMapForGroupIdAndDateRange: function (groupId, dateRange) {
    var listOfDates = createListOfDatesForDateRange(dateRange);
    var studentsMap = [];

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
          {schedule: schedule}
        )

        studentsMap[mapping.studentId] = student;
      })
    });

    return studentsMap;
  },

  getStudentByStudentIdAndDateRange: function (studentId, groupId) {
    //groupId is only for a new student

    if (studentId === 'new') {
      return this.getNewStudent(groupId);
    }

    //return all mappings sorted by date
    var student;
    var mappings = [];
    var studentMappings = getMappingsByStudentId(studentId);
    studentMappings.forEach(function (mapping) {
      var schedule = {};

      _slotsDict.forEach(function (slot) {
        schedule[slot] = mapping[slot]
      });

      var currentDate = new Date();
      var status;
      if (currentDate > mapping.start_date  && (!mapping.end_date || currentDate < mapping.end_date)) status = 'current';
      else if (currentDate > mapping.end_date) status = 'past';
      else if (currentDate < mapping.start_date) status = 'projected';

      mappings.push({
        schedule: schedule,
        studentId: mapping.studentId,
        groupId: mapping.groupId,
        startDate: mapping.start_date,
        endDate: mapping.end_date,
        status: status
      });

    });

    mappings.sort(function (a,b) {
      return a.startDate - b.startDate
    });

    student = assign(
      {},
      _students[studentId],
      {mappings: mappings}
    )

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


  getNewStudent: function (groupId) {
    var emptySchedule = {};
    _slotsDict.forEach(function (slot){
        emptySchedule[slot] = 0;
    })

    return {
      id: 'new',
      name: null,
      birthbirthdate: null,
      mappings: [
        {schedule: emptySchedule,
          studentId: 'new',
          status: 'new',
          groupId: groupId,
          startDate : new Date()}
      ]
    };
  },

  getNewMapping: function (student) {
    var latestMapping = student.mappings[student.mappings.length -1];
    var mapping = {
      schedule: assign({}, latestMapping.schedule),
      groupId: latestMapping.groupId,
      studentId: latestMapping.studentId,
      startDate: latestMapping.endDate || new Date(),
      endDate: null,
    };

    return mapping;
  },

  getExcel: function () {
    saveToExcel();
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

function generateExcelWorksheetForDateRange(dateRange) {
  var groupHeader = _slotsDict.slice();
  groupHeader.unshift("Student name")

  var data = []
  Object.keys(_groups).map(function(groupId) {
    var groupHeader = _slotsDict.slice();
    groupHeader.unshift(_groups[groupId].name)
    data.push(groupHeader);

    var kidsCountPerDay = _slotsDict.map( function(grouId) {return 0})
    var studentWeeklyScheduleRows = studentStore.getStudentsScheduleRowsForGroupIdDataRange(groupId, dateRange);
    studentWeeklyScheduleRows.forEach(function (studentWeeklyScheduleRow){
      var schedulePerDaySlot = studentWeeklyScheduleRow.serializeToList()
      for (var i = 1; i < schedulePerDaySlot.length; i++) {
          kidsCountPerDay[i-1] += (schedulePerDaySlot[i] === "") ? 0 : 1;
      }
      data.push(schedulePerDaySlot);
    });
    // insert empty cell to adjust for name for the total count of kids attending particular day time section
    kidsCountPerDay.unshift("")
    data.push(kidsCountPerDay)

    data.push([""]);
  });
  return sheet_from_array_of_arrays(data);
}

function saveToExcel() {
  var wb = new Workbook();

  dateRangeMap = DateRangeStore.getDateRangeMap();
  Object.keys(dateRangeMap).forEach(function (dateRangeName) {
    var dateRange = dateRangeMap[dateRangeName].dateRange;
    var ws = generateExcelWorksheetForDateRange(dateRange);
    wb.SheetNames.push(dateRangeName);
    wb.Sheets[dateRangeName] = ws;
  })

  var wbout = XLSX.write(wb, {bookType:'xlsx', bookSST:true, type: 'binary'});
  FileSaver.saveAs(new Blob([s2ab(wbout)],{type:"application/octet-stream"}), "bdCare.xlsx")
}

function datenum(v, date1904) {
    if(date1904) v+=1462;
    var epoch = Date.parse(v);
    return (epoch - new Date(Date.UTC(1899, 11, 30))) / (24 * 60 * 60 * 1000);
}

function sheet_from_groups_student_row_schedules(groups_to_schedulerows) {
  var ws = {}
  var range = {s: {c:10000000, r:10000000}, e: {c:0, r:0 }};

  var row = 0;
  for (group in groups_to_schedulerows) {
    scheduleRowsList = groups_to_schedulerows[group];
    for (var col = 0; C != scheduleRowsList.length; ++col) {
      var cell_ref = XLSX.utils.encode_cell({c:col,r:row});
      ws[cell_ref] = {v: scheduleRowsList[col]};
    }

    row += 1;
  }
}

function sheet_from_array_of_arrays(data, opts) {
    var ws = {};
    var range = {s: {c:10000000, r:10000000}, e: {c:0, r:0 }};
    for(var R = 0; R != data.length; ++R) {
        for(var C = 0; C != data[R].length; ++C) {
            if(range.s.r > R) range.s.r = R;
            if(range.s.c > C) range.s.c = C;
            if(range.e.r < R) range.e.r = R;
            if(range.e.c < C) range.e.c = C;

            var cell = {v: data[R][C]};
            if(cell.v == null) continue;
            var cell_ref = XLSX.utils.encode_cell({c:C,r:R});

            if (typeof cell.v === 'number') {
              cell.t = 'n';
            } else if(typeof cell.v === 'boolean') {
              cell.t = 'b';
            } else if(cell.v instanceof Date) {
                cell.t = 'n'; cell.z = XLSX.SSF._table[14];
                cell.v = datenum(cell.v);
            } else {
              cell.t = 's';
            }

            ws[cell_ref] = cell;
        }
    }
    if(range.s.c < 10000000) ws['!ref'] = XLSX.utils.encode_range(range);
    return ws;
}


function s2ab(s) {
  var buf = new ArrayBuffer(s.length);
  var view = new Uint8Array(buf);
  for (var i=0; i!=s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
  return buf;
}


function Workbook() {
  if(!(this instanceof Workbook)) return new Workbook();
  this.SheetNames = [];
  this.Sheets = {};
}

var assign = require('object-assign');
var EventEmitter = require('events').EventEmitter;

var _dateRangeMap = {};
var _monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];


function setDateRangeMap () {
  var currentDate = new Date(), currentYear = currentDate.getFullYear(), currentMonth = currentDate.getMonth();
  for (var month = currentMonth; month < currentMonth + 3; month++) {
    var startDate = new Date(currentYear, month, 1);
    var monthWord = _monthNames[startDate.getMonth()];
    _dateRangeMap[monthWord + ' ' + startDate.getFullYear()] = {
      key: monthWord + ' ' + startDate.getFullYear().toString(),
      dateRange: [startDate, new Date(currentYear, month + 1, 1)]
    };
  }
}

var dateRangeStore = module.exports = assign({}, EventEmitter.prototype, {

  emitChange: function () {
    this.emit(CHANGE_EVENT);
  },

  addChangeListener: function (callback) {
    this.on(CHANGE_EVENT, callback);
  },

  removeChangeListener: function (callback) {
    this.removeListener(CHANGE_EVENT, callback);
  },

  getDateRangeMap: function () {
    if (!Object.keys(_dateRangeMap).length) {
       setDateRangeMap();
     }
    return _dateRangeMap;
  },

  getDateRangeKeys: function () {
    return Object.keys(_dateRangeMap);
  },

  getCurrentDateRangeObject : function () {
    if (!Object.keys(_dateRangeMap).length) {
       setDateRangeMap();
     }
    return _dateRangeMap[Object.keys(_dateRangeMap)[0]];
  }

});

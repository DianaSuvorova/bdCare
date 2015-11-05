var Helpers = {
  getListOfDates: function (dateRange) {
    if (!dateRange || !dateRange.length) return [];
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
  },

  slotKeysDictForDate: function(d) {
    var _slotsDict = ['mon_am', 'mon_pm', 'tue_am', 'tue_pm', 'wed_am', 'wed_pm', 'thu_am', 'thu_pm', 'fri_am', 'fri_pm'];
    var date = new Date(d);
    var keyIndex = date.getDay() - 1;
    return {'am' : _slotsDict[keyIndex * 2], 'pm' : _slotsDict[keyIndex * 2 + 1]};
  },

  formatDate: function (date) {
    var format2Digit = function (number) { return ("0" + number).slice(-2); };
    if (date) return format2Digit(date.getMonth() + 1) + '/' + format2Digit(date.getDate()) + '/' + date.getFullYear();
  },

  getDateMonthFromToday: function () {
    var now = new Date();
    if (now.getMonth() == 11) {
        var date = new Date(now.getFullYear() + 1, 0, 1);
    } else {
        var date = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    }
    return date;
  }
}
 module.exports = Helpers;

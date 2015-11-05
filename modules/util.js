var util = module.exports = {
  formatDate: function (date) {
    var format2Digit = function (number) { return ("0" + number).slice(-2); };
    if (date) return format2Digit(date.getMonth() + 1) + '/' + format2Digit(date.getDate()) + '/' + date.getFullYear();
  },

  getDatemonthFromToday: function () {
    var now = new Date();
    if (now.getMonth() == 11) {
        var date = new Date(now.getFullYear() + 1, 0, 1);
    } else {
        var date = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    }
    return date;
  }
};

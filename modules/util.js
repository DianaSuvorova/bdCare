var util = module.exports = {
  formatDate: function (date) {
    var format2Digit = function (number) { return ("0" + number).slice(-2); };
    if (date) return format2Digit(date.getMonth() + 1) + '/' + format2Digit(date.getDate()) + '/' + date.getFullYear();
  }
};

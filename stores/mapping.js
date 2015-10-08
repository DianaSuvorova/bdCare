var Mapping = function () {
  this.initialize.apply(this, arguments);
  return this;
};

Mapping.prototype = {};

var _slotsDict = ['mon_am', 'mon_pm', 'tue_am', 'tue_pm', 'wed_am', 'wed_pm', 'thu_am', 'thu_pm', 'fri_am', 'fri_pm'];

Mapping.prototype.initialize = function (o) {
 this.schedule = {};
 _slotsDict.forEach(function (slot) {
   this.schedule[slot] = o && o[slot] || 0;
 }.bind(this));
 this.groupId = o && o.groupId;
 this.studentId = o && o.studentId;
 this.startDate = o && o.start_date;
 this.endDate = o && o.end_date;
 this.status = this._getStatus();
};

Mapping.prototype.isActive = function (date) {
  return date >= this.startDate && ( !this.endDate || date <= this.endDate)
}

Mapping.prototype._getStatus = function () {
  var currentDate = new Date();
  if (currentDate > this.start_date  && (!this.endDate || currentDate < this.endDate))return 'current';
  else if (currentDate > this.endDate) return 'past';
  else if (currentDate < this.startDate) return'projected';
};

Mapping.prototype.toExcelFormat = function () {

  return _slotsDict.map(function (dayTime){
    if (this.schedule[dayTime] > 0) {
      return (dayTime.indexOf("am") > -1) ? "8:00-12:30" : "12:30 - 5:00";
    } else {
      return "";
    }
  }.bind(this));
};

module.exports = Mapping;

var assign = require('object-assign');

var Mapping = function () {
  this.initialize.apply(this, arguments);
  return this;
};

Mapping.prototype = {};

var _slotsDict = ['mon_am', 'mon_pm', 'tue_am', 'tue_pm', 'wed_am', 'wed_pm', 'thu_am', 'thu_pm', 'fri_am', 'fri_pm'];

Mapping.prototype.initialize = function (o) {
  this.id = o.id;
  this.schedule = {};
  _slotsDict.forEach(function (slot) {
      this.schedule[slot] = o && o[slot] || 0;
   }.bind(this));
   this.groupId = o && o.groupId;
   this.studentId = o && o.studentId;
   this.startDate = o && o.start_date;
   this.endDate = o && o.end_date;
   this.waitlist = o.isOnWaitlist;
   this.setAttributes();
};

Mapping.prototype.clone = function () {
  var id = "id" + Math.random().toString(16).slice(2);
  var o = assign({}, this, this.schedule, {id : id, start_date: this.startDate, end_date: this.endDate});
  var clone = new Mapping(o);
  return clone;
};


Mapping.prototype.setAttributes = function (o) {
  assign(this, o);
  this.status = this._getStatus();
};

Mapping.prototype.isActive = function (date) {
  return date >= this.startDate && ( !this.endDate || date <= this.endDate)
}

Mapping.prototype.isActiveEnrolled = function (date) {
  return date >= this.startDate && ( !this.endDate || date <= this.endDate) && (!this.waitlist)
}


Mapping.prototype.isActiveWaitlist = function (date) {
  return date >= this.startDate && ( !this.endDate || date <= this.endDate) && (this.waitlist)
}

Mapping.prototype._getStatus = function () {
  var currentDate = new Date();
  if (currentDate > this.startDate  && (!this.endDate || currentDate < this.endDate)) return 'current';
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

var React = require('react');
var $ = require('jquery-browserify');
var ClassNames = require('classnames');


var StudentAction = require('../../stores/StudentAction');
var Calendar = require('../calendar/calendar.react');

var student = module.exports = React.createClass({

  render: function () {
    var classes = {
      student : ClassNames({
        student: true,
        hidden: !this.props.addMode
      })
    };

    var schedule = {}
    Object.keys(this.props.availableSchedule).forEach(function (slot) {
      schedule[slot] = (this.props.availableSchedule[slot] > 0 ) ? 0 : 1
    }.bind(this))

    return (
      <div className = {classes.student}>
        <input className = 'name' placeholder = {'name'}></input>
        <input className = 'birthdate' placeholder = {'birthdate'}></input>
        <input className = 'group' placeholder = {'group'}></input>
        <Calendar schedule = {schedule} entry = {this.props.entry} />
      </div>
    )
  },

  _onAddNewStudent: function (e) {
    var $studentEntry = $(e.target).closest('div.student')

    var entry = {
      name: $studentEntry.find('input.name').val(),
      group: $studentEntry.find('input.group').val(),
      birthdate: null
    };

    birthdateString = birthdate = $studentEntry.find('input.birthdate').val()
    if (this._isDate(birthdateString)) {
      entry.birthdate = new Date(birthdateString)
    }

    StudentAction.saveStudent(entry);
  },

  _isDate: function (date) {
    return (new Date(date) !== 'Invalid Date' && !isNaN(new Date(date)) )  ? true : false;
  }
  
});

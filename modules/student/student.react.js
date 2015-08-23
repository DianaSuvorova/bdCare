var React = require('react');
var $ = require('jquery-browserify');
var ClassNames = require('classnames');


var StudentAction = require('../../stores/StudentAction');
var Calendar = require('../calendar/calendar.react');

var student = module.exports = React.createClass({

  render: function () {
    var studentEntry = { name: null, birthdate: null, schedule: this.props.schedule, entry: true };
    var student = this.props.student || studentEntry;

    var classes = {
      student : ClassNames({
        student: true,
        hidden: (!this.props.student && !this.props.editMode) ? true : false
      })
    };

    return (
      <div className = {classes.student}>
        <input className = 'name' defaultValue = {student.name} placeholder = {'name'} readOnly = {!this.props.editMode}></input>
        <input className = 'birthdate' defaultValue = {this._formatDate(student.birthdate)} placeholder = {'birthdate'} readOnly = {!this.props.editMode}></input>
        <input className = 'group' defaultValue = {student.group} readOnly = {!this.props.editMode}></input>
        <Calendar schedule = {student.schedule} editMode = {this.props.editMode} entry = {student.entry || false} />
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
  },

  _formatDate: function (date) {
    var format2Digit = function (number) { return ("0" + number).slice(-2); };
    if (date) return format2Digit(date.getMonth() + 1) + '/' + format2Digit(date.getDate()) + '/' + date.getFullYear();
  }

});

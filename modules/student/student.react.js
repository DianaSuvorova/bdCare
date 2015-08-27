var React = require('react');
var $ = require('jquery-browserify');
var ClassNames = require('classnames');


var StudentAction = require('../../stores/StudentAction');
var Calendar = require('../calendar/calendar.react');

var student = module.exports = React.createClass({


  render: function () {

    var classes = {
      student : ClassNames({
        'student': true,
        'active' : (this.props.activeStudent && this.props.activeStudent.id === this.props.student.id)
      })
    }

    var calendar = (this.props.calendar) ? <Calendar schedule = {this.props.student.schedule} entry = {false} /> : null;

    return (
      <div className = {classes.student} onClick = {this._onClickStudent}>
        <span>{this.props.student.name}</span>
        <span>{this._formatDate(this.props.student.birthdate)}</span>
        {calendar}
      </div>
    )
  },

  _onClickStudent: function () {
    (this.props.activeStudent && this.props.activeStudent.id === this.props.student.id) ? this.props.editStudent(null) : this.props.editStudent(this.props.student);
  },

  _formatDate: function (date) {
    var format2Digit = function (number) { return ("0" + number).slice(-2); };
    if (date) return format2Digit(date.getMonth() + 1) + '/' + format2Digit(date.getDate()) + '/' + date.getFullYear();
  }

});

var React = require('react');
var $ = require('jquery');
var ClassNames = require('classnames');

var Calendar = require('../calendar/calendar.react');

var student = module.exports = React.createClass({


  render: function () {

    var classes = {
      student : ClassNames({
        'student': true
      })
    }

    return (
      <div className = {classes.student} onClick = {this._onClickStudent}>
        <span className = {'index'} >{this.props.index}</span>
        <span>{this.props.student.name}</span>
        <span>{this._formatDate(this.props.student.birthdate)}</span>
        <Calendar schedule = {this.props.student.schedule} editable = {false} />
      </div>
    )
  },

  _onClickStudent: function () {
    this.props.openStudent(this.props.student.id);
  },

  _formatDate: function (date) {
    var format2Digit = function (number) { return ("0" + number).slice(-2); };
    if (date) return format2Digit(date.getMonth() + 1) + '/' + format2Digit(date.getDate()) + '/' + date.getFullYear();
  }

});

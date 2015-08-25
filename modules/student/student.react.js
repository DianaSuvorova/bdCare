var React = require('react');
var $ = require('jquery-browserify');
var ClassNames = require('classnames');


var StudentAction = require('../../stores/StudentAction');
var Calendar = require('../calendar/calendar.react');

var student = module.exports = React.createClass({

  render: function () {

    return (
      <div className = 'student'>
        <span>{this.props.student.name}</span>
        <span>{this._formatDate(this.props.student.birthdate)}</span>
        <Calendar schedule = {this.props.student.schedule} entry = {false} />
      </div>
    )
  },

  _formatDate: function (date) {
    var format2Digit = function (number) { return ("0" + number).slice(-2); };
    if (date) return format2Digit(date.getMonth() + 1) + '/' + format2Digit(date.getDate()) + '/' + date.getFullYear();
  }

});

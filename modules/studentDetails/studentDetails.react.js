var React = require('react');
var $ = require('jquery-browserify');
var ClassNames = require('classnames');
var assign = require('object-assign');

var Calendar = require('../calendar/calendar.react');

var studentEdit = module.exports = React.createClass({

  render: function () {

    return (
      <div id = 'studentDetails'>
      <span className = 'actionItem warning close' onClick = {this._onCloseEditStudent}><i className = 'fa fa-times'></i></span>
        <div className = 'details'>
          <div>
            <input className = 'name' defaultValue = {this.props.student.name} placeholder = {'name'}></input>
            <input className = 'birthdate' defaultValue = {this._formatDate(this.props.student.birthdate)} placeholder = {'birthdate'}></input>
          </div>
        </div>
      </div>
    );
  },

  _formatDate: function (date) {
    var format2Digit = function (number) { return ("0" + number).slice(-2); };
    if (date) return format2Digit(date.getMonth() + 1) + '/' + format2Digit(date.getDate()) + '/' + date.getFullYear();
  },

  _onCloseEditStudent: function () {
    this.props.closeStudentDetails();
  }

});

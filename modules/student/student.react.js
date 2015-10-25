var React = require('react');
var $ = require('jquery');
var ClassNames = require('classnames');

var Calendar = require('../calendar/calendar.react');
var Capacity = require('../capacity/capacity.react');var StudentStore = require('../../stores/studentStore');


var student = module.exports = React.createClass({

  render: function () {

    var classes = {
      student : ClassNames({
        'student': true,
        'waitlist': this.props.waitlist
      })
    }
    return (
      <div className = {classes.student} onClick = {this._onClickStudent}>
        <span className = {'index'} >{this.props.index}</span>
        <span>{this.props.student.name}</span>
        <span>{this._formatDate(this.props.student.birthdate)}</span>
        <Capacity
          schedule = {this.props.student.getMapping({groupId: this.props.groupId}).schedule}
            capacity = {1}
            single = {true}
            waitlist={this.props.waitlist}
          />
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

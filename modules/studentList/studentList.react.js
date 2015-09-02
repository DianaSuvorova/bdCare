var React = require('react');
var $ = require('jquery');
var ClassNames = require('classnames');
var assign = require('object-assign');

var StudentStore = require('../../stores/studentStore');

var Student = require('../student/student.react')
var MonthPicker = require('../monthPicker/monthPicker.react');
var GroupPicker = require('../groupPicker/groupPicker.react');
var CalendarHeader = require('../calendar/CalendarHeader.react');

var studentList = module.exports = React.createClass({

  render: function () {
    var i = 0;
    var students = Object.keys(this.props.students).map(function (studentId) {
      i++;
      var student = this.props.students[studentId];
      return <Student key = {studentId} student = {student} index = {i} openStudent = {this.props.openStudent}/>
    }.bind(this));

    var header = (
      <div className = 'header'>
        <div className = 'index'>
          <span className = {'actionItem'} onClick = {this._onAddNewStudent}><i className = 'fa fa-plus'></i></span>
        </div>
        <div>Name</div>
        <div>Date of Birth</div>
        <CalendarHeader/>
      </div>
    )

    return (
      <div id = 'studentList'>
          {header}
          {students}
      </div>
      );
  },

  _onAddNewStudent: function () {
    this.props.openStudent('new');
  },

});

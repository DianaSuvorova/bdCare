var React = require('react');
var $ = require('jquery');
var ClassNames = require('classnames');
var assign = require('object-assign');

var StudentStore = require('../../stores/studentStore');

var Student = require('../student/student.react')
var CalendarHeader = require('../calendar/CalendarHeader.react');

var studentList = module.exports = React.createClass({

  render: function () {
    var students = StudentStore.getStudents(this.props.group.getStudentIds(this.props.dateRangeObject.dateRange));
    var i = 0;
    var studentEls = Object.keys(students).map(function (studentId) {
      i++;
      var student = students[studentId];
      return <Student
          key = {studentId}
          student = {student}
          dateRangeObject = {this.props.dateRangeObject}
          group = {this.props.group}
          index = {i}
          openStudent = {this.props.openStudent}
          waitlist = {false}
        />
    }.bind(this));

    var waitlistStudents = StudentStore.getStudents(this.props.group.getWaitlistStudentIds(this.props.dateRangeObject.dateRange));
    var i = 0;
    var waitlistStudentEls = Object.keys(waitlistStudents).map(function (studentId) {
      i++;
      var student = waitlistStudents[studentId];
      return <Student
          key = {studentId}
          student = {student}
          dateRangeObject = {this.props.dateRangeObject}
          group = {this.props.group}
          index = {i}
          openStudent = {this.props.openStudent}
          waitlist = {true}
          onHighlightSchedule = {this.props.onHighlightSchedule}
        />
    }.bind(this));


    var header = (
      <div className = 'header'>
        <div className = 'subheader'>
          <span className = 'label'>{'ENROLLED STUDENTS'}</span>
          <span className = 'value'>{Object.keys(students).length}</span>
        </div>
        <CalendarHeader/>
      </div>
    )

    var waitlistHeader = (
      <div className = 'header waitlist'>
        <div className = 'subheader'>
          <span className= 'label'>{'WAITLIST STUDENTS'}</span>
          <span className= 'value'>{Object.keys(waitlistStudents).length}</span>
        </div>
        <CalendarHeader/>
      </div>
    )

    return (
      <div id = 'studentList'>
        {waitlistHeader}
        <div className= 'body'>{waitlistStudentEls}</div>
        {header}
        <div className= 'body'>{studentEls}</div>
      </div>
      );
  },

  _onAddNewStudent: function () {
    this.props.openStudent('new');
  },

});

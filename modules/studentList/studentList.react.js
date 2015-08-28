var React = require('react');
var $ = require('jquery-browserify');
var ClassNames = require('classnames');
var assign = require('object-assign');

var StudentStore = require('../../stores/studentStore');

var Student = require('../student/student.react')
var MonthPicker = require('../monthPicker/monthPicker.react');
var GroupPicker = require('../groupPicker/groupPicker.react');

var studentList = module.exports = React.createClass({

  render: function () {
    var i = 0;
    var students = Object.keys(this.props.students).map(function (studentId) {
      i++;
      var student = this.props.students[studentId];
      return <Student key = {studentId} student = {student} index = {i} openStudent = {this.props.openStudent} calendar = {true}/>
    }.bind(this));

    var header = (
      <div className = 'header'>
        <div className = 'index'>
          <span className = {'actionItem'} onClick = {this._onAddNewStudent}><i className = 'fa fa-plus'></i></span>
        </div>
        <div>Name</div>
        <div>Date of Birth</div>
        <div className = 'calendar'>
          <span>Mon</span>
          <span>Tue</span>
          <span>Wed</span>
          <span>Thu</span>
          <span>Fri</span>
        </div>
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
    (this.props.activeStudent && this.props.activeStudent.id === this._getNewStudent().id) ? this.props.editStudent(null) : this.props.editStudent(this._getNewStudent());
  },

});

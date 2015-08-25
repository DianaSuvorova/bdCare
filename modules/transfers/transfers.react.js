var React = require('react');
var $ = require('jquery-browserify');
var ClassNames = require('classnames');

var StudentStore = require('../../stores/studentStore');
var StudentAction = require('../../stores/studentAction');

var Group = require('../group/group.react');
var Student = require('../student/student.react');

var transfers = module.exports = React.createClass({

  getInitialState: function () {
    if (StudentStore.isEmpty()) {
      StudentAction.loadStudents(this.props.schoolId);
      return {groups: []};
    }
    else {
      return this._getState();
    }
  },

  componentDidMount: function () {
    StudentStore.addChangeListener(this._onChange);
  },

  componentWillUnmount: function () {
    StudentStore.removeChangeListener(this._onChange);
  },

  componentWillReceiveProps: function(nexProps) {
    this.setState(this._getState(nexProps.dateRange));
  },

  render: function () {
    console.log(this.state.groups);

    var groups = this.state.groups.map(function (group) {
      return <Group key = {group.id} groupId = {group.id} group = {group}/>
    });

    var students = this.state.groups.map(function (group) {
      var groupStudents = Object.keys(group.students).map(function (studentId) {
        var student = group.students[studentId];
        return (student) ? <Student key = {studentId} student = {student} calendar = {false} draggable = {true}/> : null
      });

      var groupEl =
        <div key = {'students_'+ group.id}>
          <span>{group.name}</span>
          <div>{groupStudents}</div>
        </div>

        return (group.studentIdsEligibleForUpgrade.length)? groupEl : null;
    });

    return (
      <div id = 'transfers'>
        <div className = 'students'> {students} </div>
        <div className = 'groups'> {groups} </div>
      </div>
      );
  },

  _onChange: function () {
    this.setState(this._getState());
  },

  _getState: function (dateRange) {
    var dateRange = dateRange || this.props.dateRange;

    var groups = StudentStore.getDashboardSummaryForDateRange(dateRange).map(function (group) {
        group.students = {};
        group.studentIdsEligibleForUpgrade.forEach(function (studentId) {
          group.students[studentId] = StudentStore.getStudentByStudentIdAndDateRange(studentId, dateRange);
        })
        return group;
    });

    return { groups: groups };
  }

});

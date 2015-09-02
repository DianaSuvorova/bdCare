var React = require('react');
var $ = require('jquery');
var ClassNames = require('classnames');
var assign = require('object-assign');

var GroupDetails = require('../groupDetails/groupDetails.react');
var StudentDetails = require('../studentDetails/studentDetails.react');

var Api = require('../../stores/api');

var StudentStore = require('../../stores/studentStore');
var StudentAction = require('../../stores/studentAction');
var DateRangeStore = require('../../stores/dateRangeStore');

var students = module.exports = React.createClass({

  getInitialState: function () {
    if (StudentStore.isEmpty()) {
      StudentAction.loadStudents(this.props.schoolId);
      return {
        groupId: null,
        dateRangeObject: null,
        groups: {},
        groupSchedule: {},
        activeStudent: null
      };
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

  render: function () {
    var studentDetails = (this.state.activeStudentId) ? <StudentDetails student = {this.state.activeStudent} groups = {this.state.groups} dateRangeObject = {this.state.dateRangeObject} closeStudentDetails = {this._closeStudentDetails} groupId = {this.state.groupId}/> : null;

    var students = (StudentStore.isEmpty()) ?
      null :
      (<div id = 'students'>
        <GroupDetails groupId = {this.state.groupId} dateRangeObject = {this.state.dateRangeObject} openStudent = {this._openStudentDetails} activeStudent = {this.state.activeStudent} groups = {this.state.groups}/>
        {studentDetails}
      </div>)

    return students;
  },

  _onChange: function () {
    this.setState(this._getState());
  },

  _openStudentDetails : function (dateRangeObject, groupId, studentId) {
    this.setState(this._getState(dateRangeObject, groupId, studentId));
  },

  _closeStudentDetails : function () {
    this.setState({activeStudentId: null});
  },

  _getState: function (dateRangeObject, groupId, activeStudentId) {

    var groups = StudentStore.getGroupsMap();
    var dateRangeObject = dateRangeObject || this.props.dateRangeObject || DateRangeStore.getCurrentDateRangeObject();
    var groupId = groupId || this.props.groupId || Object.keys(groups)[0];

    var activeStudentId = activeStudentId || this.state && this.state.activeStudentId;
    var activeStudent = null;
    if (activeStudentId) {
      activeStudent = StudentStore.getStudentByStudentIdAndDateRange(activeStudentId, groupId);
    }

    return {
      groupId: groupId,
      dateRangeObject: dateRangeObject,
      groups: groups,
      activeStudentId: activeStudentId,
      activeStudent: activeStudent
    };
  }

});

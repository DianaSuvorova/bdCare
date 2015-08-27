var React = require('react');
var $ = require('jquery-browserify');
var ClassNames = require('classnames');
var assign = require('object-assign');

var StudentList = require('./studentList.react');
var StudentDetails = require('../student/studentDetails.react');

var Api = require('../../stores/api');

var StudentStore = require('../../stores/studentStore');
var StudentAction = require('../../stores/studentAction');
var DateRangeStore = require('../../stores/dateRangeStore');

var students = module.exports = React.createClass({

//  contextTypes: { router: React.PropTypes.func },

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
    var studentDetails = (this.state.activeStudent) ? <StudentDetails student = {this.state.activeStudent} groups = {this.state.groups} dateRangeObject = {this.state.dateRangeObject}/> : null;

    var students = (StudentStore.isEmpty()) ?
      null :
      (<div id = 'students'>
        <StudentList groupId = {this.state.groupId} dateRangeObject = {this.state.dateRangeObject} openStudent = {this._openStudent} activeStudent = {this.state.activeStudent} groups = {this.state.groups}/>
        {studentDetails}
      </div>)

    return students;
  },

  _onChange: function () {
    this.setState(this._getState());
  },

  _openStudent : function (student) {
    this.setState(this._getState(student));
  },

  _getState: function (activeStudent) {
//    var dateRangeKey = this.context.router.getCurrentParams().dateRange;

    var groups = StudentStore.getGroupsMap();
    var dateRangeObject = this.props.dateRangeObject || DateRangeStore.getCurrentDateRangeObject();
    var groupId = this.props.groupId || Object.keys(groups)[0];

    var activeStudent = activeStudent || this.state && this.state.activeStudent;

    return {
      groupId: groupId,
      dateRangeObject: dateRangeObject,
      groups: groups,
      activeStudent: activeStudent
    };
  }

});

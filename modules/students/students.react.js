var React = require('react');
var $ = require('jquery');
var ClassNames = require('classnames');
var assign = require('object-assign');

var GroupDetails = require('../groupDetails/groupDetails.react');
var StudentDetails = require('../studentDetails/studentDetails.react');
var NewStudentDetails = require('../studentDetails/newStudentDetails.react');
var MonthPicker = require('../monthPicker/monthPicker.react');
var GroupPicker = require('../groupPicker/groupPicker.react');


var Api = require('../../stores/api');

var StudentStore = require('../../stores/studentStore');
var StudentAction = require('../../stores/studentAction');
var DateRangeStore = require('../../stores/dateRangeStore');

var Router = require('./../router/router');

var students = module.exports = React.createClass({

  getInitialState: function () {
    if (StudentStore.isEmpty()) {
      StudentAction.loadStudents(this.props.schoolId);
      return {
        groupId: null,
        dateRangeObject: DateRangeStore.getCurrentDateRangeObject(),
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
    var content = <GroupDetails
      dateRangeObject = {this.state.dateRangeObject}
      openStudentDetails = {this._openStudentDetails}
      activeStudent = {this.state.activeStudent}
      groups = {this.state.groups}
      group = {this.state.group}
      updateDateRange = {this._onUpdateDateRange}
      updateGroup = {this._onUpdateGroup}
    />
    if (this.state.activeStudentId === 'new') {
      content = <NewStudentDetails
        student = {this.state.activeStudent}
        groups = {this.state.groups}
        dateRangeObject = {this.state.dateRangeObject}
        closeStudentDetails = {this._closeStudentDetails}
        groupId = {this.state.groupId}
        createNewStudent = {this._createNewStudent}
      />
    }
    else if (this.state.activeStudentId) {
      content = <StudentDetails
        students= {this.state.students}
        student = {this.state.activeStudent}
        groups = {this.state.groups}
        dateRangeObject = {this.state.dateRangeObject}
        closeStudentDetails = {this._closeStudentDetails}
        groupId = {this.state.groupId}
      />
    }


    var students = (StudentStore.isEmpty()) ?
      null :
      (<div id = 'students'>
        <div className = 'toolbar'>
          <MonthPicker dateRangeObject = {this.state.dateRangeObject} updateDateRange = {this._onUpdateDateRange} />
          <GroupPicker update = {this._onUpdateGroup} kvObject = {this.state.groups[this.state.groupId]} kvMap = {this.state.groups}/>
          <span className = 'actionItemText ' onClick = {this._onAddNewStudent}>
            <i className = 'fa fa-plus'></i>
            <span>Add student</span>
          </span>
        </div>
        {content}
      </div>)

    return students;
  },


  _createNewStudent: function (student, mapping) {
    StudentAction.addStudent(student, mapping);
    this.setState({activeStudentId: null});
  },

  _onChange: function () {
    this.setState(this._getState());
  },

  _openStudentDetails : function (studentId) {
    this.setState(this._getState({activeStudentId: studentId}));
  },

  _closeStudentDetails : function () {
    this.setState({activeStudentId: null});
  },

  _onUpdateGroup: function (group) {
    this.setState(this._getState({groupId: group.id}));
  },

  _onAddNewStudent: function () {

  },

  _onUpdateDateRange: function (dateRangeObject) {
    this.setState(this._getState({dateRangeObject: dateRangeObject}));
  },


  _getState: function (newState) {

    var groups = StudentStore.getGroups();
    var defaultState = {
      groups: groups,
      groupId: this.props.groupId || Object.keys(groups)[0],
      dateRangeObject: this.state && this.state.dateRangeObject || this.props.dateRangeObject || DateRangeStore.getCurrentDateRangeObject(),
      activeStudentId: this.state && this.state.activeStudentId
    };

    var state = assign({}, defaultState, newState);

    if (state.activeStudentId) {
      state.activeStudent = StudentStore.getStudents([state.activeStudentId])[state.activeStudentId];
    }

    var group = state.groups[state.groupId];
    var studentIds = group.getStudentIds(state.dateRange);

    state.students = StudentStore.getStudents(studentIds);
    state.group = group;
    return state;
  }

});

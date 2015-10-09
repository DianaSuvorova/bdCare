var React = require('react');
var $ = require('jquery');
var ClassNames = require('classnames');
var assign = require('object-assign');

var GroupDetails = require('../groupDetails/groupDetails.react');
var StudentDetails = require('../studentDetails/studentDetails.react');
var NewStudentDetails = require('../studentDetails/newStudentDetails.react');
var Router = require('./../router/router');

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
      students = {this.state.students}
      groupId = {this.state.groupId}
      dateRangeObject = {this.state.dateRangeObject}
      openStudentDetails = {this._openStudentDetails}
      activeStudent = {this.state.activeStudent}
      groups = {this.state.groups}
      group = {this.state.groupSummary}
      updateDateRange = {this._onUpdateDateRange}
      updateGroup = {this._onUpdateGroup}
    />
    if (this.state.activeStudentId === 'new') {
      console.log(this.state);
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
        {content}
      </div>)

    return students;
  },


  _createNewStudent: function (student, mapping) {
    StudentAction.addStudent(student, mapping);
    Router.navigate('/group/'+ this.state.groupId + '/period/' + dateRangeObject.key);
    this.setState({activeStudentId: null});
  },

  _onChange: function () {
    this.setState(this._getState());
  },

  _openStudentDetails : function (studentId, groupId) {
    if  (studentId === 'new') {
      this.setState(this._getState({activeStudentId: studentId, groupId: groupId}));
      Router.navigate('/group/' + groupId + '/student/'+ studentId );
    }
    else {
      this.setState(this._getState({activeStudentId: studentId}));
      Router.navigate('/student/'+ studentId);
    }

  },

  _closeStudentDetails : function () {
    var groupId = this.state.groupId || Object.keys(StudentStore.getGroups())[0];
    var dateRangeObject = this.state.dateRangeObject || DateRangeStore.getCurrentDateRangeObject();
    Router.navigate('/group/'+ groupId + '/period/' + dateRangeObject.key);
    this.setState(this._getState({activeStudentId: null, groupId: groupId, dateRangeObject: dateRangeObject}));
  },

  _onUpdateGroup: function (groupId) {
    this.setState(this._getState({groupId: groupId}));
    Router.navigate('/group/'+ groupId + '/period/' + this.state.dateRangeObject.key);
  },

  _onUpdateDateRange: function (dateRangeObject) {
    this.setState(this._getState({dateRangeObject: dateRangeObject}));
    Router.navigate('/group/'+ this.state.groupId + '/period/' + dateRangeObject.key);
  },

  _getState: function (newState) {
    var groups = StudentStore.getGroups();
    var defaultState = {
      groups: groups,
      groupId: this.props.groupId,
      dateRangeObject: this.props.dateRangeObject,
      activeStudentId: this.props.activeStudentId
    };

    var state = assign({}, defaultState, newState);

    if (state.activeStudentId) {
        state.activeStudent = StudentStore.getStudents({studentId: state.activeStudentId, groupId: state.groupId})[state.activeStudentId];
    }

    state.students = StudentStore.getStudents({groupId: state.groupId, dateRange: state.dateRangeObject.dateRange});
    state.groupSummary = StudentStore.getGroups({groupId: state.groupId, groupId: state.dateRangeObject.dateRange})[state.groupId];

    return state;
  }

});

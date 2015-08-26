var React = require('react');
var $ = require('jquery-browserify');
var ClassNames = require('classnames');
var assign = require('object-assign');

var StudentStore = require('../../stores/studentStore');
var StudentAction = require('../../stores/studentAction');

var Api = require('../../stores/api');

var Student = require('../student/student.react')
var StudentEntry = require('../student/studentEntry.react')

var studentList = module.exports = React.createClass({

  contextTypes: {
    router: React.PropTypes.func
  },

  getInitialState: function () {
    var groupId = this.context.router.getCurrentParams().groupId;
    if (StudentStore.isEmpty()) {
      StudentAction.loadStudents(this.props.schoolId);
      return {
        students: {},
        availableSchedule: {},
        groupId: groupId
      };
    }
    else {
      return this._getState(groupId);
    }
  },

  componentDidMount: function () {
    StudentStore.addChangeListener(this._onChange);
  },

  componentWillUnmount: function () {
    StudentStore.removeChangeListener(this._onChange);
  },

  componentWillReceiveProps: function(nextProps) {
    this.setState(this._getState(null, nextProps.dateRange));
  },

  render: function () {

    var classes = {
      addActionItem: ClassNames({
        'actionItem': true,
        'active': this.state.addMode
      }),
      saveActionItem: ClassNames({
        'actionItem': true,
        'disabled': true
      }),
      cancelActionItem: ClassNames({
        'actionItem': true,
        'disabled': true
      })
    };

    var students = Object.keys(this.state.students).map(function (studentId) {
      var student = this.state.students[studentId];
      return <Student key = {studentId} student = {student} editStudent = {this.props.editStudent} activeStudent = {this.props.activeStudent} calendar = {true}/>
    }.bind(this));

    var studentEntry = <StudentEntry key = {'studentEntry'} availableSchedule = {this.state.availableSchedule} addMode = {this.state.addMode} entry = {true}/>;

    var header = (
      <div className = 'header'>
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

    var selectGroups =
        <select onChange = {this._onSelectGroup} defaultValue = {this.state.groupId}>
            {
              Object.keys(this.props.groups).map(function(groupId) {
                return <option key = {groupId} value = {groupId}>{this.props.groups[groupId].name}</option>;
              }.bind(this))
            }
          </select>


    var toolbar = (
      <div className = 'toolbar'>
        {selectGroups}
        <span className = {classes.addActionItem} onClick = {this._onToggleAddMode}><i className = 'fa fa-plus'></i></span>
        <span className = {classes.saveActionItem} onClick = {this._onSaveAdd}><i className = 'fa fa-check'></i></span>
        <span className = {classes.cancelActionItem} onClick = {this._onCancelAdd}><i className = 'fa fa-times'></i></span>
      </div>
    );

    return (
      <div id = 'studentList'>
        {toolbar}
        <div className ='table'>
          {header}
          {studentEntry}
          {students}
        </div>
      </div>
      );
  },

  _onChange: function () {
    this.setState(this._getState());
  },

  _onToggleAddMode: function () {
    this.setState({addMode: !this.state.addMode});
  },

  _onSaveAdd: function () {

  },

  _onCancelAdd: function () {

  },

  _onSelectGroup: function (event) {
    this.setState(this._getState(event.target.value));
  },

  _getState: function (groupId, dateRange) {
    var groups = this.props.groups
    var groupId = groupId || this.state && this.state.groupId || Object.keys(groups)[0];
    var dateRange = dateRange || this.props && this.props.dateRange;
    var groupSummary = StudentStore.getGroupSummaryForGroupIdAndDateRange(groupId, dateRange);

    return {
      groups: groups,
      groupId: groupId,
      availableSchedule: groupSummary.schedule,
      students: StudentStore.getStudentsMapForGroupIdAndDateRange(groupId, dateRange)
    };
  }

});

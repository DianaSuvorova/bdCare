var React = require('react');
var $ = require('jquery-browserify');
var ClassNames = require('classnames');
var assign = require('object-assign');

var StudentStore = require('../../stores/studentStore');

var StudentList = require('../studentList/studentList.react')
var MonthPicker = require('../monthPicker/monthPicker.react');
var GroupPicker = require('../groupPicker/groupPicker.react');
var Capacity = require('../capacityCubes/capacityCubes.react');


var groupDetails = module.exports = React.createClass({

  getInitialState: function () {
    return this._getState(this.props.groupId, this.props.dateRangeObject);
  },

  render: function () {
    var toolbar = (
      <div className = 'toolbar'>
        <MonthPicker updateDateRange = {this._onUpdateDateRange} defaultDateRange = {this.state.dateRangeObject.key}/>
        <GroupPicker updateGroup = {this._onUpdateGroup} group = {this.props.groups[this.state.groupId]} groups = {this.props.groups}/>
      </div>
    );

    return (
      <div id = 'groupDetails'>
        <div className = 'summary'>
          {toolbar}
          <Capacity schedule = {this.state.groupSummary.schedule} capacity = {this.state.groupSummary.capacity}  header = {false}/>
        </div>
        <StudentList students = {this.state.students} openStudent = {this._openStudent}/>
      </div>
      );
  },

  _openStudent: function (studentId) {
    this.props.openStudent (this.state.dateRangeObject, this.state.groupId, studentId)
  },

  _onUpdateGroup: function (group) {
    this.setState(this._getState(group.id, null));
  },

  _onUpdateDateRange: function (dateRangeObject) {
    this.setState(this._getState(null, dateRangeObject));
  },

  _getState: function (groupId, dateRangeObject) {
    var groupId = groupId || this.state.groupId;
    var dateRangeObject = dateRangeObject || this.state.dateRangeObject;

    var groupSummary = StudentStore.getGroupSummaryForGroupIdAndDateRange(groupId, dateRangeObject.dateRange);
    var students = StudentStore.getStudentsMapForGroupIdAndDateRange(groupId, dateRangeObject.dateRange);

    return {
      groupId: groupId,
      dateRangeObject: dateRangeObject,
      groupSummary: groupSummary,
      students: students
    };
  },


});

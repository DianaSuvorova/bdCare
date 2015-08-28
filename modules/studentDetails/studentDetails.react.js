var React = require('react');
var $ = require('jquery-browserify');
var ClassNames = require('classnames');
var assign = require('object-assign');

var Calendar = require('../calendar/calendar.react');
var CalendarHeader = require('../calendar/calendarHeader.react');
var MonthPicker = require('../monthPicker/monthPicker.react');
var GroupPicker = require('../groupPicker/groupPicker.react');
var Capacity = require('../capacityCubes/capacityCubes.react');

var StudentStore = require('../../stores/studentStore');

var studentDetails = module.exports = React.createClass({

  getInitialState: function () {
    return this._getState()
  },

  render: function () {

    return (
      <div id = 'studentDetails'>
        <div className = 'container'>
        <div className = 'toolbox top'>
          <span className = 'actionItem warning close' onClick = {this._onCloseEditStudent}><i className = 'fa fa-times'></i></span>
        </div>
          <div className = 'details'>
            <div className = 'name' >
              <input defaultValue = {this.props.student.name} placeholder = {'name'}></input>
            </div>
            <div className = 'birthdate' >
              <input defaultValue = {this._formatDate(this.props.student.birthdate)} placeholder = {'birthdate'}></input>
            </div>
            <div className = 'calendar'>
              <Calendar schedule = {this.props.student.schedule} entry = {false} />
            </div>
            <CalendarHeader/>
            <div className = 'group'>
              <MonthPicker updateDateRange = {this._onUpdateDateRange} defaultDateRange = {this.props.dateRangeObject.key}/>
              <GroupPicker updateGroup = {this._onUpdateGroup} group = {this.props.groups[this.props.groupId]} groups = {this.props.groups}/>
              <Capacity schedule = {this.state.groupSummary.schedule} capacity = {this.state.groupSummary.capacity}  header = {false}/>
            </div>
          </div>
        </div>
      </div>
    );
  },

  _formatDate: function (date) {
    var format2Digit = function (number) { return ("0" + number).slice(-2); };
    if (date) return format2Digit(date.getMonth() + 1) + '/' + format2Digit(date.getDate()) + '/' + date.getFullYear();
  },

  _onCloseEditStudent: function () {
    this.props.closeStudentDetails();
  },

  _onUpdateGroup: function (group) {
    this.setState(this._getState(group.id, null));
  },

  _onUpdateDateRange: function (dateRangeObject) {
    this.setState(this._getState(null, dateRangeObject));
  },

  _getState: function (groupId, dateRangeObject) {
    var groupId = groupId || this.state && this.state.groupId || this.props.groupId;
    var dateRangeObject = dateRangeObject || this.state && this.state.dateRangeObject || this.props.dateRangeObject;

    var groupSummary = StudentStore.getGroupSummaryForGroupIdAndDateRange(groupId, dateRangeObject.dateRange);

    return {
      groupId: groupId,
      dateRangeObject: dateRangeObject,
      groupSummary: groupSummary
    };
  }

});

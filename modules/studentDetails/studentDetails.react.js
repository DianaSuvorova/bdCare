var React = require('react');
var $ = require('jquery-browserify');
var ClassNames = require('classnames');
var assign = require('object-assign');

var Calendar = require('../calendar/calendar.react');
var CalendarHeader = require('../calendar/calendarHeader.react');
var MonthPicker = require('../monthPicker/monthPicker.react');
var GroupPicker = require('../groupPicker/groupPicker.react');
var Capacity = require('../capacityCubes/capacityCubes.react');
var ActionEditable = require('../actionEditable/actionEditable.react')

var StudentStore = require('../../stores/studentStore');

var studentDetails = module.exports = React.createClass({

  getInitialState: function () {
    return this._getState()
  },

  render: function () {

    var classes = {
      editableInlineCalendar: ClassNames({
        'editableInline schedule' : true,
        'active': (this.state.calendarState === 'edit')
      })
    };

    return (
      <div id = 'studentDetails'>
        <div className = 'container'>
          <div className = 'details'>
            <div className = 'row section'>
              <div className = 'name editableInline' >
                <input defaultValue = {this.props.student.name} placeholder = {'name'}></input>
                <ActionEditable/>
              </div>
              <div className = 'birthdate editableInline'>
                <input defaultValue = {this._formatDate(this.props.student.birthdate)} placeholder = {'birthdate'}></input>
                <ActionEditable/>
              </div>
            </div>
            <div className = 'row section'>
              <CalendarHeader/>
            </div>
            <div className = 'row'>
              <div className = {classes.editableInlineCalendar}>
                <Calendar schedule = {this.props.student.schedule} editable = {this.state.calendarState === 'edit'} updateSchedule = {this._onUpdateSchedule}/>
                <ActionEditable edit = {this._calendarActions().edit} confirm = {this._calendarActions().confirm} cancel = {this._calendarActions().cancel} active = {this.state.calendarState === 'edit'}/>
              </div>
            </div>
            <div className = 'row section'>
              <div className = 'group'>
                <MonthPicker updateDateRange = {this._onUpdateDateRange} defaultDateRange = {this.props.dateRangeObject.key}/>
                <GroupPicker updateGroup = {this._onUpdateGroup} group = {this.props.groups[this.props.groupId]} groups = {this.props.groups}/>
                <Capacity schedule = {this.state.groupSummary.schedule} capacity = {this.state.groupSummary.capacity}/>
              </div>
            </div>
          </div>
          <div className = 'toolbox bottom'>
            <span className = 'actionItem warning cancel' onClick = {this._onCloseEditStudent}><i className = 'fa fa-times'></i></span>
            <span className = 'actionItem save' onClick = {this._onCloseEditStudent}><i className = 'fa fa-check'></i></span>
          </div>
        </div>
      </div>
    );
  },

  _calendarActions: function () {
    return {
      edit : function () {
        this.setState(this._getState(null, null, 'edit'));
      }.bind(this),
      confirm : function () {
        console.log('shit should happen here');
        this.setState(this._getState(null, null, 'view'));
      }.bind(this),
      cancel : function () {
        this.setState(this._getState(null, null, 'view'));
      }.bind(this)
    };
  },

  _onUpdateSchedule: function (schedule) {
    console.log('updated schedule: ', schedule);
  },

  _formatDate: function (date) {
    var format2Digit = function (number) { return ("0" + number).slice(-2); };
    if (date) return format2Digit(date.getMonth() + 1) + '/' + format2Digit(date.getDate()) + '/' + date.getFullYear();
  },

  _onCloseEditStudent: function () {
    this.props.closeStudentDetails();
  },

  _onUpdateGroup: function (group) {
    this.setState(this._getState(group.id, null, null));
  },

  _onUpdateDateRange: function (dateRangeObject) {
    this.setState(this._getState(null, dateRangeObject, null));
  },

  _getState: function (groupId, dateRangeObject, calendarState) {
    var groupId = groupId || this.state && this.state.groupId || this.props.groupId;
    var dateRangeObject = dateRangeObject || this.state && this.state.dateRangeObject || this.props.dateRangeObject;
    var calendarState = calendarState || this.state && this.state.calendarState || 'view';

    var groupSummary = StudentStore.getGroupSummaryForGroupIdAndDateRange(groupId, dateRangeObject.dateRange);

    return {
      groupId: groupId,
      dateRangeObject: dateRangeObject,
      groupSummary: groupSummary,
      calendarState: calendarState
    };
  }

});

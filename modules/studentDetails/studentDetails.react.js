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
      }),
      editableInlineGroup: ClassNames({
        'editableInline group' : true,
        'active': (this.state.groupState === 'edit')
      }),
      editableInlineMappingDate: ClassNames({
        'editableInline mapping' : true,
        'active': (this.state.mappingState === 'edit')
      }),
      mappingUpdate: ClassNames({
        'row mappingUpdate': true,
        'active' : ((this.state.calendarState === 'confirmed') || (this.state.groupState === 'confirmed'))
      })
    };

    var groupSelect = (this.state.groupState === 'edit') ?
      <GroupPicker updateGroup = {this._onUpdateGroup} group = {this.props.groups[this.state.groupId]} groups = {this.props.groups}/> :
      <span>{this.props.groups[this.state.groupId].name}</span> ;

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
              <div className = {classes.editableInlineGroup}>
                {groupSelect}
                <ActionEditable edit = {this._groupActions().edit} confirm = {this._groupActions().confirm} cancel = {this._groupActions().cancel} active = {this.state.groupState === 'edit'}/>
              </div>
            </div>
            <div className = 'row section calendarHeader'>
              <CalendarHeader/>
            </div>
            <div className = 'row'>
              <div className = {classes.editableInlineCalendar}>
                <Calendar schedule = {this.state.studentSchedule} editable = {this.state.calendarState === 'edit'} updateSchedule = {this._onUpdateSchedule}/>
                <ActionEditable edit = {this._calendarActions().edit} confirm = {this._calendarActions().confirm} cancel = {this._calendarActions().cancel} active = {this.state.calendarState === 'edit'}/>
              </div>
            </div>
            <div className = {classes.mappingUpdate}>
              <div>Please confirm effective date: </div>
              <div className = {classes.editableInlineMappingDate}>
                <input defaultValue = {this._formatDate(this.state.dateRangeObject.dateRange[0])}></input>
                <ActionEditable edit = {this._mappingActions().edit} confirm = {this._mappingActions().confirm} cancel = {this._mappingActions().cancel} active = {this.state.mappingState === 'edit'}/>
              </div>
            </div>
            <div className = 'row section groupSummary'>
              <span>{'Available schedule for '+this.props.groups[this.state.groupId].name + ' '}</span>
              <MonthPicker updateDateRange = {this._onUpdateDateRange} defaultDateRange = {this.props.dateRangeObject.key}/>
            </div>
            <div className = 'row'>
              <Calendar schedule = {this.state.groupSchedule} group = {true} editable = {false}/>
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
        this.setState(this._getState({calendarState: 'edit'}));
      }.bind(this),
      confirm : function () {
        this.setState(this._getState({calendarState: 'confirmed'}));
      }.bind(this),
      cancel : function () {
        this.setState(this._getState({
          calendarState: 'view',
          studentSchedule: this.props.student.schedule,
          groupSchedule: this.state.groupSummary.schedule
        }));
      }.bind(this)
    };
  },

  _groupActions: function () {
    return {
      edit : function () {
        this.setState(this._getState({groupState: 'edit'}));
      }.bind(this),
      confirm : function () {
        this.setState(this._getState({groupState: 'confirmed'}));
      }.bind(this),
      cancel : function () {
        this.setState(this._getState({
          groupState: 'view',
          studentSchedule: this.props.student.schedule,
          groupSchedule: this.state.groupSummary.schedule
        }));
      }.bind(this)
    };
  },

  _mappingActions: function () {
    return {
      edit : function () {
        this.setState(this._getState({mappingState: 'edit'}));
      }.bind(this),
      confirm : function () {
        this.setState(this._getState({mappingState: 'confirmed'}));
      }.bind(this),
      cancel : function () {
        this.setState(this._getState({
          mappingState: 'view',
          studentSchedule: this.props.student.schedule,
          groupSchedule: this.state.groupSummary.schedule
        }));
      }.bind(this)
    };
  },

  _onUpdateSchedule: function (diff) {
    var groupSchedule = this.state.groupSchedule;
    var studentSchedule = this.state.studentSchedule;
    groupSchedule[diff.slot] += diff.value;
    studentSchedule[diff.slot] += diff.value;

    this.setState(this._getState({studentSchedule: studentSchedule, groupSchedule: groupSchedule}));
  },

  _formatDate: function (date) {
    var format2Digit = function (number) { return ("0" + number).slice(-2); };
    if (date) return format2Digit(date.getMonth() + 1) + '/' + format2Digit(date.getDate()) + '/' + date.getFullYear();
  },

  _onCloseEditStudent: function () {
    this.props.closeStudentDetails();
  },

  _onUpdateGroup: function (group) {
    this.setState(this._getState({
      groupId: group.id,
      calendarState: 'view',
      studentSchedule: this.props.student.schedule,
      groupSchedule: this.state.groupSummary.schedule
    }));
  },

  _onUpdateDateRange: function (dateRangeObject) {
    this.setState(this._getState({
      dateRangeObject: dateRangeObject,
      calendarState: 'view',
      studentSchedule: this.props.student.schedule,
      groupSchedule: this.state.groupSummary.schedule
    }));
  },

  _getState: function (newState) {
    var defaultState = {
      groupId : this.state && this.state.groupId || this.props.groupId,
      dateRangeObject: this.state && this.state.dateRangeObject || this.props.dateRangeObject,
      studentSchedule: assign({}, this.state && this.state.studentSchedule || this.props.student.schedule),
      calendarState: this.state && this.state.calendarState || 'view',
      groupState: this.state && this.state.groupState || 'view',
      mappingState: this.state && this.state.mappingState || 'view'
    }

    var state = assign({}, defaultState, newState);
    state.groupSummary = StudentStore.getGroupSummaryForGroupIdAndDateRange(state.groupId, state.dateRangeObject.dateRange);
    state.groupSchedule = assign({}, state.groupSummary.schedule);

    return state;
  }

});

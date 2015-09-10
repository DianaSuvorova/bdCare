var React = require('react');
var $ = require('jquery');
var ClassNames = require('classnames');
var assign = require('object-assign');
var Util = require('../util');

var Calendar = require('../calendar/calendar.react');
var CalendarHeader = require('../calendar/calendarHeader.react');
var MonthPicker = require('../monthPicker/monthPicker.react');
var DatePicker = require('../datePicker/datePicker.react');
var GroupPicker = require('../groupPicker/groupPicker.react');
var Capacity = require('../capacityCubes/capacityCubes.react');
var ActionEditable = require('../actionEditable/actionEditable.react');
var Mapping = require('../mapping/mapping.react');
var MappingHeader = require('../mapping/mappingHeader.react');
var MappingEditable = require('../mapping/mappingEditable.react');

var StudentStore = require('../../stores/studentStore');
var StudentAction = require('../../stores/studentAction');

var studentDetails = module.exports = React.createClass({

  getInitialState: function () {
    return this._getState()
  },

  render: function () {
    var groupSelect = (this.state.scheduleState === 'edit') ?
      <GroupPicker updateGroup = {this._onUpdateGroup} group = {this.props.groups[this.state.groupId]} groups = {this.props.groups}/> :
      <span className={'groupPicker'}>{this.props.groups[this.state.groupId].name}</span> ;


    var newMapping =
      (<div className = 'row section new'>
          <MappingEditable mapping = {this.state.newMapping} groups = {this.props.groups} updateSchedule = {this._onUpdateSchedule} updateGroup = {this._onUpdateGroup}/>
          <div className = 'groupMapping'>
            <span className='group'>{'Availbale spots in '+ this.props.groups[this.state.newMapping.groupId].name}</span>
            <Calendar schedule = {this.state.groupSchedule} group = {true} editable = {false}/>
            <MonthPicker updateDateRange = {this._onUpdateDateRange} dateRangeObject = {this.state.dateRangeObject}/>
            <span className = 'empty'></span>
          </div>
      </div>
    );

    return (
      <div id = 'studentDetails'>
        <div className = 'toolbox'>
        <span className = 'actionItemText' onClick = {this._onCreateNewStudent}>
          <span>Create New</span>
          <i className = 'fa fa-plus'></i>
        </span>
          <span className = 'actionItemText warning' onClick = {this._onCloseEditStudent}>
            <span>Close</span>
            <i className = 'fa fa-times'></i>
          </span>
        </div>
        <div className = 'details'>
          <div className = 'row section'>
            <div className = 'name editableInline active' >
              <input placeholder = {'name'}></input>
            </div>
            <div className = 'birthdate editableInline active' >
              <DatePicker placeholder = {'date of birth'}/>
            </div>
          </div>
            {newMapping}
        </div>
      </div>
    );
  },

  _mappingActions: function () {
    return {
      confirm : function () {
        StudentAction.addMapping(this.state.newMapping);
        this.setState(this._getState({newMapping: null}));
      }.bind(this),
      cancel : function () {
        this.setState(this._getState({newMapping: null}));
      }.bind(this)
    };
  },

  _onUpdateSchedule: function (diff) {
    var mappingSchedule = this.state.newMapping.schedule;
    mappingSchedule[diff.slot] += diff.value;
    newMapping = assign({}, this.state.newMapping, {schedule: mappingSchedule})

    this.setState(this._getState({newMapping: newMapping}));
  },

  _onCloseEditStudent: function () {
    this.props.closeStudentDetails();
  },

  _onCreateNewStudent: function () {
    var name = $(React.findDOMNode(this)).find('.name.editableInline input').val();
    var birthdate = $(React.findDOMNode(this)).find('.birthdate.editableInline input').val();
    var student = {name: name, birthdate: birthdate };

    this.props.createNewStudent(student, this.state.newMapping);
  },

  _onUpdateGroup: function (group) {
    var newMapping = assign({}, this.state.newMapping, {groupId: group.id})
    this.setState(this._getState({newMapping: newMapping}));
  },

  _onUpdateDateRange: function (dateRangeObject) {
    this.setState(this._getState({
      dateRangeObject: dateRangeObject,
      studentSchedule: this.props.student.mappings[0].schedule,
      groupSchedule: this.state.groupSummary.schedule
    }));
  },

  _getState: function (newState) {
    var defaultState = {
      groupId: this.state && this.state.groupId || this.props.groupId,
      dateRangeObject: this.state && this.state.dateRangeObject || this.props.dateRangeObject,
      studentSchedule: assign({}, this.state && this.state.studentSchedule || this.props.student.mappings[0].schedule),
      newMapping: this.state && this.state.newMapping || StudentStore.getNewMapping(this.props.student)
    };

    var state = assign({}, defaultState, newState);
    state.groupSummary = StudentStore.getGroupSummaryForGroupIdAndDateRange(state.newMapping && state.newMapping.groupId ||state.groupId, state.dateRangeObject.dateRange);
    state.groupSchedule = assign({},  state.groupSummary.schedule);

    return state;
  }

});

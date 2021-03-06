var React = require('react');
var $ = require('jquery');
var ClassNames = require('classnames');
var assign = require('object-assign');
var Util = require('../util');

var CalendarHeader = require('../calendar/calendarHeader.react');
var MonthPicker = require('../monthPicker/monthPicker.react');
var DatePicker = require('../datePicker/datePicker.react');
var GroupPicker = require('../groupPicker/groupPicker.react');
var Capacity = require('../capacity/capacity.react');
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

      var header = (<div className = 'header'>
                <div className = 'detail'>
                  <span className = 'name'>{this.props.student.name}</span>
                  <span className = 'dob'>{this.props.student.dateOfBirth}</span>
                </div>
                <div className = 'contacts'>
                  <div className = 'header'>{'CONTACTS'}</div>
                  <div className = 'contact'>
                    <span className = 'name'>{'Parent Name'}</span>
                    <span className = 'number'>{'(999) 999 9999'}</span>
                  </div>
                  <div className = 'contact'>
                    <span className = 'name'>{'Parent Name'}</span>
                    <span className = 'number'>{'(999) 999 9999'}</span>
                  </div>
                </div>
              </div>);

    var mappings = this.props.student.getMappings();
    var mappingsEl = mappings.map(function (mapping) {
        return <Mapping key = {mapping.id} mapping = {mapping} groups = {this.props.groups}/>;
    }.bind(this));

    var newMapping = this.props.student.getNewMapping();
    var newMappingEl = < MappingEditable
                        mapping = {newMapping}
                        groups = {this.props.groups}
                        onConfirmMapping = {this._onConfirmMapping}
                        highlightSchedule = {this._onHighlightSchedule}
                      />;

    var mappingEl = (
      <div className = 'activeMapping'>
        <MappingHeader/>
        {mappingsEl}
      </div>);

    var group = this.props.groups[this.state.groupId];
    var helper = (
      <div className = 'scheduleHelper'>
        <div>{'Schedule Helper'}</div>
        <div className = 'helper'>
          <div className = 'toolbar'>
            <div className = 'container'>
              <MonthPicker dateRangeObject = {this.state.dateRangeObject} updateDateRange = {this._onUpdateDateRange} />
              <GroupPicker update = {this._onUpdateGroup} kvObject = {group} kvMap = {this.props.groups}/>
            </div>
          </div>
          <div className = 'groupInfo'>
            <div className = 'container'>
              <Capacity
                schedule = {group.getAvailableSchedule(this.state.dateRangeObject.dateRange)}
                capacity = {group.capacity}
                highlightSchedule = {this.state.highlightSchedule}
              />
            </div>
          </div>
        </div>
      </div>
    )

    return (
      <div id = 'studentDetails'>
        {header}
        {mappingEl}
        {newMappingEl}
        {helper}
      </div>
    );
  },

  _onConfirmMapping: function (mapping) {
    StudentAction.addMapping(mapping);
  },

  // _onCloseEditStudent: function () {
  //   this.props.closeStudentDetails();
  // },

  _onUpdateGroup: function (group) {
    this.setState(this._getState({groupId: group.id}));
  },

  _onUpdateDateRange: function (dateRangeObject) {
    this.setState(this._getState({dateRangeObject: dateRangeObject}));
  },

  _onHighlightSchedule: function (schedule) {
    this.setState(this._getState({highlightSchedule: schedule}));
  },


  _getState: function (newState) {
  var defaultState = {
      groupId : this.state && this.state.groupId || this.props.groupId,
      dateRangeObject: this.state && this.state.dateRangeObject || this.props.dateRangeObject,
      highlightSchedule: this.state && this.state.highlightSchedule || null
    }

    var state = assign({}, defaultState, newState);
    return state;
  }

});

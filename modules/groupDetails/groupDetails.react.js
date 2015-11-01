var React = require('react');
var $ = require('jquery');
var ClassNames = require('classnames');
var assign = require('object-assign');

var StudentStore = require('../../stores/studentStore');

var StudentList = require('../studentList/studentList.react')
var MonthPicker = require('../monthPicker/monthPicker.react');
var GroupPicker = require('../groupPicker/groupPicker.react');
var Capacity = require('../capacity/capacity.react');


var groupDetails = module.exports = React.createClass({

  getInitialState: function () {
      return this._getState();
  },

  render: function () {

    return (
      <div id = 'groupDetails'>
        <div className = 'container'>
          <div className = 'summary'>
            <div className = 'header'>
              <span className = 'groupName'>{this.props.group.name}</span>
            </div>
            <Capacity
              schedule = {this.props.group.getAvailableSchedule(this.props.dateRangeObject.dateRange)}
              capacity = {this.props.group.capacity}
              highlightSchedule = {this.state.highlightSchedule}
              slotsConflict = {this._onSlotsConflict}
            />
          </div>
        </div>
        <StudentList
          group = {this.props.group}
          openStudent = {this._openStudent}
          dateRangeObject = {this.props.dateRangeObject}
          onHighlightSchedule = {this._onHighlightSchedule}
          />
      </div>
      );
  },

  _openStudent: function (studentId) {
    this.props.openStudentDetails(studentId, this.props.group.id)
  },

  _onUpdateGroup: function (group) {
    this.props.updateGroup(group.id);
  },

  _onUpdateDateRange: function (dateRangeObject) {
    this.props.updateDateRange(dateRangeObject);
  },

  _onHighlightSchedule: function (schedule, studentId) {
    this.setState(this._getState({highlightSchedule: schedule, highlightStudentId: studentId}));
  },

  _onSlotsConflict: function (slotsConflict) {
    this.setState(this._getState({slotsConflict: slotsConflict}));
  },

  _getState: function (newState) {

    var defaultState = {
      highlightStudentId: null,
      highlightSchedule: null,
      slotsConflict: null
    };

    var state = assign({}, defaultState, newState);
    return state;
  }

});

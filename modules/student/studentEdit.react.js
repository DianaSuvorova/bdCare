var React = require('react');
var $ = require('jquery-browserify');
var ClassNames = require('classnames');
var assign = require('object-assign');

var Calendar = require('../calendar/calendar.react');

var StudentStore = require('../../stores/studentStore');

var studentEdit = module.exports = React.createClass({

  getInitialState: function () {
    return (this.props.student) ? this.setState(this._getState(this.props.student.groupId)) : null;
  },

  componentWillReceiveProps: function(nextProps) {
    var groupId = (nextProps.student) ? nextProps.student.groupId : null;
    this.setState(this._getState(groupId, nextProps.dateRange));
  },

  render: function () {
    if (!this.props.student) return (<div id = 'studentEdit'> </div>); //need for transition

    var classes = {
      studentEdit : ClassNames({
        'active': this.props.student
      })
    };

    var selectGroups =
        <select onChange = {this._onSelectGroup} defaultValue = {this.state.groupId}>
            {
              Object.keys(this.props.groups).map(function(groupId) {
                return <option key = {groupId} value = {groupId}>{this.props.groups[groupId].name}</option>;
              }.bind(this))
            }
          </select>;

    return (
      <div id = 'studentEdit' className = {classes.studentEdit}>
        <div className = 'header'> {this.props.student.name}</div>
        <div className = 'details'>
          <div>
            <input className = 'name' defaultValue = {this.props.student.name}></input>
            <input className = 'birthdate' defaultValue = {this._formatDate(this.props.student.birthdate)}></input>
          </div>
          <div>
            <span>{'Current schedule in ' + this.props.groups[this.props.student.groupId].name}</span>
            <Calendar schedule = {this.props.student.schedule} edit = {false} group = {false} />
          </div>
          <div>
            <span>{'New schedule for the student'}</span>
            <Calendar schedule = {this.props.student.schedule} edit = {true}  group = {false}  updateSchedule = {this._updateSchedule}/>
          </div>
          <div>
            <span>{'Available spots in the group '}</span>
            {selectGroups}
            <Calendar schedule = {this.state.availableSchedule} edit = {false} group = {true}/>
          </div>
          <div>
            <span>{'Next availaility in this group for the new schedule is: '}</span>
            <span>{'Nov ' +  Math.floor(Math.random() * 30 + 1)} </span>
          </div>

        </div>
      </div>
    );

  },

  _onSelectGroup: function () {
    this.setState(this._getState(event.target.value));
  },

  _formatDate: function (date) {
    var format2Digit = function (number) { return ("0" + number).slice(-2); };
    if (date) return format2Digit(date.getMonth() + 1) + '/' + format2Digit(date.getDate()) + '/' + date.getFullYear();
  },

  _updateSchedule: function (schedule) {
      console.log('recalculate state for student edit');

  },

  _getState: function (groupId, dateRange) {

    var groupId = groupId || this.state && this.state.groupId;
    var dateRange = dateRange || this.props && this.props.dateRange;
    var groupSummary = (groupId) ? StudentStore.getGroupSummaryForGroupIdAndDateRange(groupId, dateRange) : {};

    return {
      groupId: groupId,
      availableSchedule: groupSummary.schedule
    }
  }

});

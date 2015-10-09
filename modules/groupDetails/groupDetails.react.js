var React = require('react');
var $ = require('jquery');
var ClassNames = require('classnames');
var assign = require('object-assign');

var StudentStore = require('../../stores/studentStore');

var StudentList = require('../studentList/studentList.react')
var MonthPicker = require('../monthPicker/monthPicker.react');
var GroupPicker = require('../groupPicker/groupPicker.react');
var Capacity = require('../capacityCubes/capacityCubes.react');


var groupDetails = module.exports = React.createClass({

  render: function () {
    var toolbar = (
      <div className = 'toolbar'>
        <MonthPicker updateDateRange = {this._onUpdateDateRange} dateRangeObject = {this.props.dateRangeObject}/>
        <GroupPicker updateGroup = {this._onUpdateGroup} group = {this.props.groups[this.props.groupId]} groups = {this.props.groups}/>
      </div>
    );

    return (
      <div id = 'groupDetails'>
        <div className = 'summary'>
          {toolbar}
          <Capacity schedule = {this.props.group.getAvailableSchedule(this.props.dateRangeObject.dateRange)} capacity = {this.props.group.capacity}  header = {false}/>
        </div>
        <StudentList students = {this.props.students} openStudent = {this._openStudent} dateRangeObject = {this.props.dateRangeObject} groupId = {this.props.groupId} />
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
  }

});

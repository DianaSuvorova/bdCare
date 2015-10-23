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
            />
          </div>
        </div>
        <StudentList
          group = {this.props.group}
          openStudent = {this._openStudent}
          dateRangeObject = {this.props.dateRangeObject}
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
  }

});

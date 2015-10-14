var React = require('react');
var $ = require('jquery');
var ClassNames = require('classnames');
var Capacity = require('../capacity/capacity.react');
var CalendarHeader = require('../calendar/calendarHeader.react');

var WaitlistStudent = require('../waitlistStudent/waitlistStudent.react');
var Actionables = require('../actionables/actionables.react');

var StudentStore = require('../../stores/studentStore');


var group = module.exports = React.createClass({

  render: function () {

    var waitlistStudentsIds = this.props.group.getWaitlistStudentIds(this.props.dateRange);
    var waitlistStudents = StudentStore.getStudents(waitlistStudentsIds);
    var waitlist =
        Object.keys(waitlistStudents).map(function (studentId) {
          return <WaitlistStudent  key = {studentId} student = {waitlistStudents[studentId]} groupId = {this.props.group.id}/>;
        }.bind(this));

    console.log(waitlistStudents);

    return (
      <div className = 'group' onClick = {this._onClick}>
        <div className = 'header'>{this.props.group.name}</div>
        <div className = 'subheader'>
          <span className= 'label'> {'TOTAL CAPACITY'} </span>
          <span className= 'value'>{this.props.group.capacity} </span>
        </div>
        <CalendarHeader/>
        <Capacity schedule = {this.props.group.getAvailableSchedule(this.props.dateRange)} capacity = {this.props.group.capacity} waitlist = {false}/>
        <div className = 'subheader waitlist'>
          <span className= 'label'> {'WAITLIST STUDENTS'} </span>
          <span className= 'value'>{waitlistStudentsIds.length} </span>
        </div>
        <div>{waitlist}</div>
      </div>
    );

  },

  _onClick: function (e) {
    this.props.onNavigateToGroup(this.props.group.id);
  }

});

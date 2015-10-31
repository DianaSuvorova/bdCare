var React = require('react');
var $ = require('jquery');
var ClassNames = require('classnames');
var Capacity = require('../capacity/capacity.react');
var CalendarHeader = require('../calendar/calendarHeader.react');

var StudentShort = require('../student/studentShort.react');
var Actionables = require('../actionables/actionables.react');

var StudentStore = require('../../stores/studentStore');


var group = module.exports = React.createClass({

  render: function () {

    var waitlistStudentsIds = this.props.group.getWaitlistStudentIds(this.props.dateRange);
    var waitlistStudents = StudentStore.getStudents(waitlistStudentsIds);
    var i = 0;
    var waitlist =
        Object.keys(waitlistStudents).map(function (studentId) {
          i++;
          var student = waitlistStudents[studentId];
          return <StudentShort
              key = {studentId}
              student = {student}
              dateRangeObject = {this.props.dateRangeObject}
              groupId = {this.props.group.id}
              index = {i}
              openStudent = {this.props.openStudent}
              waitlist = {true}
            />
        }.bind(this));

    return (
      <div className = 'group'>
        <div className = 'header'  onClick = {this._onClick}>{this.props.group.name}</div>
        <div className = 'groupInfo' onClick = {this._onClick}>
          <div className = 'subheader'>
            <span className= 'label'> {'TOTAL CAPACITY'} </span>
            <span className= 'value'>{this.props.group.capacity} </span>
          </div>
          <CalendarHeader/>
          <Capacity schedule = {this.props.group.getAvailableSchedule(this.props.dateRange)} capacity = {this.props.group.capacity} waitlist = {false}/>
        </div>
        <div>
          <div className = 'subheader waitlist'>
            <span className= 'label'> {'WAITLIST STUDENTS'} </span>
            <span className= 'value'>{waitlistStudentsIds.length} </span>
          </div>
          <div>{waitlist}</div>
        </div>
      </div>
    );

  },

  _onClick: function (e) {
    this.props.onNavigateToGroup(this.props.group.id);
  }

});

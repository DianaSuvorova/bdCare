var React = require('react');
var $ = require('jquery');
var ClassNames = require('classnames');

var Capacity = require('../capacityCubes/capacityCubes.react');
var StudentStore = require('../../stores/studentStore');

var waitlist = module.exports = React.createClass({

  render: function () {
    var students = StudentStore.getWaitlistForGroupAndDateRange();
    var studentList =
        Object.keys(students).map(function (studentId) {
          return  (
            <div key = {'waitlist_'+studentId}>
              <span>{students[studentId].name}</span>
              <Capacity schedule = {students[studentId].schedule} capacity = {1} waitlist = {true}/>
            </div>
          )
        });

    var waitlist = (Object.keys(students).length) ? (
          <div className = 'waitlist'>
            <span>{'Waitlist students that can be enrolled this month'}</span>
            <div className = 'waitlistSchedule'>{studentList}</div>
          </div>) :
          null;

    return waitlist;

  }


});

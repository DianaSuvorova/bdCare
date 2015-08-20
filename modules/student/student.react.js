var React = require('react');
var $ = require('jquery-browserify');
var ClassNames = require('classnames');


var StudentAction = require('../../stores/StudentAction');
var Calendar = require('../calendar/calendar.react');

var student = module.exports = React.createClass({

  onAddNewStudent: function (e) {
    var $studentEntry = $(e.target).closest('div.student')
    var entry = {
      name: $studentEntry.find('input.name').val(),
      birthdate: $studentEntry.find('input.birthdate').val(),
      group: $studentEntry.find('input.group').val()
    };
    StudentAction.saveStudent(entry);
  },

  render: function () {
    var studentEntry = { name: null, birthdate: null, schedule: {} };
    var student = this.props.student || studentEntry;
    return (
      <div className = 'student'>
        <input className = 'name' defaultValue = {student.name} placeholder = {'name'} ></input>
        <input className = 'birthdate' defaultValue = {student.birthdate} placeholder = {'birthdate'}></input>
        <input className = 'group' defaultValue = {student.group}></input>
        <Calendar schedule = {student.schedule} header = {false} />
        <div className='save' onClick = {this.onAddNewStudent}></div>
      </div>
    )
  }
});

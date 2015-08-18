var React = require('react');
var $ = require('jquery-browserify');
var ClassNames = require('classnames');

var Calendar = require('../calendar/calendar.react');

var student = module.exports = React.createClass({

  render: function () {
    var student = this.props.student;
    return(
      <div className = 'student'>
        <div>{student.name}</div>
        <div>{student.birthdate}</div>
        <div>{student.group}</div>
        <Calendar schedule = {student.schedule} header = {false} />
      </div>
    )
  }
});

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
        <div>{student.dateOfBirth}</div>
        <div>{(student.class) ? student.class.name : ''}</div>
        <Calendar schedule = {student.schedule} header = {false} />
      </div>
    )
  }
});

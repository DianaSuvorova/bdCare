var React = require('react');
var $ = require('jquery-browserify');
var ClassNames = require('classnames');
var assign = require('object-assign');

var StudentStore = require('../../stores/studentStore');
var StudentAction = require('../../stores/studentAction');

var Api = require('../../stores/api');

var Student = require('../student/student.react')

function getState() {
  return {
    students: StudentStore.getStudents(),
  };
}

var students = module.exports = React.createClass({

  getInitialState: function () {
    if (StudentStore.isEmpty()) {
      StudentAction.loadStudents(this.props.schoolId);
      return {students: []};
    }
    else {
      return getState();
    }
  },

  componentDidMount: function () {
    StudentStore.addChangeListener(this._onChange);
  },

  componentWillUnmount: function () {
    StudentStore.removeChangeListener(this._onChange);
  },

  render: function () {
    var students = this.state.students.map(function (student) {
      return <Student key = {student.id} student = {student} />
    }.bind(this));

    var studentEntry = <Student key = {'studentEntry'} />;
    students.unshift(studentEntry)


    var header = (
      <div className = 'header'>
        <div>Name</div>
        <div>Date of Birth</div>
        <div>Group</div>
        <div className = 'calendar'>
          <span>Mon</span>
          <span>Tue</span>
          <span>Wed</span>
          <span>Thu</span>
          <span>Fri</span>
        </div>
      </div>
    )

    var toolbar = (
      <div className = 'toolbar'>
        <span>add</span>
        <span>edit</span>
      </div>
    );

    return (
      <div id = 'students'>
        {toolbar}
        <div className ='table'>
          {header}
          {students}
        </div>
      </div>
      );
  },

  _onChange: function() {
    this.setState(getState());
  }

});

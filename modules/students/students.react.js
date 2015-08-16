var React = require('react');
var $ = require('jquery-browserify');
var ClassNames = require('classnames');

var StudentStore = require('../../stores/studentStore');
var StudentAction = require('../../stores/studentAction');
var ClassStore = require('../../stores/classStore');
var ClassAction = require('../../stores/classAction');

var Student = require('../student/student.react')

function getState() {
  return {
    students: StudentStore.getStudents(),
    classes: ClassStore.getClasses()
  };
}

function getStudents(schoolId) {
  if (!StudentStore.getStudents().length) StudentAction.loadForSchoolId(schoolId);
  else StudentAction.getForSchoolId();
}

function getClasses(schoolId) {
  if (!ClassStore.getClasses().length) ClassAction.loadForSchoolId(schoolId);
  else ClassAction.getForSchoolId();
}

function getStudents(schoolId) {
  if (!StudentStore.getStudents().length) StudentAction.loadForSchoolId(schoolId);
}

var students = module.exports = React.createClass({

  getInitialState: function () {
    return {students: [], classes: []};
  },

  componentDidMount: function () {
    StudentStore.addChangeListener(this._onChange);
    ClassStore.addChangeListener(this._onChange);
    getStudents(this.props.schoolId);
    getClasses(this.props.schoolId);
  },

  componentWillUnmount: function () {
    StudentStore.removeChangeListener(this._onChange);
    ClassStore.removeChangeListener(this._onChange);
  },

  render: function () {
    var students = this.state.students.map(function (student) {
      return <Student key = {student.id} student= {student}/>
    });

    return (
      <div id = 'students'>
          {students}
      </div>
      );
  },

  _onChange: function() {
    this.setState(getState());
  }

});

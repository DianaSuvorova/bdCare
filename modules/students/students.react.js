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
    editMode: false,
    addMode: false
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
    var classes = {
      editActionItem: ClassNames({
        'actionItem': true,
        'active': this.state.editMode
      }),
      addActionItem: ClassNames({
        'actionItem': true,
        'active': this.state.addMode
      })
    }


    var students = this.state.students.map(function (student) {
      return <Student key = {student.id} student = {student} editMode = {this.state.editMode}/>
    }.bind(this));

    var studentEntry = <Student key = {'studentEntry'} addMode = {this.state.addMode}/>;

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
        <span className = {classes.addActionItem} onClick = {this._onToggleAddMode}><i className = 'fa fa-plus'></i></span>
        <span className = {classes.editActionItem} onClick = {this._onToggleEditMode}><i className = 'fa fa-pencil'></i></span>
      </div>
    );

    return (
      <div id = 'students'>
        {toolbar}
        <div className ='table'>
          {header}
          {studentEntry}
          {students}
        </div>
      </div>
      );
  },

  _onChange: function () {
    this.setState(getState());
  },

  _onToggleAddMode: function () {
    this.setState({addMode: !this.state.addMode});
  },

  _onToggleEditMode: function () {
    this.setState({editMode: !this.state.editMode});
  }

});

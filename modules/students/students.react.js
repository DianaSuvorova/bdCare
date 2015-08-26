var React = require('react');
var $ = require('jquery-browserify');
var ClassNames = require('classnames');
var assign = require('object-assign');

var StudentList = require('./studentList.react');
var StudentEdit = require('../student/studentEdit.react');

var Api = require('../../stores/api');

var StudentStore = require('../../stores/studentStore');
var StudentAction = require('../../stores/studentAction');

var students = module.exports = React.createClass({

  getInitialState: function () {
    if (StudentStore.isEmpty()) {
      StudentAction.loadStudents(this.props.schoolId);
      return {
        groups: {},
        activeStudent: null
      };
    }
    else {
      return this._getState();
    }
  },

  componentDidMount: function () {
    StudentStore.addChangeListener(this._onChange);
  },

  componentWillUnmount: function () {
    StudentStore.removeChangeListener(this._onChange);
  },

  render: function () {
    var studentList = (Object.keys(this.state.groups).length) ? <StudentList schoolId = {this.props.schoolId} dateRange = {this.props.dateRange} editStudent = {this._editStudent} activeStudent = {this.state.activeStudent} groups = {this.state.groups}/> : null;
    return (
      <div id = 'students'>
        {studentList}
        <StudentEdit student = {this.state.activeStudent} groups = {this.state.groups} dateRange = {this.props.dateRange}/>
      </div>
    );
  },

  _onChange: function () {
    this.setState(this._getState());
  },

  _editStudent : function (student) {
    this.setState({activeStudent: student});
  },

  _getState: function () {
    return {
      groups: StudentStore.getGroupsMap(),
      activeStudent: null
    };
  }



});

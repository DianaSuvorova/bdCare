var React = require('react');
var $ = require('jquery-browserify');
var ClassNames = require('classnames');
var Link = require('react-router').Link;


var StudentStore = require('../../stores/studentStore');
var StudentAction = require('../../stores/studentAction');

var Group = require('../group/group.react');

var dashboard = module.exports = React.createClass({

  getInitialState: function () {
    if (StudentStore.isEmpty()) {
      StudentAction.loadStudents(this.props.schoolId);
      return {groups: []};
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

  componentWillReceiveProps: function(nexProps) {
    this.setState(this._getState(nexProps.dateRange));
  },

  render: function () {

    var groups = this.state.groups.map(function (group) {
      return (
        <Link to = 'studentsGroup' params={{groupId: group.id}}>
          <Group key = {group.id} groupId = {group.id} group = {group}/>
        </Link>
      )
    });

    return (
      <div id = 'dashboard'>
        <div className = 'toolbar'></div>
        <div className = 'groups'>{groups}</div>
      </div>
      );
  },

  _onChange: function () {
    this.setState(this._getState());
  },

  _getState: function (dateRange) {
    var dateRange = dateRange || this.props.dateRange;
    return {
      groups: StudentStore.getDashboardSummaryForDateRange(dateRange)
    };
  }


});

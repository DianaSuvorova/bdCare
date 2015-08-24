var React = require('react');
var $ = require('jquery-browserify');
var ClassNames = require('classnames');

var StudentStore = require('../../stores/studentStore');
var StudentAction = require('../../stores/studentAction');

var Group = require('../group/group.react');
var MonthPicker = require('../monthPicker/monthPicker.react');

function getState (dateRange) {
  return {groups: StudentStore.getDashboardSummaryForDateRange(dateRange)};
}

var dashboard = module.exports = React.createClass({

  getInitialState: function () {
    if (StudentStore.isEmpty()) {
      StudentAction.loadStudents(this.props.schoolId);
      return {groups: []};
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

    var groups = this.state.groups.map(function (group) {
      return <Group key = {group.id} group = {group}/>
    });

    return (
      <div id = 'dashboard'>
        <div className = 'toolbar'>
          <MonthPicker/>
        </div>
        <div className = 'groups'>{groups}</div>
      </div>
      );
  },

  _onChange: function () {
    this.setState(getState());
  }
});

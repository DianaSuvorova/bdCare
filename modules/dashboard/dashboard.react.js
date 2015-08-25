var React = require('react');
var $ = require('jquery-browserify');
var ClassNames = require('classnames');

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
    this.setState(this._getState(nexProps));
  },

  render: function () {

    var groups = this.state.groups.map(function (group) {
      return <Group key = {group.id} groupId = {group.id} group = {group}/>
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

  _getState: function (props) {
    var dateRange = (props) ? props.dateRange: this.props.dateRange;
    return { groups: StudentStore.getDashboardSummaryForDateRange(dateRange)};
  }


});

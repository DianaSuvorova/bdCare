var React = require('react');
var $ = require('jquery-browserify');
var ClassNames = require('classnames');
var Link = require('react-router').Link;
var MonthPicker = require('../monthPicker/monthPicker.react');

var StudentStore = require('../../stores/studentStore');
var StudentAction = require('../../stores/studentAction');

var DateRangeStore = require('../../stores/dateRangeStore');

var Group = require('../group/group.react');

var dashboard = module.exports = React.createClass({

  getInitialState: function () {
    if (StudentStore.isEmpty()) {
      StudentAction.loadStudents(this.props.schoolId);
      return { groups: [], dateRangeObject: null};
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

    var groups = this.state.groups.map(function (group) {
      return (
        <Link to = 'studentsGroup' key = {group.id} params={{groupId: group.id, dateRange: this.state.dateRangeObject.key}}>
          <Group group = {group}/>
        </Link>
      )
    }.bind(this));

    return (
      <div id = 'dashboard'>
        <div className = 'toolbar'>
          <MonthPicker updateDateRange = {this._onUpdateDateRange} />
        </div>
        <div className = 'groups'>{groups}</div>
      </div>
      );
  },

  _onChange: function () {
    this.setState(this._getState());
  },

  _onUpdateDateRange: function (dateRangeObject) {
    this.setState(this._getState(dateRangeObject));
  },

  _getState: function (dateRangeObject) {
    var dateRangeObject = dateRangeObject || this.state.dateRangeObject || DateRangeStore.getCurrentDateRangeObject();
    return {
      dateRangeObject: dateRangeObject,
      groups: StudentStore.getDashboardSummaryForDateRange(dateRangeObject.dateRange)
    };
  }


});

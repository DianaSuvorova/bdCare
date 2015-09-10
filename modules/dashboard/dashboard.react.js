var React = require('react');
var $ = require('jquery');
var ClassNames = require('classnames');
var MonthPicker = require('../monthPicker/monthPicker.react');

var StudentStore = require('../../stores/studentStore');
var StudentAction = require('../../stores/studentAction');

var DateRangeStore = require('../../stores/dateRangeStore');

var Group = require('../group/group.react');

var dashboard = module.exports = React.createClass({

  getInitialState: function () {
    if (StudentStore.isEmpty()) {
      StudentAction.loadStudents(this.props.schoolId);
      return { groups: [], dateRangeObject: DateRangeStore.getCurrentDateRangeObject()};
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
      return <Group key = {group.id} group = {group} onNavigateToGroup = {this._navigateToGroup}/>
    }.bind(this));

    return (
      <div id = 'dashboard'>
        <div className = 'toolbar'>
          <MonthPicker dateRangeObject = {this.state.dateRangeObject} updateDateRange = {this._onUpdateDateRange} />
        </div>
        <div className = 'groups'>{groups}</div>
      </div>
      );
  },

  _onChange: function () {
    this.setState(this._getState());
  },

  _navigateToGroup: function (groupId) {
    this.props.navigateTo('Students', this.state.dateRangeObject, groupId)
  },

  _onUpdateDateRange: function (dateRangeObject) {
    this.setState(this._getState(dateRangeObject));
  },

  _getState: function (dateRangeObject) {
    var dateRangeObject = dateRangeObject || this.state && this.state.dateRangeObject;
    return {
      dateRangeObject: dateRangeObject,
      groups: StudentStore.getDashboardSummaryForDateRange(dateRangeObject.dateRange)
    };
  }


});

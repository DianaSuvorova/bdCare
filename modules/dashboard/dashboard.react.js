var React = require('react');
var $ = require('jquery-browserify');
var ClassNames = require('classnames');

var StudentStore = require('../../stores/studentStore');
var StudentAction = require('../../stores/studentAction');

var Group = require('../group/group.react');


function getDateRangeOptions(currentDate) {
  return ['September 2015', 'October 2015', 'November 2015', 'December 2015'];
}

function getState(dateRange) {
  return {groups: StudentStore.getAvailableSchedule(dateRange)};
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
    var selectRange = (
      <select onChange={this._onSelectDateRange}>
        {
          getDateRangeOptions(null).map(function(dateRange){
          return <option key = {dateRange} value = {dateRange}>{dateRange}</option>;
          })
        }
      </select>
    )

    var groups = this.state.groups.map(function (group) {
      return <Group key = {group.id} group = {group}/>
    });

    return (
      <div id = 'dashboard'>
        <div className = 'toolbar'>{selectRange}</div>
        <div className = 'groups'>{groups}</div>
      </div>
      );
  },

  _onChange: function() {
    this.setState(getState());
  },

  _onSelectDateRange: function (event) {
    console.log(event.target.value);
    this.setState(getState());
  }
});

var React = require('react');
var $ = require('jquery-browserify');
var ClassNames = require('classnames');
var DateRangeStore = require('../../stores/dateRangeStore');

var monthPicker = module.exports = React.createClass({

  _dateRangeMap: DateRangeStore.getDateRangeMap(),

  render: function () {
    return (
      <span className = {'monthPicker'}>
        <select onChange={this._onSelectDateRange} defaultValue = {this.props.defaultDateRange}>
          {
            Object.keys(this._dateRangeMap).map(function(dateRange){
              return <option key = {dateRange} value = {dateRange}>{dateRange}</option>;
            }.bind(this))
          }
        </select>
      </span>
    )
  },

  _onSelectDateRange: function (event) {
    this.props.updateDateRange(this._dateRangeMap[event.target.value]);
  }

});

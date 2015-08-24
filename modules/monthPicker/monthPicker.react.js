var React = require('react');
var $ = require('jquery-browserify');
var ClassNames = require('classnames');

function getDateRangeOptions() {
  var date = new Date(), y = date.getFullYear(), m = date.getMonth();
  listOfMonthBasedDates = []
  for (newMonth = m; newMonth < m + 3; newMonth++) {
    listOfMonthBasedDates.push(new Date(y, newMonth, 1))
  }

  var locale = "en-us";
  return listOfMonthBasedDates.map(function(date){
    var month = date.toLocaleString(locale, { month: "long" });
    return month + ' ' + date.getFullYear();
  });
}

var monthPicker = module.exports = React.createClass({

  render: function () {
    return (
      <select onChange={this._onSelectDateRange}>
        {
          getDateRangeOptions().map(function(dateRange){
          return <option key = {dateRange} value = {dateRange}>{dateRange}</option>;
          })
        }
      </select>
    )
  },

  _onSelectDateRange: function (event) {
    var date = new Date(event.target.value), y = date.getFullYear(), m = date.getMonth();
    var dateRange = [new Date(y, m, 1), new Date(y, m + 1, 0)];
    console.log(dateRange)
    this.props.updateForDateRange(dateRange);
  }

});

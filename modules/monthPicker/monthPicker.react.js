var React = require('react');
var $ = require('jquery-browserify');
var ClassNames = require('classnames');

function getDateRangeOptions (currentDate) {
  return ['September 2015', 'October 2015', 'November 2015', 'December 2015'];
}

var monthPicker = module.exports = React.createClass({

  render: function () {
    return (
      <select onChange={this._onSelectDateRange}>
        {
          getDateRangeOptions(null).map(function(dateRange){
          return <option key = {dateRange} value = {dateRange}>{dateRange}</option>;
          })
        }
      </select>
    )
  },

  _onSelectDateRange: function (event) {
    console.log(event.target.value);
  }

});

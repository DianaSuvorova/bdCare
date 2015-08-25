var React = require('react');
var $ = require('jquery-browserify');
var ClassNames = require('classnames');

var monthPicker = module.exports = React.createClass({

  render: function () {
    return (
      <select onChange={this._onSelectDateRange} defaultValue = {this.props.dateRangeKey}>
        {
          this.props.dateRangeList.map(function(dateRange){
            return <option key = {dateRange} value = {dateRange}>{dateRange}</option>;
          }.bind(this))
        }
      </select>
    )
  },

  _onSelectDateRange: function (event) {
    this.props.updateDateRange(event.target.value);
  }

});

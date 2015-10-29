var React = require('react');
var $ = require('jquery');
var assign = require('object-assign');
var ClassNames = require('classnames');
var DateRangeStore = require('../../stores/dateRangeStore');
var GroupPicker = require('../groupPicker/groupPicker.react')

var monthPicker = module.exports = React.createClass({

  render: function () {
    return <GroupPicker kvObject = {this.props.dateRangeObject} kvMap = {DateRangeStore.getDateRangeMap()} update = {this.props.updateDateRange}/>
  }
});

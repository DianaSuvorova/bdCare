var React = require('react');
var $ = require('jquery');
var assign = require('object-assign');
var ClassNames = require('classnames');
var DateRangeStore = require('../../stores/dateRangeStore');

var monthPicker = module.exports = React.createClass({

  _dateRangeMap: DateRangeStore.getDateRangeMap(),
  _dateRangeKeys: DateRangeStore.getDateRangeKeys(),


  render: function () {
    this.idx = this.props.dateRangeObject && this._dateRangeKeys.indexOf(this.props.dateRangeObject.key);

    var classes = {
      prev: ClassNames({
        'prev' : true,
        'active' : this.idx > 0
      }),
      next:  ClassNames({
        'next' : true,
        'active' : this.idx < this._dateRangeKeys.length - 1
      })
    };

    return (
      <span className = {'picker'}>
        <span className = {classes.prev} onClick = {this._onClickPrev}><i className ='fa fa-caret-left'></i></span>
        <span className = 'month'>{this.props.dateRangeObject.key}</span>
        <span className = {classes.next} onClick = {this._onClickNext}><i className ='fa fa-caret-right'></i></span>
      </span>
    )
  },

  _onClickPrev: function () {
    this.props.updateDateRange(this._dateRangeMap[this._dateRangeKeys[this.idx - 1]]);
  },

  _onClickNext: function () {
    this.props.updateDateRange(this._dateRangeMap[this._dateRangeKeys[this.idx + 1]]);
  }

});

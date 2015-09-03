var React = require('react');
var $ = require('jquery');
var ClassNames = require('classnames');
var DateRangeStore = require('../../stores/dateRangeStore');
var Util = require('../util');

require('jquery-ui/datepicker');

var datePicker = module.exports = React.createClass({

  _dateRangeMap: DateRangeStore.getDateRangeMap(),

  componentDidMount: function () {
    var el = React.findDOMNode(this);
    var $datepicker = $(el).find('input.datepicker');
    $datepicker.datepicker({
      prevText: '',
      nextText: ''
    });

  },

  render: function () {
    return (
      <div>
        <input className = 'datepicker input-small' data-date-format='mm/dd/yyyy' defaultValue = {Util.formatDate(this.props.defaultDate)} />
      </div>
    )
  }

});

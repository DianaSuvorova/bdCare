var React = require('react');
var $ = require('jquery-browserify');
var ClassNames = require('classnames');

var calendar = module.exports = React.createClass({

  render: function () {
    return (
      <div className = 'calendarHeader'>
        <span>Mon</span>
        <span>Tue</span>
        <span>Wed</span>
        <span>Thu</span>
        <span>Fri</span>
      </div>
    )
  }

});

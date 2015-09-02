var React = require('react');
var $ = require('jquery');
var ClassNames = require('classnames');
var CalendarHeader = require('../calendar/calendarHeader.react');


var mappingHeader = module.exports = React.createClass({

  render: function () {
    return (
      <div className = 'mapping header'>
        <span>{'Group'}</span>
        <CalendarHeader/>
        <span>{'Start Date'}</span>
        <span>{'Status'}</span>
      </div>
    )
  }

});

var React = require('react');
var $ = require('jquery-browserify');
var ClassNames = require('classnames');
var CalendarHeader = require('../calendar/calendarHeader.react');


var mappingHeader = module.exports = React.createClass({

  render: function () {
    return (
      <div className = 'mapping mappingHeader'>
        <span>{'Group'}</span>
        <CalendarHeader/>
        <span>{'Start Date'}</span>
        <span>{'Status'}</span>
      </div>
    )
  }

});

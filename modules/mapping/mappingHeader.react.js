var React = require('react');
var $ = require('jquery');
var ClassNames = require('classnames');
var CalendarHeader = require('../calendar/calendarHeader.react');


var mappingHeader = module.exports = React.createClass({

  render: function () {
    return (
      <div className = 'mapping header'>
        <span>{'GROUP'}</span>
        <span>{'START DATE'}</span>
        <CalendarHeader/>
        <span className = 'empty'></span>
      </div>
    )
  }

});

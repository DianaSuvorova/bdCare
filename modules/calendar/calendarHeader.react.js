var React = require('react');
var $ = require('jquery');
var ClassNames = require('classnames');

var calendar = module.exports = React.createClass({

  render: function () {
    return (
      <div className = 'calendarHeader'>
        <span>MONDAY</span>
        <span>TUESDAY</span>
        <span>WEDNESDAY</span>
        <span>THURSDAY</span>
        <span>FRIDAY</span>
      </div>
    )
  }

});

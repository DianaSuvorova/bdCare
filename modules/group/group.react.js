var React = require('react');
var $ = require('jquery-browserify');
var ClassNames = require('classnames');
var Calendar = require('../calendar/calendar.react');

var group = module.exports = React.createClass({

  render: function () {
    return (
      <div className = 'group'>
        <span>{this.props.group.name}</span>
        <Calendar schedule = {this.props.group.schedule} labels = {true}/>
      </div>
    );
  }

});

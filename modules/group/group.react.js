var React = require('react');
var $ = require('jquery-browserify');
var ClassNames = require('classnames');
var Capacity = require('../capacityCubes/capacityCubes.react');
var CalendarHeader = require('../calendar/calendarHeader.react');

var group = module.exports = React.createClass({

  render: function () {

    return (
      <div className = 'group' onClick = {this._onClick}>
        <div>{this.props.group.name}</div>
        <div>
          <span className= 'label'>total capcity: </span>
          <span className= 'value'>{this.props.group.capacity} </span>
        </div>
        <CalendarHeader/>
        <Capacity schedule = {this.props.group.schedule} capacity = {this.props.group.capacity}/>
      </div>
    );

  },

  _onClick: function (e) {
    this.props.onNavigateToGroup(this.props.group.id);
  }

});

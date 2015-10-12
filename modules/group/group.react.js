var React = require('react');
var $ = require('jquery');
var ClassNames = require('classnames');
var Capacity = require('../capacity/capacity.react');
var CalendarHeader = require('../calendar/calendarHeader.react');

var Waitlist = require('../waitlist/waitlist.react');
var Actionables = require('../actionables/actionables.react');

var group = module.exports = React.createClass({

  render: function () {

    return (
      <div className = 'group' onClick = {this._onClick}>
        <div className = 'header'>{this.props.group.name}</div>
        <div className = 'subheader'>
          <span className= 'label'> {'TOTAL CAPACITY'} </span>
          <span className= 'value'>{this.props.group.capacity} </span>
        </div>
        <CalendarHeader/>
        <Capacity schedule = {this.props.group.getAvailableSchedule(this.props.dateRange)} capacity = {this.props.group.capacity} waitlist = {false}/>
        <Waitlist/>
        <Actionables/>
      </div>
    );

  },

  _onClick: function (e) {
    this.props.onNavigateToGroup(this.props.group.id);
  }

});

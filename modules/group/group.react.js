var React = require('react');
var $ = require('jquery-browserify');
var ClassNames = require('classnames');
var Capacity = require('../capacity/capacity.react');
var Calendar = require('../calendar/calendar.react');

var group = module.exports = React.createClass({

  render: function () {

    return (
      <div className = 'group'>
        <div>{this.props.group.name}</div>
        <div>
          <span className= 'label'>total capcity: </span>
          <span className= 'value'>{this.props.group.capacity} </span>
        </div>
        <Capacity schedule = {this.props.group.schedule} capacity = {this.props.group.capacity} />
      </div>
    );
  }

});

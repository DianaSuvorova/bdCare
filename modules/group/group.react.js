var React = require('react');
var $ = require('jquery-browserify');
var ClassNames = require('classnames');
var Capacity = require('../capacity/capacity.react');
var Link = require('react-router').Link;

var group = module.exports = React.createClass({

  render: function () {
    return (
      <Link className = 'group' to = 'studentsGroup' params={{groupId: this.props.groupId}}>
        <div>{this.props.group.name}</div>
        <div>
          <span className= 'label'>total capcity: </span>
          <span className= 'value'>{this.props.group.capacity} </span>
        </div>
        <Capacity schedule = {this.props.group.schedule} capacity = {this.props.group.capacity} />
      </Link>
    );
  }

});

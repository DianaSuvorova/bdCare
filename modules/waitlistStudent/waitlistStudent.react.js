var React = require('react');
var $ = require('jquery');
var ClassNames = require('classnames');

var Capacity = require('../capacity/capacity.react');var StudentStore = require('../../stores/studentStore');

var waitlistStudent = module.exports = React.createClass({

  render: function () {
    return  (
      <div className = 'waitlistStudent'>
        <div>{this.props.student.name}</div>
        <Capacity schedule = {this.props.student.getMapping({groupId: this.props.groupId}).schedule} capacity = {1} single = {true} waitlist={true}/>
      </div>
    )


  }
});

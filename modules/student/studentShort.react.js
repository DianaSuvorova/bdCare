var React = require('react');
var $ = require('jquery');
var ClassNames = require('classnames');

var Calendar = require('../calendar/calendar.react');
var Capacity = require('../capacity/capacity.react');
var StudentStore = require('../../stores/studentStore');
var Router = require('./../router/router');

var student = module.exports = React.createClass({

  render: function () {
    var classes = {
      student : ClassNames({
        'student short': true,
        'waitlist': this.props.waitlist
      })
    }
    var mapping = this.props.student.getMapping({groupId: this.props.groupId})

    return (
      <div className = {classes.student} onClick = {this._onClickStudent}>
        <span>{this.props.student.name}</span>
        <Capacity
          schedule = {mapping.schedule}
            capacity = {1}
            single = {true}
            waitlist= {mapping.waitlist}
          />
      </div>
    )
  },

  _onClickStudent: function () {
    Router.navigate('/student/'+ this.props.student.id);
  },


});

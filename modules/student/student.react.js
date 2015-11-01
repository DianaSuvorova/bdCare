var React = require('react');
var $ = require('jquery');
var ClassNames = require('classnames');
var assign = require('object-assign');

var Calendar = require('../calendar/calendar.react');
var Capacity = require('../capacity/capacity.react');
var StudentStore = require('../../stores/studentStore');
var Router = require('./../router/router');

var student = module.exports = React.createClass({

  getInitialState: function () {
      return this._getState();
  },

  render: function () {
    this.mapping = this.props.student.getMapping({groupId: this.props.group.id});
    var conflictSlots = this.props.group.getConflictSlots(this.props.dateRangeObject.dateRange, this.mapping.schedule);
    var classes = {
      student : ClassNames({
        'student': true,
        'waitlist': this.props.waitlist
      })
    }
    return (
      <div className = {classes.student} onClick = {this._onClickStudent} onMouseEnter = {this._onMouseEnter} onMouseLeave = {this._onMouseLeave}>
        <span className = {'index'} >{this.props.index}</span>
        <span>{this.props.student.name}</span>
        <span>{this._formatDate(this.props.student.birthdate)}</span>
        <Capacity
          id = {this.props.student.id}
          schedule = {this.mapping.schedule}
            capacity = {1}
            single = {true}
            waitlist = {this.props.waitlist}
            conflictSlots = {this.state.conflictSlots ? conflictSlots : null}
          />
      </div>
    )
  },

  _onClickStudent: function () {
    Router.navigate('/student/'+ this.props.student.id);
  },

  _onMouseEnter: function () {
    this.setState(this._getState({conflictSlots: true}));
    this.props.onHighlightSchedule && this.props.onHighlightSchedule(this.mapping.schedule);
  },

  _onMouseLeave: function () {
    this.setState(this._getState({conflictSlots: false}));
    this.props.onHighlightSchedule && this.props.onHighlightSchedule(null, null);
  },

  _formatDate: function (date) {
    var format2Digit = function (number) { return ("0" + number).slice(-2); };
    if (date) return format2Digit(date.getMonth() + 1) + '/' + format2Digit(date.getDate()) + '/' + date.getFullYear();
  },

  _getState: function (newState) {

    var defaultState = {
      conflictSlots: false
    };

    var state = assign({}, defaultState, newState);
    return state;
  }

});

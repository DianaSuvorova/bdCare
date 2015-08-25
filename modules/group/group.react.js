var React = require('react');
var $ = require('jquery-browserify');
var ClassNames = require('classnames');
var Capacity = require('../capacity/capacity.react');
var Calendar = require('../calendar/calendar.react');

var group = module.exports = React.createClass({

  getInitialState: function () {
    return {transferStudent: null};
  },

  render: function () {

    var transfer = (this.state.transferStudent) ? (
      <div className = 'transfer'>
        <div>
          <span>effective date</span>
          <input className = 'effective-date' defaultValue = {this._formatDate(new Date())}></input>
        </div>
        <Calendar schedule = {this.state.transferStudent && this.state.transferStudent.schedule} entry = {true} />
      </div>
    ) : null;

    return (
      <div className = 'group' onDragEnter = {this._onDragEnter} onDragLeave = {this._onDragLeave} onDragOver = {this._onDragOver} onDrop = {this._onDrop}>
        <div>{this.props.group.name}</div>
        <div>
          <span className= 'label'>total capcity: </span>
          <span className= 'value'>{this.props.group.capacity} </span>
        </div>
        <Capacity schedule = {this.props.group.schedule} capacity = {this.props.group.capacity} />
        {transfer}
      </div>
    );
  },

  _onDragLeave: function (e) {
    $(this._el).removeClass('validTarget').removeClass('invalidTarget');
  },

  _onDragOver: function (e) {
    e.preventDefault();

    this._el = this._el || React.findDOMNode(this);

    var student = JSON.parse(e.dataTransfer.getData("text/plain"));
    $(this._el).addClass((student.group === this.props.group.name) ? 'invalidTarget' : 'validTarget' );

  },

  _onDrop: function (e) {
    var student = JSON.parse(e.dataTransfer.getData("text/plain"));
    $(this._el).removeClass('validTarget').removeClass('invalidTarget');
    this.setState({transferStudent : student});
  },

  _formatDate: function (date) {
    var format2Digit = function (number) { return ("0" + number).slice(-2); };
    if (date) return format2Digit(date.getMonth() + 1) + '/' + format2Digit(date.getDate()) + '/' + date.getFullYear();
  }

});

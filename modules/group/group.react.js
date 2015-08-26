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
      <div className = 'group'>
        <div>{this.props.group.name}</div>
        <div>
          <span className= 'label'>total capcity: </span>
          <span className= 'value'>{this.props.group.capacity} </span>
        </div>
        <Capacity schedule = {this.props.group.schedule} capacity = {this.props.group.capacity} />
        {transfer}
      </div>
    );
  }

});

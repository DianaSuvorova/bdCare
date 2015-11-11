var React = require('react');
var $ = require('jquery');
var ClassNames = require('classnames');
var assign = require('object-assign');

var Capacity = require('../capacity/capacity.react');
var CalendarHeader = require('../calendar/calendarHeader.react');
var GroupPicker = require('../groupPicker/groupPicker.react');
var ActionEditable = require('../actionEditable/actionEditable.react');
var DatePicker = require('../datePicker/datePicker.react');

var mappingEditable = module.exports = React.createClass({

  getInitialState: function () {
    return this._getState()
  },

  render: function () {
    var groupSelector = <span className = {'groupSelector'}>
        <select onChange={this._onSelectGroup} defaultValue = {this.props.mapping.groupId}>
          {
            Object.keys(this.props.groups).map(function(groupId){
              return <option key = {groupId} value = {groupId}>{this.props.groups[groupId].name}</option>;
            }.bind(this))
          }
        </select>
      </span>

    return (
      <div className = 'mappingContainer'>
        <span>{'Transfer Details'}</span>
        <div className = 'mapping editable header'>
          <span>{'SELECT GROUP'}</span>
          <span>{'CHOOSE START DATE'}</span>
          <CalendarHeader/>
          <span className = 'empty'></span>
        </div>
        <div className = 'mapping editable'>
          {groupSelector}
          <DatePicker defaultDate = {this.props.mapping.startDate}/>
          <Capacity
              schedule = {this.state.schedule}
              capacity = {1}
              single = {true}
              waitlist={this.props.mapping.waitlist}
              updateSchedule = {this._onUpdateSchedule}
            />
            <span className = 'container'>
              <span className = 'button' onClick = {this._onConfirm}>{'CONFIRM'}</span>
            </span>
        </div>
      </div>
    );

  },

  _onSelectGroup: function (e) {
    this.setState(this._getState({groupId: $(e.target).val()}))
  },

  _onUpdateSchedule: function (diff) {
    var schedule = this.props.mapping.schedule;
    schedule[diff.slot] += diff.value;
//    this.props.highlightSchedule(schedule);
    this.setState(this._getState({schedule: schedule}));
  },

  _onConfirm: function (e) {
    var date = $(React.findDOMNode(this)).find('input.datepicker').val();
    var mapping = assign(
        {},
        this.props.mapping,
        {groupId: this.state.groupId},
        {start_date: date},
        {waitlist: false},
        this.state.schedule
      );
    this.props.onConfirmMapping(mapping);
  },

  _getState: function (newState) {
    var defaultState = {
      groupId: this.props.mapping.groupId,
      schedule: this.props.mapping.schedule
    };
    var state = assign({}, defaultState, newState);
    return state;
  }

})

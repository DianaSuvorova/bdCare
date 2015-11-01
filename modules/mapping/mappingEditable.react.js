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

  // var actionEditable = (this.props.mappingActions) ?
  //     <ActionEditable confirm = {this.props.mappingActions().confirm} cancel = {this.props.mappingActions().cancel} active = {true}/> :
  //     null;
  //
  // return (
  //   <div className = 'mapping editable editableInline active'>
  //     <Calendar schedule = {this.props.mapping.schedule} editable = {true} updateSchedule = {this.props.updateSchedule}/>
  //     <DatePicker defaultDate = {this.props.mapping.startDate} />
  //     {actionEditable}
  //     <span className = 'empty'></span>
  //   </div>
  // );

  render: function () {
    var groupSelector = <span className = {'groupSelector'}>
        <select onChange={this._onSelectGroup} defaultValue = {this.props.groupId}>
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
        <div className = 'mapping'>
          {groupSelector}
          <DatePicker defaultDate = {this.props.mapping.startDate} />
          <Capacity
            schedule = {this.props.mapping.schedule}
              capacity = {1}
              single = {true}
              waitlist={this.props.mapping.waitlist}
            />
          <span>{'confirm'}</span>
        </div>

      </div>
    );

  }

})

var React = require('react');
var $ = require('jquery');
var ClassNames = require('classnames');
var assign = require('object-assign');

var Calendar = require('../calendar/calendar.react');
var GroupPicker = require('../groupPicker/groupPicker.react');
var ActionEditable = require('../actionEditable/actionEditable.react');
var DatePicker = require('../datePicker/datePicker.react');

var mappingEditable = module.exports = React.createClass({

  render: function () {
    var actionEditable = (this.props.mappingActions) ?
        <ActionEditable confirm = {this.props.mappingActions().confirm} cancel = {this.props.mappingActions().cancel} active = {true}/> :
        null;

    return (
      <div className = 'mapping editable editableInline active'>
        <GroupPicker updateGroup = {this.props.updateGroup} group = {this.props.groups[this.props.mapping.groupId]} groups = {this.props.groups}/>
        <Calendar schedule = {this.props.mapping.schedule} editable = {true} updateSchedule = {this.props.updateSchedule}/>
        <DatePicker defaultDate = {this.props.mapping.startDate} />
        {actionEditable}
        <span className = 'empty'></span>
      </div>
    );
  }

})

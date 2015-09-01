var React = require('react');
var $ = require('jquery-browserify');
var ClassNames = require('classnames');
var assign = require('object-assign');
var Util = require('../util');

var Calendar = require('../calendar/calendar.react');
var GroupPicker = require('../groupPicker/groupPicker.react');
var ActionEditable = require('../actionEditable/actionEditable.react');


var mappingEditable = module.exports = React.createClass({

  render: function () {
    return (
      <div className = 'mapping editable editableInline active'>
        <GroupPicker updateGroup = {this.props.updateGroup} group = {this.props.groups[this.props.mapping.groupId]} groups = {this.props.groups}/>
        <Calendar schedule = {this.props.mapping.schedule} editable = {true} updateSchedule = {this.props.updateSchedule}/>
        <input defaultValue={Util.formatDate(this.props.mapping.startDate)}></input>
        <ActionEditable confirm = {this.props.mappingActions().confirm} cancel = {this.props.mappingActions().cancel} active = {true}/>
        <span className = 'empty'></span>
      </div>
    );
  }

})

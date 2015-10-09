var React = require('react');
var $ = require('jquery');
var ClassNames = require('classnames');
var assign = require('object-assign');
var Util = require('../util');

var Calendar = require('../calendar/calendar.react');
var CalendarHeader = require('../calendar/calendarHeader.react');
var MonthPicker = require('../monthPicker/monthPicker.react');
var DatePicker = require('../datePicker/datePicker.react');
var GroupPicker = require('../groupPicker/groupPicker.react');
var Capacity = require('../capacityCubes/capacityCubes.react');
var ActionEditable = require('../actionEditable/actionEditable.react');
var Mapping = require('../mapping/mapping.react');
var MappingHeader = require('../mapping/mappingHeader.react');
var MappingEditable = require('../mapping/mappingEditable.react');

var StudentStore = require('../../stores/studentStore');
var StudentAction = require('../../stores/studentAction');

var studentDetails = module.exports = React.createClass({

  getInitialState: function () {
    return this._getState()
  },

  render: function () {
    var classes = {
      addNewMappingButton: ClassNames({
        'actionItemText addNewMapping' : true,
        'active': this.state.newMapping
      }),
      nameEditableInline: ClassNames({
        'name editableInline' : true,
        'active': this.state.nameState === 'edit'
      }),
      birthdateEditableInline: ClassNames({
        'birthdate editableInline': true,
        'active': this.state.birthdateState === 'edit'
      })
    }

    var groupSelect = (this.state.scheduleState === 'edit') ?
      <GroupPicker updateGroup = {this._onUpdateGroup} group = {this.props.groups[this.state.groupId]} groups = {this.props.groups}/> :
      <span className={'groupPicker'}>{this.props.groups[this.state.groupId].name}</span> ;

    var i = 0;
    var mappings = this.props.student.mappings.map(function (mapping) {
        return <Mapping key = {'mapping_'+(i++)} mapping = {mapping} groups = {this.props.groups}/>;
    }.bind(this));

    var newMapping = (this.state.newMapping) ?
      (<div className = 'row section new'>
          <MappingEditable mappingActions = {this._mappingActions} mapping = {this.state.newMapping} groups = {this.props.groups} updateSchedule = {this._onUpdateSchedule} updateGroup = {this._onUpdateGroup}/>
          <div className = 'groupMapping'>
            <span className='group'>{'Availbale spots in '+ this.props.groups[this.state.newMapping.groupId].name}</span>
            <Calendar schedule = {this.props.groups[this.state.groupId].getAvailableSchedule(this.state.dateRangeObject.dateRange)} group = {true} editable = {false}/>
            <MonthPicker updateDateRange = {this._onUpdateDateRange} dateRangeObject = {this.state.dateRangeObject}/>
            <span className = 'empty'></span>
          </div>
      </div>
      ) :
      null;

    return (
      <div id = 'studentDetails'>
        <div className = 'toolbox'>
          <span className = 'actionItemText warning' onClick = {this._onCloseEditStudent}>
            <span>Close</span>
            <i className = 'fa fa-times'></i>
          </span>
        </div>
        <div className = 'details'>
          <div className = 'row section'>
            <div className = {classes.nameEditableInline} >
              <input defaultValue = {this.props.student.name}></input>
              <ActionEditable edit = {this._nameActions().edit} confirm = {this._nameActions().confirm} cancel = {this._nameActions().cancel} active = {this.state.nameState === 'edit'}/>
            </div>
            <div className = {classes.birthdateEditableInline}>
              <DatePicker defaultDate = {this.props.student.birthdate}/>
              <ActionEditable edit = {this._birthdateActions().edit} confirm = {this._birthdateActions().confirm} cancel = {this._birthdateActions().cancel} active = {this.state.birthdateState === 'edit'}/>
            </div>
          </div>
          <div className = 'row section'>
            <MappingHeader/>
            {mappings}
          </div>
          <div className = 'row addNewMapping'>
            <div className = 'container'>
              <span className = 'buttonContainer'>
                <span className = {classes.addNewMappingButton} onClick = {this._onToggleAddNewMapping}>
                  <span>Transfer</span>
                  <i className = 'fa fa-subway'></i>
                </span>
              </span>
            </div>
          </div>
            {newMapping}
        </div>
      </div>
    );
  },

  _mappingActions: function () {
    return {
      confirm : function () {
        StudentAction.addMapping(this.state.newMapping);
        this.setState(this._getState({newMapping: null}));
      }.bind(this),
      cancel : function () {
        this.setState(this._getState({newMapping: null}));
      }.bind(this)
    };
  },

  _nameActions: function () {
    return {
      edit : function () {
        this.setState(this._getState({nameState: 'edit'}));
      }.bind(this),
      confirm : function () {
        var name = $(React.findDOMNode(this)).find('.name.editableInline input').val();
        StudentAction.updateName(this.props.student.id, name);
        this.setState(this._getState({nameState: 'confirmed'}));
      }.bind(this),
      cancel : function () {
        this.setState(this._getState({nameState: 'canceled'}));
      }.bind(this)
    };
  },

  _birthdateActions: function () {
    return {
      edit : function () {
        this.setState(this._getState({birthdateState: 'edit'}));
      }.bind(this),
      confirm : function () {
        var birthdate = $(React.findDOMNode(this)).find('.birthdate.editableInline input').val();
        StudentAction.updateBirthdate(this.props.student.id, birthdate);
        this.setState(this._getState({birthdateState: 'confirmed'}));
      }.bind(this),
      cancel : function () {
        this.setState(this._getState({birthdateState: 'canceled'}));
      }.bind(this)
    };
  },

  _onUpdateSchedule: function (diff) {
    var mappingSchedule = this.state.newMapping.schedule;
    mappingSchedule[diff.slot] += diff.value;
    newMapping = assign({}, this.state.newMapping, {schedule: mappingSchedule})

    this.setState(this._getState({newMapping: newMapping}));
  },

  _onCloseEditStudent: function () {
    this.props.closeStudentDetails();
  },

  _onUpdateGroup: function (group) {
    this.setState(this._getState({groupId: group.id}));
  },

  _onUpdateDateRange: function (dateRangeObject) {
    this.setState(this._getState({dateRangeObject: dateRangeObject}));
  },

  _onToggleAddNewMapping: function () {
    if (this.state.newMapping) {
      this.setState(this._getState({newMapping: null}));
    }
    else {
      this.setState(this._getState({newMapping: StudentStore.getNewMapping(this.props.student)}));
    }
  },

  _getState: function (newState) {
  var defaultState = {
      groupId : this.state && this.state.groupId || this.props.student.getMapping().groupId,
      dateRangeObject: this.state && this.state.dateRangeObject || this.props.dateRangeObject,
      nameState: this.state && this.state.nameState || 'view',
      birthdateState: this.state && this.state.birthdateState || 'view',
      newMapping: this.state && this.state.newMapping || null
    }

    var state = assign({}, defaultState, newState);
    var filter = {};
    filter.groupId = state.newMapping && state.newMapping.groupId ||state.groupId;
    filter.dateRange = state.dateRangeObject.dateRange;

    state.groupSummary = StudentStore.getGroups(filter)[filter.groupId];

    return state;
  }

});

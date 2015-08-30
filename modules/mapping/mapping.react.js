var React = require('react');
var $ = require('jquery-browserify');
var ClassNames = require('classnames');
var assign = require('object-assign');
var Util = require('../util');

var Calendar = require('../calendar/calendar.react');

var mapping = module.exports = React.createClass({

  render: function () {
    return (
      <div className = 'mapping'>
        <span className={'groupPicker'}>{this.props.groups[this.props.mapping.groupId].name}</span>
        <Calendar schedule = {this.props.mapping.schedule} editable = {false}/>
        <span>{Util.formatDate(this.props.mapping.startDate)}</span>
      </div>
    );
  }

})

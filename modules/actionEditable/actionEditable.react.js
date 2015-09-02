var React = require('react');
var $ = require('jquery');
var ClassNames = require('classnames');

var calendar = module.exports = React.createClass({

  render: function () {
    var classes = {
      actionEditable: ClassNames({
        'actionEditable': true,
        'active': this.props.active
      })
    }

    var actionEditable = (this.props.active) ?
      (<span className = 'actionEditable'>
        <span className = 'actionEditableItem' onClick = {this.props.confirm}><i className = 'fa fa-check'></i></span>
        <span className = 'actionEditableItem warning' onClick = {this.props.cancel}><i className = 'fa fa-times'></i></span>
      </span>) :
      (<span className = 'actionEditable'>
        <span className = 'actionEditableItem' onClick = {this.props.edit}><i className = 'fa fa-pencil'></i></span>
      </span>)

    return actionEditable;
  }

});

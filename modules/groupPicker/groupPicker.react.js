var React = require('react');
var $ = require('jquery-browserify');
var ClassNames = require('classnames');

var groupPicker = module.exports = React.createClass({

  render: function () {

    return (
      <span className = {'groupPicker'}>
        <select onChange={this._onSelectGroup} defaultValue = {this.props.group.id}>
          {
            Object.keys(this.props.groups).map(function(groupId){
              return <option key = {groupId} value = {groupId}>{this.props.groups[groupId].name}</option>;
            }.bind(this))
          }
        </select>
      </span>
    )
  },

  _onSelectGroup: function (event) {
    this.props.updateGroup(this.props.groups[event.target.value]);
  }

});

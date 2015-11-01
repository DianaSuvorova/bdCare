var React = require('react');
var $ = require('jquery');
var ClassNames = require('classnames');
var assign = require('object-assign');
var Util = require('../util');

var Capacity = require('../capacity/capacity.react');

var mapping = module.exports = React.createClass({

  render: function () {
    return (
      <div className = 'mapping record'>
        <span>{this.props.groups[this.props.mapping.groupId].name}</span>
        <span className = 'date'>{Util.formatDate(this.props.mapping.startDate)}</span>
        <Capacity
          schedule = {this.props.mapping.schedule}
            capacity = {1}
            single = {true}
            waitlist={this.props.mapping.waitlist}
          />
          <span className = 'container'>
            <span className = 'actionItem edit' onClick = {this._onAddNewStudent}>
              <i className = 'fa fa-pencil'></i>
            </span>
          </span>
      </div>
    );
  }

})

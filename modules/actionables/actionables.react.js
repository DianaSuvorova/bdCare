var React = require('react');
var $ = require('jquery');
var ClassNames = require('classnames');

var Capacity = require('../capacityCubes/capacityCubes.react');
var StudentStore = require('../../stores/studentStore');

var actionables = module.exports = React.createClass({

  render: function () {
    var actionable = StudentStore.getActionablesForGroupAndDateRange();
    var actionableList =
        actionable.map(function (actionable) {
          return  (
            <div key = {'actionable_' + actionable.id}>
              <span>{actionable.text}</span>
            </div>
          )
        });

    var actionables = (actionable.length) ? (
          <div className = 'actionables'>
            <header>{'Actionable Items'}</header>
            <div className = 'actionableList'>{actionableList}</div>
          </div>) :
          null;

    return actionables;

  }


});

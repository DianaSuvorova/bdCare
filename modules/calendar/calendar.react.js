var React = require('react');
var $ = require('jquery-browserify');
var ClassNames = require('classnames');

var calendar = module.exports = React.createClass({

  render: function () {

    var slotClass = function(slot) {
      return (this.props.schedule[slot]) ? 'taken' : 'available'
    }.bind(this)

    var headerDiv = (this.props.header) ?
      (<div className = 'header'>
        <span>Mon</span>
        <span>Tue</span>
        <span>Wed</span>
        <span>Thu</span>
        <span>Fri</span>
      </div>) :
      null;

    return (
      <div className = 'calendar'>
        {headerDiv}
        <div className = 'am'>
          <span className = {slotClass('mon_am')}></span>
          <span className = {slotClass('tue_am')}></span>
          <span className = {slotClass('wed_am')}></span>
          <span className = {slotClass('thu_am')}></span>
          <span className = {slotClass('fri_am')}></span>
         </div>
        <div className = 'pm'>
          <span className = {slotClass('mon_pm')}></span>
          <span className = {slotClass('tue_pm')}></span>
          <span className = {slotClass('wed_pm')}></span>
          <span className = {slotClass('thu_pm')}></span>
          <span className = {slotClass('fri_pm')}></span>
         </div>
      </div>
    )
  }
});

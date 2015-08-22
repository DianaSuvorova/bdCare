var React = require('react');
var $ = require('jquery-browserify');
var ClassNames = require('classnames');

var calendar = module.exports = React.createClass({

  render: function () {

    var getSlotLabel = function (slot) {
      return (this.props.schedule[slot] > 0 && this.props.labels) ? this.props.schedule[slot] : '';
    }.bind(this);

    var classes = {
      slot:  function(slot) {
        return slot.replace('_', ' ') + ((this.props.schedule[slot] > 0) ? ' available' : ' taken')
      }.bind(this),
       calendar : ClassNames({
         calendar: true,
         editable: (this.props.editMode) ? true : false
       })
     }

    return (
      <div className = {classes.calendar}>
        <span className = 'day'>
          <span className = {classes.slot('mon_am')}>{getSlotLabel('mon_am')}</span>
          <span className = {classes.slot('mon_pm')}>{getSlotLabel('mon_pm')}</span>
        </span>
        <span className = 'day'>
          <span className = {classes.slot('tue_am')}>{getSlotLabel('tue_am')}</span>
          <span className = {classes.slot('tue_pm')}>{getSlotLabel('tue_pm')}</span>
        </span>
        <span className = 'day'>
          <span className = {classes.slot('wed_am')}>{getSlotLabel('wed_am')}</span>
          <span className = {classes.slot('wed_pm')}>{getSlotLabel('wed_pm')}</span>
        </span>
        <span className = 'day'>
          <span className = {classes.slot('thu_am')}>{getSlotLabel('thu_am')}</span>
          <span className = {classes.slot('thu_pm')}>{getSlotLabel('thu_pm')}</span>
        </span>
        <span className = 'day'>
          <span className = {classes.slot('fri_am')}>{getSlotLabel('fri_am')}</span>
          <span className = {classes.slot('fri_pm')}>{getSlotLabel('fri_pm')}</span>
        </span>
      </div>
    )
  }
});

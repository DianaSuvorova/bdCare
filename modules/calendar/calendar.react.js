var React = require('react');
var $ = require('jquery-browserify');
var ClassNames = require('classnames');

var calendar = module.exports = React.createClass({

  render: function () {

    var classes = {
      slot:  function(slot) {
        return slot.replace('_', ' ') + ((!this.props.entry && this.props.schedule[slot] === 0) ? ' available' : ' taken')
      }.bind(this),
       calendar : ClassNames({
         calendar: true,
         editable: (this.props.editMode) ? true : false,
         entry: this.props.entry
       })
     }

    return (
      <div className = {classes.calendar}>
        <span className = 'day'>
          <span className = {classes.slot('mon_am')}></span>
          <span className = {classes.slot('mon_pm')}></span>
        </span>
        <span className = 'day'>
          <span className = {classes.slot('tue_am')}></span>
          <span className = {classes.slot('tue_pm')}></span>
        </span>
        <span className = 'day'>
          <span className = {classes.slot('wed_am')}></span>
          <span className = {classes.slot('wed_pm')}></span>
        </span>
        <span className = 'day'>
          <span className = {classes.slot('thu_am')}></span>
          <span className = {classes.slot('thu_pm')}></span>
        </span>
        <span className = 'day'>
          <span className = {classes.slot('fri_am')}></span>
          <span className = {classes.slot('fri_pm')}></span>
        </span>
      </div>
    )
  }
});

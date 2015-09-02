var React = require('react');
var $ = require('jquery');
var ClassNames = require('classnames');

var capacity = module.exports = React.createClass({

  render: function () {

    var styles = {
      height : function (slot) {
        return {height: (((this.props.capacity - this.props.schedule[slot]) / this.props.capacity) * 100) + '%'};
      }.bind(this)
    };

    var classes = {
      slot : function (slot) {
        return slot.replace('_', ' ')
      }
    };

    return (
      <div className = 'capacity'>
        <div className = 'header'>
          <span>Mon</span>
          <span>Tue</span>
          <span>Wed</span>
          <span>Thu</span>
          <span>Fri</span>
        </div>
        <div className = 'vis'>
          <span className = 'day'>
            <span className = {classes.slot('mon_am')} style = {styles.height('mon_am')}></span>
            <span className = {classes.slot('mon_pm')} style = {styles.height('mon_pm')}></span>
          </span>
          <span className = 'day'>
            <span className = {classes.slot('tue_am')} style = {styles.height('tue_am')}></span>
            <span className = {classes.slot('tue_pm')} style = {styles.height('tue_pm')}></span>
          </span>
          <span className = 'day'>
            <span className = {classes.slot('wed_am')} style = {styles.height('wed_am')}></span>
            <span className = {classes.slot('wed_pm')} style = {styles.height('wed_pm')}></span>
          </span>
          <span className = 'day'>
            <span className = {classes.slot('thu_am')} style = {styles.height('thu_am')}></span>
            <span className = {classes.slot('thu_pm')} style = {styles.height('thu_pm')}></span>
          </span>
          <span className = 'day'>
            <span className = {classes.slot('fri_am')} style = {styles.height('fri_am')}></span>
            <span className = {classes.slot('fri_pm')} style = {styles.height('fri_pm')}></span>
          </span>
        </div>
      </div>
      );
  }

});

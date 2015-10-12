var React = require('react');
var $ = require('jquery');
var ClassNames = require('classnames');

var capacityCubes = module.exports = React.createClass({

  render: function () {

    var classes = {
      capacity : ClassNames({
        'capacityCubes': true,
        'waitlist': this.props.waitlist
      }),
      slot : function (slot) {
        return 'slot ' + slot.replace('_', ' ')
      }
    };

    var cubes = function (slot) {
      var cubes = [];
      var cube;
      if (this.props.waitlist) {
        if (this.props.schedule[slot]) cube = <span key = {slot+'_taken_'+i} className = 'cube taken'></span>
        else cube = <span key = {slot+'_available_'+i} className = 'cube available'></span>
        cubes.push(cube)
      }
      else {
        for (var i = 0; i < (this.props.capacity - this.props.schedule[slot]); i++ ) {
          cube = <span key = {slot+'_taken_'+i} className = 'cube taken'></span>
          cubes.push(cube);
        }

        for (var i = 0; i < this.props.schedule[slot]; i++ ) {
          cube = <span key = {slot+'_available_'+i} className = 'cube available'></span>
          cubes.push(cube);
        }
      }
      return cubes;
    }.bind(this);

    return (
      <div className = {classes.capacity}>
        <div className = 'vis'>
          <span className = 'day'>
            <span className = {classes.slot('mon_am')}>{cubes('mon_am')}</span>
            <span className = {classes.slot('mon_pm')}>{cubes('mon_pm')}</span>
          </span>
          <span className = 'day'>
            <span className = {classes.slot('tue_am')}>{cubes('tue_am')}</span>
            <span className = {classes.slot('tue_pm')}>{cubes('tue_pm')}</span>
          </span>
          <span className = 'day'>
            <span className = {classes.slot('wed_am')}>{cubes('wed_am')}</span>
            <span className = {classes.slot('wed_pm')}>{cubes('wed_pm')}</span>
          </span>
          <span className = 'day'>
            <span className = {classes.slot('thu_am')}>{cubes('thu_am')}</span>
            <span className = {classes.slot('thu_pm')}>{cubes('thu_pm')}</span>
          </span>
          <span className = 'day'>
            <span className = {classes.slot('fri_am')}>{cubes('fri_am')}</span>
            <span className = {classes.slot('fri_pm')}>{cubes('fri_pm')}</span>
          </span>
        </div>
      </div>
      );
  }

});

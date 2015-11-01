var React = require('react');
var $ = require('jquery');
var ClassNames = require('classnames');

var capacityCubes = module.exports = React.createClass({

  render: function () {

    var fullRows = this._getNumFullRows(this.props.schedule, this.props.capacity);
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
      var waitlist = (this.props.waitlist) ? ' waitlist' : '';
      if (this.props.single) {
        if (this.props.schedule[slot]) {
            var conflict = (this.props.conflictSlots && this.props.conflictSlots[slot]) ? ' conflict' : '';
            cube = <span key = {slot+'_taken_'+i} className = {'cube taken' + waitlist + conflict}></span>
        }
        else {
          cube = <span key = {slot+'_available_'+i} className = {'cube available'+ waitlist}></span>
        }
        cubes.push(cube)
      }
      else {
        for (var i = 0; i < (this.props.capacity - fullRows - (this.props.schedule[slot] > 0 ? this.props.schedule[slot] : 0 )); i++ ) {
          cube = <span key = {slot+'_taken_'+i} className = 'cube taken'></span>
          cubes.push(cube);
        }

        if (this.props.highlightSchedule && this.props.highlightSchedule[slot]) {
          if (this.props.schedule[slot]) {
            cube = <span key = {slot+'_taken_'+i} className = 'cube waitlist taken'></span>

          }
          else {
            //conflict
          }
          cubes.push(cube);
          for (var i = 0; i < (this.props.schedule[slot] - 1 ); i++ ) {
            cube = <span key = {slot+'_available_'+i} className = 'cube available'></span>
            cubes.push(cube);
          }
        }
        else {
          for (var i = 0; i < (this.props.schedule[slot]); i++ ) {
            cube = <span key = {slot+'_available_'+i} className = 'cube available'></span>
            cubes.push(cube);
          }
        }
      }
      return cubes;
    }.bind(this);

    var  fullRow = (this.props.single) ? null : (<div className = 'fullRow'>
                <span className= 'value'> {fullRows} </span>
                <span className= 'label'> {'FULL SCHEDULES'} </span>
              </div>);

    return (
      <div className = {classes.capacity}>
        <div className = 'vis'>
          <div className = 'partialRows'>
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
          {fullRow}
        </div>
      </div>
      );
  },

  _getNumFullRows: function (schedule, capacity) {
    var fullRows = 0;
    Object.keys(schedule).forEach(function (slot) {
      if (schedule[slot] > fullRows) fullRows = schedule[slot];
    });
    return capacity - fullRows;
  }

});

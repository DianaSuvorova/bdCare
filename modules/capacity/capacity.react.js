var React = require('react');
var $ = require('jquery');
var ClassNames = require('classnames');

var capacityCubes = module.exports = React.createClass({

  render: function () {

    var fullRows = this._getNumFullRows(this.props.schedule, this.props.capacity);
    var classes = {
      capacity : ClassNames({
        'capacityCubes': true,
        'waitlist': this.props.waitlist,
        'editable': this.props.updateSchedule
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
            cubes.push(cube);
          }
          else {
            //conflict
          }
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
              <span data-id='mon_am' className = {classes.slot('mon_am')} onClick = {this._onClickSlot}>{cubes('mon_am')}</span>
              <span data-id='mon_pm' className = {classes.slot('mon_pm')} onClick = {this._onClickSlot}>{cubes('mon_pm')}</span>
            </span>
            <span className = 'day'>
              <span data-id='tue_am' className = {classes.slot('tue_am')} onClick = {this._onClickSlot}>{cubes('tue_am')}</span>
              <span data-id='tue_pm' className = {classes.slot('tue_pm')} onClick = {this._onClickSlot}>{cubes('tue_pm')}</span>
            </span>
            <span className = 'day'>
              <span data-id='wed_am' className = {classes.slot('wed_am')} onClick = {this._onClickSlot}>{cubes('wed_am')}</span>
              <span data-id='wed_pm' className = {classes.slot('wed_pm')} onClick = {this._onClickSlot}>{cubes('wed_pm')}</span>
            </span>
            <span className = 'day'>
              <span data-id='thu_am' className = {classes.slot('thu_am')} onClick = {this._onClickSlot}>{cubes('thu_am')}</span>
              <span data-id='thu_pm' className = {classes.slot('thu_pm')} onClick = {this._onClickSlot}>{cubes('thu_pm')}</span>
            </span>
            <span className = 'day'>
              <span data-id='fri_am' className = {classes.slot('fri_am')} onClick = {this._onClickSlot}>{cubes('fri_am')}</span>
              <span data-id='fri_pm' className = {classes.slot('fri_pm')} onClick = {this._onClickSlot}>{cubes('fri_pm')}</span>
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
  },

  _onClickSlot : function (e) {
    var slot = $(e.target).closest('[data-id]').attr('data-id');
    var diff = {slot: slot};
    diff.value = (this.props.schedule[slot] === 0) ? 1 : -1;
    this.props.updateSchedule && this.props.updateSchedule(diff);
  }

});

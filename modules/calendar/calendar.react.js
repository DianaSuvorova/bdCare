var React = require('react');
var $ = require('jquery-browserify');
var ClassNames = require('classnames');

var calendar = module.exports = React.createClass({

  render: function () {

    var text = function(slot) {
      return (this.props.group) ? this.props.schedule[slot] : ''
    }.bind(this);

    var classes = {
      slot:  function(slot) {
        return slot.replace('_', ' ') +
               ((this.props.group) ? ' group ' : '') +
               ((this.props.group) ?
                ((this.props.schedule[slot] > 0)  ? ' available' : ' taken') :
                ((this.props.schedule[slot] === 0) ? ' available' : ' taken')
                );
      }.bind(this),
       calendar : ClassNames({
         'calendar': true,
         'group': this.props.group,
         'editable': this.props.editable
       })
     }

    return (
      <div className = {classes.calendar}>
        <span className = 'day'>
          <span data-id='mon_am' className = {classes.slot('mon_am')} onClick = {this._onClickSlot}>{text('mon_am')}</span>
          <span data-id='mon_pm' className = {classes.slot('mon_pm')} onClick = {this._onClickSlot}>{text('mon_pm')}</span>
        </span>
        <span className = 'day'>
          <span data-id='tue_am' className = {classes.slot('tue_am')} onClick = {this._onClickSlot}>{text('tue_am')}</span>
          <span data-id='tue_pm' className = {classes.slot('tue_pm')} onClick = {this._onClickSlot}>{text('tue_pm')}</span>
        </span>
        <span className = 'day'>
          <span data-id='wed_am' className = {classes.slot('wed_am')} onClick = {this._onClickSlot}>{text('wed_am')}</span>
          <span data-id='wed_pm' className = {classes.slot('wed_pm')} onClick = {this._onClickSlot}>{text('wed_pm')}</span>
        </span>
        <span className = 'day'>
          <span data-id='thu_am' className = {classes.slot('thu_am')} onClick = {this._onClickSlot}>{text('thu_am')}</span>
          <span data-id='thu_pm' className = {classes.slot('thu_pm')} onClick = {this._onClickSlot}>{text('thu_pm')}</span>
        </span>
        <span className = 'day'>
          <span data-id='fri_am' className = {classes.slot('fri_am')} onClick = {this._onClickSlot}>{text('fri_am')}</span>
          <span data-id='fri_pm' className = {classes.slot('fri_pm')} onClick = {this._onClickSlot}>{text('fri_pm')}</span>
        </span>
      </div>
    )
  },

  _onClickSlot : function (e) {
    var slot = $(e.target).attr('data-id');
    var diff = {slot: slot};
    diff.value = (this.props.schedule[slot] === 0) ? 1 : -1;
    this.props.updateSchedule(diff);
  }

});

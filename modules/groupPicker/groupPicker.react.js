var React = require('react');
var $ = require('jquery');
var ClassNames = require('classnames');

var groupPicker = module.exports = React.createClass({

  // render: function () {
  //
  //   return (
  //     <span className = {'picker'}>
  //       <select onChange={this._onSelectGroup} defaultValue = {this.props.group.id}>
  //         {
  //           Object.keys(this.props.groups).map(function(groupId){
  //             return <option key = {groupId} value = {groupId}>{this.props.groups[groupId].name}</option>;
  //           }.bind(this))
  //         }
  //       </select>
  //     </span>
  //   )
  // },
  //
  // _onSelectGroup: function (event) {
  //   this.props.updateGroup(this.props.groups[event.target.value]);
  // }


  render: function () {
    this.keys = Object.keys(this.props.kvMap);
    this.key = this.props.kvObject.key || this.props.kvObject.id;
    this.value = this.props.kvObject.name || this.props.kvObject.value;
    this.idx = this.props.kvObject && this.keys.indexOf(this.key);

    var classes = {
      prev: ClassNames({
        'prev' : true,
        'active' : this.idx > 0
      }),
      next:  ClassNames({
        'next' : true,
        'active' : this.idx < this.keys.length - 1
      })
    };

    return (
      <span className = {'picker'}>
        <span className = {classes.prev} onClick = {this._onClickPrev}><i className ='fa fa-caret-left'></i></span>
        <span className = 'value'>{this.value}</span>
        <span className = {classes.next} onClick = {this._onClickNext}><i className ='fa fa-caret-right'></i></span>
      </span>
    )
  },

  _onClickPrev: function () {
    this.props.update(this.props.kvMap[this.keys[this.idx - 1]]);
  },

  _onClickNext: function () {
    this.props.update(this.props.kvMap[this.keys[this.idx + 1]]);
  }


});

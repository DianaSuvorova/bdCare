var React = require('react');
var $ = require('jquery-browserify');
var ClassNames = require('classnames');
var Link = require('react-router').Link;

var navbar = module.exports = React.createClass({

  render: function () {
    var classes = {
      dashboard : ClassNames (
        {'active': !this.props.studentsActive}
      ),
      students : ClassNames (
        {'active': this.props.studentsActive}
      ),
    }

    return (
      <div id = 'navbar' className = {this.props.className} >
        <span className = {classes.dashboard} onClick = {this._onClickNavigate}>Dashboard</span>
        <span className = {classes.students} onClick = {this._onClickNavigate}>Students</span>
      </div>
      );
  },

  _onClickNavigate: function (e) {
    this.props.navigateTo($(e.target).text());
  },

});

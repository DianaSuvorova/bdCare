var React = require('react');
var $ = require('jquery-browserify');
var ClassNames = require('classnames');
var Link = require('react-router').Link;

var navbar = module.exports = React.createClass({

  render: function () {
    return (
      <div id = 'navbar' className = {this.props.className} >
        <Link to='dashboard'>Dashboard</Link>
        <Link to='students'>Students</Link>
      </div>
      );
  }

});

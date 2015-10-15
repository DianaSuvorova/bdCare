var React = require('react');
var $ = require('jquery');
var ClassNames = require('classnames');
var Router = require('./../router/router');

var footer = React.createClass({

  render: function () {
    var d = new Date();
    var year = d.getFullYear();
    return (
      <div id = 'footer'>
        <div className = 'about'>
          <span onClick = {this._onNavigateAboutUs}>{'ABOUT US'}</span>
        </div>
        <div className = 'copy'>
          <span>{'\u00A9'+' Copyright bdCare '+ year}</span>
        </div>
      </div>
    );
  },

  _onNavigateAboutUs: function () {
    Router.navigate('/about');
  },

});

module.exports =  footer;

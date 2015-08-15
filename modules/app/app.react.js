var React = require('react');
var $ = require('jquery-browserify');
var ClassNames = require('classnames');

var Navbar = require('./../navbar/navbar.react');
var Content = require('./../content/content.react');
var Footer = require('./../footer/footer.react');

var app = React.createClass({

  render: function () {
    return (
      <div id = 'app'>
        <Navbar/>
        <Content/>
        <Footer/>
      </div>
    );
  }
});

React.render(React.createElement(app), document.body);

module.exports =  app;
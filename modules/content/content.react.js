var React = require('react');
var $ = require('jquery-browserify');
var ClassNames = require('classnames');

var content = React.createClass({

  render: function () {
    return (
      <div id = 'content'>
        <div className = 'container'>
          container
        </div>
      </div>
      );
  }

});

module.exports =  content;
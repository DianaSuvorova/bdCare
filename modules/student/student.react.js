var React = require('react');
var $ = require('jquery-browserify');
var ClassNames = require('classnames');

var student = module.exports = React.createClass({

  render: function () {
    return(
      <div>
        <div>{this.props.name}</div>
      </div>
    )
  }
});

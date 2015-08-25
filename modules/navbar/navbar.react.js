var React = require('react');
var $ = require('jquery-browserify');
var ClassNames = require('classnames');
var Link = require('react-router').Link;
var MonthPicker = require('../monthPicker/monthPicker.react');


var navbar = module.exports = React.createClass({

  render: function () {
    return (
      <div id = 'navbar' className = {this.props.className} >
        <Link to='dashboard'>Dashboard</Link>
        <Link to='students'>Students</Link>
        <Link to='update'>Transfers</Link>
        <MonthPicker updateDateRange = {this.props.onUpdateDateRange}  dateRangeList = {this.props.dateRangeList} dateRange = {this.props.dateRange}/>
      </div>
      );
  }

});

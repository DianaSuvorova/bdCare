var React = require('react');
var $ = require('jquery');
var ClassNames = require('classnames');
var Link = require('react-router').Link;
var Router = require('./../router/router');

var StudentStore = require('../../stores/studentStore');
var DateRangeStore = require('../../stores/dateRangeStore');


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
        <span className = {classes.dashboard} onClick = {this._onNavigateDashboard}>Dashboard</span>
        <span className = {classes.students} onClick = {this._onNavigateStudents}>Students</span>
      </div>
      );
  },

  _onNavigateDashboard: function () {
    Router.navigate('/dashboard');
  },

  _onNavigateStudents: function () {
    var groups = StudentStore.getGroupsMap();

    var dateRangeObject = DateRangeStore.getCurrentDateRangeObject();
    var groupId = Object.keys(groups)[0];
    Router.navigate('/group/'+ groupId + '/period/' + dateRangeObject.key);
  }

});

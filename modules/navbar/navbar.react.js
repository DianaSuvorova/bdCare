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
        <div className = {'logo'} onClick = {this._onNavigateDashboard}>
          <span className = {'green'}>bd</span>
          <span>care</span>
        </div>
        <div className = {classes.dashboard} onClick = {this._onNavigateDashboard}>DASHBOARD</div>
        <div className = {classes.students} onClick = {this._onNavigateStudents}>STUDENTS</div>
      </div>
      );
  },

  _onNavigateDashboard: function () {
    Router.navigate('/dashboard');
  },

  _onNavigateStudents: function () {
    var groups = StudentStore.getGroups();

    var dateRangeObject = DateRangeStore.getCurrentDateRangeObject();
    var groupId = Object.keys(groups)[0];
    Router.navigate('/group/'+ groupId + '/period/' + dateRangeObject.key);
  }

});

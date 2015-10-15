var React = require('react');
var $ = require('jquery');
var ClassNames = require('classnames');
var Router = require('./../router/router');

var Navbar = require('./../navbar/navbar.react');
var Dashboard = require('./../dashboard/dashboard.react');
var Students = require('./../students/students.react');
var Footer = require('./../footer/footer.react');

var assign = require('object-assign');

var schoolId = 0; //this should come from user store.

var StudentStore = require('../../stores/studentStore');
var DateRangeStore = require('../../stores/dateRangeStore');

var app = module.exports = React.createClass({

  getInitialState : function () {
    return {
      students: false,
      aboutUs: false,
      dateRangeObject: DateRangeStore.getCurrentDateRangeObject(),
      groupId: null
    }
  },

  componentDidMount: function () {
    Router.add(/group\/(.*)\/period\/(.*)/, function() {
        var dateRangeObject = DateRangeStore.getDateRangeMap()[arguments[1]];
        this.setState(this._getState({students: true, groupId: arguments[0], dateRangeObject: dateRangeObject}));
    }.bind(this))
    .add(/dashboard/, function() {
      this.setState(this._getState({students: false}))
    }.bind(this))
    .add(/aboutus/, function() {
      this.setState(this._getState({aboutUs: true}))
    }.bind(this))
    .add(/student\/(.*)/, function() {
        var groups = StudentStore.getGroups();

        var dateRangeObject = DateRangeStore.getCurrentDateRangeObject();
        var groupId = Object.keys(groups)[0];
        this.setState(this._getState({students: true, groupId: groupId, dateRangeObject: dateRangeObject, activeStudentId: arguments[0]}));
    }.bind(this))
    .add(function() {
      Router.navigate('/dashboard');
    }.bind(this))
    .check()
    .listen();
//    .navigate('dashboard/');
  },

  render: function () {
    var content = (this.state.students) ?
      <Students dateRangeObject = {this.state.dateRangeObject} groupId = {this.state.groupId} activeStudentId = {this.state.activeStudentId}/> :
      <Dashboard/> ;

    return (
      <div id = 'app'>
        <Navbar studentsActive = {this.state.students}/>
        <div className = 'content'>{content}</div>
        <Footer/>
      </div>
    );
  },

  _getState: function (newState) {
    var groups = StudentStore.getGroups();

    var defaultState = {
      activeStudentId: null,
      students: false,
      dateRangeObject: DateRangeStore.getCurrentDateRangeObject(),
      groupId: Object.keys(groups)[0],
      aboutUs: false
    };

    var state = assign({}, defaultState, newState);
    return state;
  }
});

React.render(React.createElement(app), document.body);

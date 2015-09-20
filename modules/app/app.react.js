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
      dateRangeObject: DateRangeStore.getCurrentDateRangeObject(),
      groupId: null
    }
  },

  componentDidMount: function () {
    Router.add(/group\/(.*)\/period\/(.*)/, function() {
        var dateRangeObject = DateRangeStore.getDateRangeMap()[arguments[1]];
        this.setState(this._getState({students: true, groupId: arguments[0], dateRangeObject}));
    }.bind(this))
    .add(/group/, function() {
        this.setState(this._getState({students: true, groupId: null, dateRangeObject: null}));
    }.bind(this))
    .add(/dashboard/, function() {
      this.setState(this._getState({students: false}))
    }.bind(this))
    .check()
    .listen();
  },

  render: function () {
    var content = (this.state.students) ?
      <Students dateRangeObject = {this.state.dateRangeObject} groupId = {this.state.groupId}/> :
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
    var groups = StudentStore.getGroupsMap();

    var defaultState = {
      students: false,
      dateRangeObject: DateRangeStore.getCurrentDateRangeObject(),
      groupId: Object.keys(groups)[0]
    };

    var state = assign({}, defaultState, newState);
    return state;
  }
});

React.render(React.createElement(app), document.body);

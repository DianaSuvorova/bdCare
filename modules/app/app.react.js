var React = require('react');
var $ = require('jquery');
var ClassNames = require('classnames');
var Router = require('./../router/router');

var Navbar = require('./../navbar/navbar.react');
var Dashboard = require('./../dashboard/dashboard.react');
var Students = require('./../students/students.react');
var Footer = require('./../footer/footer.react');

var schoolId = 0; //this should come from user store.

var app = module.exports = React.createClass({

  getInitialState : function () {
    return {
      students: false,
      dateRangeObject: null,
      groupId: null
    }
  },

  render: function () {
    var content = (this.state.students) ?
      <Students navigateTo = {this._navigateTo} dateRangeObject = {this.state.dateRangeObject} groupId = {this.state.groupId}/> :
      <Dashboard navigateTo = {this._navigateTo} dateRangeObject = {this.state.dateRangeObject} groupId = {this.state.groupId}/>;

    return (
      <div id = 'app'>
        <Navbar navigateTo = {this._navigateTo} studentsActive = {this.state.students}/>
        <div className = 'content'>{content}</div>
        <Footer/>
      </div>
    );
  },

  _navigateTo: function (link, dateRangeObject, groupId) {
    this.setState({
      students: (link === 'Students'),
      dateRangeObject: dateRangeObject,
      groupId: groupId
    })
  }
});

React.render(React.createElement(app), document.body);


Router.add(/about/, function() {
    console.log('about');
})
.add(/products\/(.*)\/edit\/(.*)/, function() {
    console.log('products', arguments);
})
.add(function() {
    console.log('default');
})
.check('/products/12/edit/22').listen();

// forwarding
Router.navigate('/about');

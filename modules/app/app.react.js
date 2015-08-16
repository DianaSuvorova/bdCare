var React = require('react');
var $ = require('jquery-browserify');
var ClassNames = require('classnames');
var Router = require('react-router');

var Navbar = require('./../navbar/navbar.react');
var Dashboard = require('./../dashboard/dashboard.react');
var Students = require('./../students/students.react');
var Footer = require('./../footer/footer.react');

var schoolId = 0; //this should come from user store.

var app = module.exports = React.createClass({

  render: function () {
    return (
      <div id = 'app'>
        <Navbar/>
        <div className = 'content'><RouteHandler schoolId= {schoolId}/></div>
        <Footer/>
      </div>
    );
  }
});

var DefaultRoute = Router.DefaultRoute;
var Route = Router.Route;
var RouteHandler = Router.RouteHandler;
var Redirect = Router.Redirect;

var routes =(
  <Route name = 'app' path = '/' handler = {app}>
    <Route name = 'dashboard' path = '/dashboard' handler = {Dashboard}/>
    <Route name = 'students' path = '/students' handler = {Students}/>
    <DefaultRoute handler = {Dashboard}/>
    <Redirect from = '/'  to = '/dashboard' />
  </Route>
);

Router.run(routes, function (Handler, state) {
  React.render(<Handler path =  {state.path}/>, document.body);
});

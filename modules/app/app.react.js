var React = require('react');
var $ = require('jquery-browserify');
var ClassNames = require('classnames');
var Router = require('react-router');

var Navbar = require('./../navbar/navbar.react');
var Dashboard = require('./../dashboard/dashboard.react');
var Students = require('./../students/students.react');
var Footer = require('./../footer/footer.react');

var schoolId = 0; //this should come from user store.


function getDateRangeMap() {
  var currentDate = new Date(), currentYear = currentDate.getFullYear(), currentMonth = currentDate.getMonth();
  var locale = "en-us";
  var dateRangeMap = {};
  for (var month = currentMonth; month < currentMonth + 3; month++) {
    var startDate = new Date(currentYear, month, 1);
    var monthWord = startDate.toLocaleString(locale, { month: "long" });
    dateRangeMap[monthWord + ' ' + startDate.getFullYear()] = [startDate, new Date(currentYear, month + 1, 1)]
  }
  return dateRangeMap;
}

var app = module.exports = React.createClass({

  _dateRangeMap : getDateRangeMap(),

  getInitialState: function () {
    var dateRangeKey = Object.keys(this._dateRangeMap)[0]
    return {
      dateRangeKey: dateRangeKey,
      dateRange: this._dateRangeMap[dateRangeKey]
    }
  },

  render: function () {
    return (
      <div id = 'app'>
        <Navbar onUpdateDateRange = {this._onUpdateDateRange}  dateRangeList = {Object.keys(this._dateRangeMap)} dateRangeKey = {this.state.dateRangeKey}/>
        <div className = 'content'><RouteHandler schoolId = {schoolId} dateRange = {this.state.dateRange}/></div>
        <Footer/>
      </div>
    );
  },

  _onUpdateDateRange: function (dateRangeKey) {
    this.setState({dateRangeKey: dateRangeKey, dateRange: this._dateRangeMap[dateRangeKey]});
  },

});

var DefaultRoute = Router.DefaultRoute;
var Route = Router.Route;
var RouteHandler = Router.RouteHandler;
var Redirect = Router.Redirect;

var routes =(
  <Route name = 'app' path = '/' handler = {app}>
    <Route name = 'dashboard' path = '/dashboard' handler = {Dashboard}/>
    <Route name = 'students' path = '/students' handler = {Students}>
      <Route name = 'studentsGroup' path=':groupId' handler={Students}/>
    </Route>
    <DefaultRoute handler = {Dashboard}/>
    <Redirect from = '/'  to = '/dashboard' />
  </Route>
);

Router.run(routes, function (Handler, state) {
  React.render(<Handler path =  {state.path}/>, document.body);
});

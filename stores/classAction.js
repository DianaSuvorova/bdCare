var Dispatcher = require('../dispatcher/dispatcher');
var Constants = require('../dispatcher/constants');
var Api = require('./api');

var classAction = module.exports = {
  loadForSchoolId: function (schoolId) {
    Api.getClassesForSchool(schoolId);
  },

  getForSchoolId: function () {
    Dispatcher.dispatch({
      actionType: Constants.GET_CLASSES
    });
  }
}

var Dispatcher = require('../dispatcher/dispatcher');
var Constants = require('../dispatcher/constants');
var Api = require('./api');

var studentAction = module.exports = {
  loadForSchoolId: function (schoolId) {
    Api.getStudentsForSchool(schoolId);
  },

  getForSchoolId: function () {
    Dispatcher.dispatch({
      actionType: Constants.GET_STUDENTS
    });
  }

}

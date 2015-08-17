var Api = require('./api');
var assign = require('object-assign');
var Dispatcher = require('../dispatcher/dispatcher');
var Constants = require('../dispatcher/constants');
var EventEmitter = require('events').EventEmitter;

var CHANGE_EVENT = 'change';

var _classes = [];

function set(classes) {
  _classes = classes.map(function (classObj) {
    return assign({}, classObj.attributes, {id: classObj.id})
  });
}

var classStore = module.exports = assign({}, EventEmitter.prototype, {

  emitChange: function () {
    this.emit(CHANGE_EVENT);
  },

  addChangeListener: function (callback) {
    this.on(CHANGE_EVENT, callback);
  },

  removeChangeListener: function (callback) {
    this.removeListener(CHANGE_EVENT, callback);
  },

  getClasses: function () {
    return _classes;
  },

  getClassMap: function () {
    var classMap = {};
    for (var i = 0; i < _classes.length; i++) {
      var classObj = _classes[i];
      classMap[classObj.id] = classObj;
    }
    return classMap;
  }

});


Dispatcher.register( function (action) {
  switch(action.actionType) {

    case Constants.API_GET_CLASSES_SUCCESS:
      if(action.classes) {
        set(action.classes);
      }
      classStore.emitChange();
        break;

    case Constants.GET_CLASSES:
      classStore.emitChange();
      break;
  }
});

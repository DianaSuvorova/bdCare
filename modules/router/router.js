
function clearSlashes(path) {
  return path.toString().replace(/\/$/, '').replace(/^\//, '');
}

// "inspired" by http://krasimirtsonev.com/blog/article/A-modern-JavaScript-router-in-100-lines-history-api-pushState-hash-url

var Router = function () {
  this.initialize.apply(this, arguments);
  return this;
};

Router.prototype = {};

Router.prototype.initialize = function (o) {
  this.root = (o && o.root) ? '/' + clearSlashes(o.root) + '/' : '/';
  this.routes = [];

};

Router.prototype.getFragment = function () {
  var fragment = clearSlashes(decodeURI(location.pathname));
  fragment = this.root != '/' ? fragment.replace(this.root, '') : fragment;
  return clearSlashes(fragment);
};

Router.prototype.add = function (re, handler) {
  if (typeof re == 'function') {
    handler = re;
    re = '';
  }
  this.routes.push({re: re, handler: handler});
  return this;
};

Router.prototype.remove = function (param) {
  for (var i = 0, r; i < this.routes.length, r = this.routes[i]; i++) {
    if (r.handler === param || r.re.toString() === param.toString()){
      this.routes.splice(i, 1);
      return this;
    }
  }
  return this;
};

Router.prototype.reset = function () {
  this.routes = [];
  this.root = '/';
  return this;
};

Router.prototype.check = function (f) {
  var fragment = f || this.getFragment();
  for (var i = 0; i < this.routes.length; i ++) {
    var match = fragment.match(this.routes[i].re);
    if (match) {
      match.shift();
      this.routes[i].handler.apply({}, match);
      return this;
    }
  }
  return this;
};

Router.prototype.listen = function () {
  var currentFragment = this.getFragment();
  var fn = function() {
    if (currentFragment !== this.getFragment()) {
      currentFragment = this.getFragment();
      this.check(currentFragment);
    }
  }.bind(this)
  clearInterval(this.interval);
  this.interval = setInterval(fn, 50);
  return this;
};

Router.prototype.navigate = function (path) {
    path = path ? path : '' ;
    history.pushState(null, null, this.root + clearSlashes(path));
    return this;
};


var router = module.exports = new Router();

'use strict';

var BaseService = require('./service');
var inherits = require('util').inherits;
var fs = require('fs');
var pkg = require('../package');

var ExplorerUI = function(options) {
  BaseService.call(this, options);
  this.routePrefix = options.routePrefix || pkg.explorerConfig.routePrefix;

  // Write the node config to an angular constant module that gets evaluated at app start up.
  // Clone options and remove `node` to avoid JSON.stringify circular ref.
  var config = Object.assign({}, options);
  delete config.node;
  fs.writeFileSync(__dirname + '/../public/js/ows-node-config.js', 'angular.module(\'explorer\').constant(\'nodeConfig\', ' + JSON.stringify(config, null, 2) + ');');
};

inherits(ExplorerUI, BaseService);

ExplorerUI.prototype.start = function(callback) {
  this.indexFile = this.filterIndexHTML(fs.readFileSync(__dirname + '/../public/index-template.html', {encoding: 'utf8'}));
  setImmediate(callback);
};

ExplorerUI.prototype.getRoutePrefix = function() {
  return this.routePrefix;
};

ExplorerUI.prototype.setupRoutes = function(app, express) {
  var self = this;
  app.use(express.static(__dirname + '/../public'));
  // if not in found, fall back to indexFile (404 is handled client-side)
  app.use(function(req, res, next) {
    res.setHeader('Content-Type', 'text/html');
    res.send(self.indexFile);
  });
};

ExplorerUI.prototype.filterIndexHTML = function(data) {
  var transformed = data;
  if (this.routePrefix !== '') {
    transformed = transformed.replace('<base href="/"', '<base href="/' + this.routePrefix + '/"');
  }
  return transformed;
};

module.exports = ExplorerUI;

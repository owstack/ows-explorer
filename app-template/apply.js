#!/usr/bin/env node

'use strict';

var configDir = process.argv[2] || 'ows-explorer';

var fs = require('fs-extra');
var path = require('path');

function copyDir(from, to) {
  console.log('Copying dir ' + from + ' to ' + to);
  if (fs.existsSync(to)) fs.removeSync(to); // remove previous app directory
  if (!fs.existsSync(from)) return; // nothing to do
  fs.copySync(from, to);
}

// Read configuration
var configBlob = fs.readFileSync(configDir + '/appConfig.json', 'utf8');
var config = JSON.parse(configBlob, 'utf8');
console.log('Applying ' + config.nameCase + ' template');

// Create image resources
console.log('Creating resources for ' + config.nameCase);
var execSync = require('child_process').execSync;
execSync('sh ./generate.sh ' + configDir, { cwd: '../util/resources', stdio: [0,1,2] });
console.log('Done creating resources');

// Move assets
copyDir('../resources/' + configDir + '/img', '../www/img/r');

console.log("apply.js finished.\n\n");

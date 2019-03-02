#!/usr/bin/env node
'use strict';

var execSync = require('child_process').execSync;
var fs = require('fs-extra');

function copyDir(from, to) {
  console.log('Copying dir ' + from + ' to ' + to);

  if (!fs.existsSync(from)) {
    return;
  }
  if (fs.existsSync(to)) {
    fs.removeSync(to);
  }

  fs.copySync(from, to);
}

var defaultDist = '@owstack/ows-explorer'; // Configure for ows-explorer by default

var templates = {
  'index-template.html': 'app/'
};

var configDir = process.argv[2];
if (!fs.existsSync(configDir)) {
  console.log('* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *');
  console.log('No distribution file found. Use \'npm run set-dist <app-template>\' to set a distribution.');
  console.log('Setting default distribution: ' + defaultDist);
  console.log('* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *');
  execSync('npm run set-dist ' + defaultDist, { stdio: [0,1,2] });
  configDir = defaultDist;
}

var JSONheader = '{ ' + "\n" + '  "//": "Changes to this file will be overwritten, modify it at app-template/ only.",';
var HTTPheader = '<!-- Changes to this file will be overwritten, modify it at app-template/ only. -->\n<';

var configBlob = fs.readFileSync(configDir + '/app.config.json', 'utf8');
var config = JSON.parse(configBlob, 'utf8');

console.log('Applying ' + config.nameCase + ' template');

// Generate image resources from sketch
console.log('Creating resources for ' + config.nameCase);
execSync('sh ./generate.sh ' + configDir, { cwd: '../util/resources', stdio: [0,1,2] });
console.log('Done creating resources');

// Replace key-value strings in template files and add installable plugins to package.json
console.log('Configuring application...');
Object.keys(templates).forEach(function(k) {
  var targetDir = templates[k];
  console.log(' #    ' + k + ' => ' + targetDir);

  var content = fs.readFileSync(k, 'utf8');

  if (k.indexOf('.json') > 0) {
    content = content.replace('{', JSONheader);
  }
  if (k.indexOf('.html') > 0) {
    content = content.replace('<', HTTPheader);
  }

  // Replace placeholders in template file with values from config.
  Object.keys(config).forEach(function(k) {
    if (k.indexOf('_') == 0) {
      return;
    }

    var r = new RegExp("\\*" + k.toUpperCase() + "\\*", "g");
    content = content.replace(r, config[k]);
  });

  var r = new RegExp("\\*[A-Z]{3,30}\\*", "g");
  var s = content.match(r);
  if (s) {
    console.log('UNKNOWN VARIABLE', s);
    process.exit(1);
  }

  // Remove any template designation from file name
  k = k.replace('-template', '');

  // Write the target file.
  if (!fs.existsSync('../' + targetDir)) {
    fs.mkdirSync('../' + targetDir);
  }
  fs.writeFileSync('../' + targetDir + k, content, 'utf8');
});

console.log('Done configuring application');




// Create www directory
if (!fs.existsSync('../www')) {
  fs.mkdirSync('../www');
}

// Move assets
copyDir('../resources/' + configDir + '/img', '../app/assets/img');
copyDir(configDir + '/fonts', '../app/assets/fonts');
copyDir(configDir + '/css', '../app/shared/css/overrides');
copyDir(configDir + '/sound', '../app/assets/sound');
fs.copySync('robots.txt', '../www/robots.txt');

// Done
console.log("apply.js finished. \n\n");

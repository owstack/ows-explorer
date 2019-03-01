const config = require('config');
const Service = require('./lib/service');
const service = new Service(config);

service.start();

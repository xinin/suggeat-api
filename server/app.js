/**
 * Main application file
 */

'use strict';

let AppBBVA = require(__dirname + '/components/App');
let config = AppBBVA.Config();
process.env.NODE_ENV = config.env;
let app = AppBBVA.launch();
module.exports = app;

/**
 *	App file - ties all the modules together
 */

// dependencies
const express = require('express');
const path = require('path');
const app = express();
const port = 3000;


// load middleware to display requests
const Middleware = require("./app/middleware.js");
app.use(Middleware.showRequests);

// make whole dir 'public' for testing
app.use(express.static('../../'));
// base dir
const globals = require('../../assets/js/globals.js');
app.use('/files', express.static(globals.BASE_PATH));


// require routes file and pass context
require('./app/routes')(app);

// export app for server, server-http, heroku, etc.
module.exports = [app, port];

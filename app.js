/**
 *	App file - ties all the modules together
 */

// dependencies
const express = require('express');
const path = require('path');
const app = express();

// load middleware to display requests
const Middleware = require("./app/middleware.js");
app.use(Middleware.showRequests);

// public directory
app.use(express.static(__dirname + '/public'));
// base dir
const basePath = '/Users/owenmundy/Dropbox (Davidson College)/Sneakaway Studio/Chasing the Sun/Artwork/UTC-ORIGINALS';
app.use('/files', express.static(basePath));


// require routes file and pass context
require('./app/routes')(app);

// export app for server, server-http, heroku, etc.
module.exports = app;

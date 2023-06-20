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
app.use(express.static('../../randomizer'));
// make special files available inside server
app.use('/api/config.js', express.static('../../config.js'));
// base dir
const CONFIG = require('../../config.js');
app.use('/files', express.static(CONFIG.FULL_SVG_PATH));



// Middleware to turn off caching (having issues with spreadsheet data not refreshing)
const nocache = require('nocache');
app.use(nocache());



// require routes file and pass context
require('./app/routes')(app);

// export app for server, server-http, heroku, etc.
module.exports = [app, port];

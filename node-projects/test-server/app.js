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
const assetBasePath = '/Users/owenmundy/Dropbox (Davidson College)/Sneakaway Studio/Chasing the Sun/Artwork/UTC-ORIGINALS';
app.use('/files', express.static(assetBasePath));


// require routes file and pass context
require('./app/routes')(app);

// export app for server, server-http, heroku, etc.
module.exports = [app, port];

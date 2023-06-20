/**
 *	Server HTTPS - Require and start running app as server - A version that runs HTTPS
 */

// require main app and port (using destructuring)
const [app, port] = require('./app');

// HTTPS dependencies
const https = require('https');
const fs = require('fs');
var key = fs.readFileSync('/private/etc/apache2/server.key');
var cert = fs.readFileSync('/private/etc/apache2/server.crt');
var options = {
	key: key,
	cert: cert
};

// use HTTPS to create server
var server = https.createServer(options, app);
// start listening for requests
server.listen(port, () => {
	console.log(`Randomizer is live at this address: https://localhost:${port}/randomizer`);
});

// export app for heroku
module.exports = app;

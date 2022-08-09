/**
 *	Server - Require and start running app as server
 */

// require main app and port (using destructuring)
const [app, port] = require('./app');

// start listening for requests
app.listen(port, () => {
	console.log(`Go to this url to access randomizers http://localhost${port}:/randomizers/`);
});

// export app
module.exports = app;

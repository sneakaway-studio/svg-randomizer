/**
 *	Server - Require and start running app as server
 */

// require main app and port (using destructuring)
const [app, port] = require('./app');

// start listening for requests
app.listen(port, () => {
	console.log(`Randomizer is live at this address: http://localhost:${port}/randomizers/`);
});

// export app
module.exports = app;

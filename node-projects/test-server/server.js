/**
 *	Server - Require and start running app as server
 */

// require main app and port (using destructuring)
const [app, port] = require('./app');

// start listening for requests
app.listen(port, () => {
	console.log(`Example app listening at http://localhost:${port}`);
});

// export app
module.exports = app;

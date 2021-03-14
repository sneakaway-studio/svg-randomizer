/**
 *	Server - Require and start running app as server
 */

// require main app
const app = require('./app');
// set port
const port = process.env.PORT || 3000;

// start listening for requests
app.listen(port, () => {
	console.log(`Example app listening at http://localhost:${port}`);
});

// export app
module.exports = app;

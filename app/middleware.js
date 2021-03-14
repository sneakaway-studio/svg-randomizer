/**
 *	Middleware module - helper functions for your application
 */

var exports = module.exports = {};

const ignorePatterns = [
	"/assets/",
	"/favicon",
	".svg",
];

// function to show all requests
exports.showRequests = (req, res, next) => {
	let log = true;
	// ignore
	for (let i = 0; i < ignorePatterns.length; i++) {
		if (req.originalUrl.includes(ignorePatterns[i])) log = false;
	}
	if (log) {
		// start
		console.log(`\nRequest ${req.method} ${req.originalUrl} [STARTED] from ${req.ip}`, new Date().toLocaleString());
		// close
		res.on('close', () => {
			console.log(`Request ${req.method} ${req.originalUrl} [CLOSED] from ${req.ip}`, new Date().toLocaleString());
		});
	}
	// invoke next middleware function
	next();
};

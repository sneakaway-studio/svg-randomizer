/**
 *	Functions used across the project
 */

var exports = module.exports = {};

/**
 *	Return a random integer between min and max
 */
exports.getRandomInt = (min, max) => {
	try {
		return Math.floor(Math.random() * (max - min)) + min;
	} catch (err) {
		console.error(err);
	}
};


/**
 *	Generic error handler
 */
exports.handleErrors = (response) => {
	if (!response.ok) {
		throw Error(response.statusText);
	}
	return response;
};
// // test the above function
// var fetch = require('node-fetch');
// fetch("http://httpstat.us/500")
// 	.then(exports.handleErrors)
// 	.then(response => console.log("ok"))
// 	.catch(error => console.log(error));

/**
 *	Routes module - all the website and api endpoints
 */

const fs = require('fs').promises;
const path = require('path');

var exportPaths = require('../../export-paths');


async function getDataFromSheet() {
	// run export-google-sheets
	let d = await exportPaths.getData();
	// console.log("getDataFromSheet()");
	// console.log(d);
	return d;
}
async function getLocalJson(filePath) {
	let data = await fs.readFile(filePath, 'utf8');
	return data;
}


module.exports = function(app) {

	/////////// WEBSITE ROUTES ///////////

	// website home page
	app.get('/', (req, res) => {
		 res.sendFile(path.resolve((__dirname +'../../../../randomizers/index.html')));
	});



	/////////// API ROUTES ///////////

	// api endpoint
	app.get('/api', (req, res) => {
		res.status(200).json({
			message: "hello"
		});
	});

	// get remote data from google sheet
	app.get('/api/refreshLocalDataFromSheet', async (req, res) => {
		let result = await getDataFromSheet();
		// return the data
		res.status(200).json(result);
	});

	// get local data
	app.get('/api/getLocalData', async (req, res) => {
		let data = await getLocalJson('../export-paths/data/data-all.json');
		// console.log(1,data);
		// parse the serialized json
		data = JSON.parse(data);
		// console.log(2,data);
		// return the data
		res.status(200).json(data);
	});




};

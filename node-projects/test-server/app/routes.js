/**
 *	Routes module - all the website and api endpoints
 */



module.exports = function(app) {


	/////////// WEBSITE ROUTES ///////////

	// website home page
	app.get('/', (req, res) => {
		// render page
		res.render('home', {

		});
	});

	/////////// API ROUTES ///////////

	// api endpoint
	app.get('/api', (req, res) => {
		res.status(200).json({
			message: "hello"
		});
	});

	// // get directory list
	// app.get('/api/getFilenames', async (req, res) => {
	// 	res.status(200).json(await dataSource.getFilenames());
	// });
	//
	// // get all data
	// app.get('/api/getData', async (req, res) => {
	// 	res.status(200).json(await
	//
	//
	// 			 fs.readFile('../../export-google-sheets/data/chasing-the-sun-data.json', 'utf8', (err, data) => {
	// 				if (err) throw err;
	// 				console.log(data);
	// 				return data;
	// 			});
	//
	//
	// 	);
	// });
	//
	// // get all files
	// app.get('/api/getFiles', async (req, res) => {
	// 	res.status(200).json(await dataSource.getFiles());
	// });


};

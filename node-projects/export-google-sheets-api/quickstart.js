const fs = require('fs');
const path = require('path');
const readline = require('readline');
const {
	google
} = require('googleapis');

// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly'];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = path.resolve(__dirname, 'token.json');



var exports = module.exports = {};

// export so we can call it as a module in another script
exports.main = async () => {
	// promisfy so calling script can await
	return new Promise((resolve, reject) => {
		// console.log("quickstart.main() called ");

		// Load client secrets from a local file.
		fs.readFile(path.resolve(__dirname, 'credentials.json'), (err, content) => {
			if (err) return console.log('Error loading client secret file:', err);
			// Authorize a client with credentials, then call the Google Sheets API.
			authorize(JSON.parse(content), handleData);
			setTimeout(function(){
				resolve();
			},2000);
		});
	});
};
// exports.main();

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(credentials, callback) {
	const {
		client_secret,
		client_id,
		redirect_uris
	} = credentials.installed;
	const oAuth2Client = new google.auth.OAuth2(
		client_id, client_secret, redirect_uris[0]);

	// Check if we have previously stored a token.
	fs.readFile(TOKEN_PATH, (err, token) => {
		if (err) return getNewToken(oAuth2Client, callback);
		oAuth2Client.setCredentials(JSON.parse(token));
		callback(oAuth2Client);
	});
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback for the authorized client.
 */
function getNewToken(oAuth2Client, callback) {
	const authUrl = oAuth2Client.generateAuthUrl({
		access_type: 'offline',
		scope: SCOPES,
	});
	console.log('Authorize this app by visiting this url:', authUrl);
	const rl = readline.createInterface({
		input: process.stdin,
		output: process.stdout,
	});
	rl.question('Enter the code from that page here: ', (code) => {
		rl.close();
		oAuth2Client.getToken(code, (err, token) => {
			if (err) return console.error('Error while trying to retrieve access token', err);
			oAuth2Client.setCredentials(token);
			// Store the token to disk for later program executions
			fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
				if (err) return console.error(err);
				console.log('Token stored to', TOKEN_PATH);
			});
			callback(oAuth2Client);
		});
	});
}



const csv = require('csvtojson');

/**
 * Prints the names and majors of students in a sample spreadsheet:
 * @see https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit
 * @param {google.auth.OAuth2} auth The authenticated Google OAuth client.
 */
function handleData(auth) {
	const sheets = google.sheets({
		version: 'v4',
		auth
	});
	sheets.spreadsheets.values.get({
		// google test file
		// spreadsheetId: '1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms',
		// range: 'Class Data!A2:E',

		// chasing-the-sun-data (old)
		// spreadsheetId: '17otqd9huv10dl6SWly_0plhuYuP6RWqhODJfHhCmk7Y',
		// range: 'times!A4:Z35',

		// CTS-data
		spreadsheetId: '1-VmzIyWNhzmaAiSLaPCoY6ZnJaxl3G_bxcljgXgxWKU',
		range: 'times!A4:J100',

	}, (err, res) => {
		if (err) return console.log('The API returned an error: ' + err);
		const rows = res.data.values;
		if (rows.length) {
			// console.log('Name, Major:');
			// // Print columns A and E, which correspond to indices 0, 4
			// rows.map((row) => {
			// 	console.log(`${row[0]}, ${row[4]}`);
			// });

			// this is where you'll handle the data you return
			// console.log(JSON.stringify(rows));

			// convert from 2D arrays to string to JSON
			csv().fromString(rows.join("\n"))
				.then(function(result) {
					// console.log(result);

					// save json file
					fs.writeFileSync(path.resolve(__dirname, './data/chasing-the-sun-data.json'), JSON.stringify(result));

					// REPORT
					console.log(`🐙 SPREADSHEET EXPORTED ... rows: ${result.length}`);
				});

		} else {
			console.log('No data found.');
		}
	});
}

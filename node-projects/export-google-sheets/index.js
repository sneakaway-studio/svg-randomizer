
const fetch = require('node-fetch');
const d3 = require('d3');
const fs = require('fs');


// 1. Install code and setup your spreadsheet
// - It must be publicly accessible and published to the web
// - To prevent formatting errors, add a "placeholder" column with empty data on the very last column
// - Run 'npm i' in this directory

// 2. Define the spreadsheet URL
// - More about parameters in the url
// https://sites.google.com/view/metricrat-ai2/guides/use-gviz-to-get-and-query-google-sheet-data
// - More about defining a query
// https://developers.google.com/chart/interactive/docs/querylanguage

const spreadsheet = {
	name: 'chasing the sun data', // for reference only
	id: '1-VmzIyWNhzmaAiSLaPCoY6ZnJaxl3G_bxcljgXgxWKU', // from the url
	out: 'csv', // the default is json
	sheet: 'time', // the "tab"
	range: 'A4:S200', // !!
	query: '' // e.g. select+A,SUM(B)+offset+1
};

const url = `https://docs.google.com/spreadsheets/d/${spreadsheet.id}/gviz/tq?tqx=out:${spreadsheet.out}&sheet=${spreadsheet.sheet}&range=${spreadsheet.range}&query=${spreadsheet.query}`;



// 3. Fetch and return JSON data

var exports = module.exports = {};

exports.getData = async () => {

	let csv;

	await fetch(url)
		.then(d => d.text())
		.then(rows => {
			// console.log(rows);

			csv = d3.csvParse(rows);
			// console.log(csv[0]);

			// console.log(d3.csvParseRows(content));

		});


	return csv;
};
// exports.getData();


// 4. Import this in your program with
// let importSpreadsheet = require('export-google-sheets');
// let data = importSpreadsheet.getData();


// async function d(){
// 	let importSpreadsheet = require('../export-google-sheets');
// 	let data = await importSpreadsheet.getData();
// 	console.log(data[1]);
// }
// d();

/**
 *	Write all the filenames
 */

const fs = require('fs').promises;
const path = require('path');

// leave the project to get the files lib
var FS_Files = require("../../../om-functions-js/lib/fs-files");

const CONFIG = require('../../config.js');
const fullSVGPath = CONFIG.FULL_SVG_PATH;

let DEBUG = true;

var exports = module.exports = {};

// 1. Get data from Google sheets...
async function getDataFromGoogleSheets() {
	// spreadsheet
	// https://docs.google.com/spreadsheets/d/1-VmzIyWNhzmaAiSLaPCoY6ZnJaxl3G_bxcljgXgxWKU/edit#gid=225781419


	// a. Method using Google API: (has issue because Google increased their security)
	/*
	// require file
	const exportGoogleSheets = require('../export-google-sheets/quickstart.js');
	// run export-google-sheets
	await exportGoogleSheets.main();
	// get downloaded file and parse json data
	dataArr = JSON.parse(await fs.readFile('../export-google-sheets/data/chasing-the-sun-data.json', 'utf8'));
	*/


	// b. Method using a public Google sheet and CSV:
	// require file
	const exportGoogleSheets = require('../export-google-sheets');
	// run export-google-sheets
	return await exportGoogleSheets.getData();
	// console.log(dataArr);
}


/**
 * Main function to get data, called from outside module
 */
exports.getData = async (all = false) => {

	let dataArr = [],
		finalObj = {};


	// 1. GET DATA

	console.log(`\n############################# EXPORT-PATHS #################################`);
	try {
		dataArr = await getDataFromGoogleSheets();
	} catch (err) {
		console.error("❌ getDataFromGoogleSheets() failed", err);
	}
	// make sure data is imported
	if (!dataArr) {
		console.error("❌ NO DATA FOUND");
		return;
	}
	console.log(`1. GET DATA ✅ => rows found = ${dataArr.length}`);



	// 2. PREPARE DATA (loop through timezones, check that it should be included)

	let totalRecordsInSpreadsheet = dataArr.length,
		assetsFoundPerRowTotal = 0,
		currentTZ = "";

	if (!all) {
		// first loop (in reverse) to remove those we don't want ...
		for (var i = dataArr.length - 1; i >= 0; i--) {
			// console.log(dataArr[i]);
			// skip if no location data or the "include" flag is not set
			if (!dataArr[i].location || !dataArr[i].include) {
				dataArr.splice(i, 1);
			}
		}
		console.log(`2. CHECK DATA ✅ => using ${dataArr.length} (out of ${totalRecordsInSpreadsheet} total) rows`);
	} else {
		console.log(`2. CHECK DATA ✅ => using ALL ${dataArr.length} rows`);
	}


	// 3. LOOP

	try {
		// loop through all rows
		for (let i = 0; i < dataArr.length; i++) {
			if (!dataArr[i]) continue;
			if (i > 2) break; // testing

			// new timezone?
			if (currentTZ !== dataArr[i].dir) {
				currentTZ = dataArr[i].dir;

				// log if there is data
				// if (dataArr[i].location !== undefined) console.log(currentTZ);
			}
			let key = `${currentTZ}-${dataArr[i].num}-${dataArr[i].location}-${dataArr[i].object}`;


			finalObj[key] = {
				// original items
				offset24: dataArr[i].offset24 || "",
				dir: dataArr[i].dir || "",
				offsetUTC: dataArr[i].offsetUTC || "",
				num: dataArr[i].num || "",
				location: dataArr[i].location || "",
				object: dataArr[i].object || "",
				plant: dataArr[i].plant || "",
				include: Number(dataArr[i].include) || 1,
				bgColor: dataArr[i].bgColor || 'ffffff',
				bgGrad1: dataArr[i].bgGrad1 || 'ffffff',
				bgGrad2: dataArr[i].bgGrad2 || 'ffffff',
				bgGrad3: dataArr[i].bgGrad3 || 'ffffff',
				scale: dataArr[i].scale || 50,

				// add later
				fileCount: 0,
				filePath: '',
				fileNames: []
			};



			// 3. GET ALL ASSET PATHS

			// override so links to test files works
			// finalObj[key].filePath = `UTC-ORIGINALS-SVG/21+03/01/${dataArr[i].object}/SVG`;
			// change path in CONFIG so it works on Owen's Macbook Pro and Joelle's Mac Pro
			// console.log(`CONFIG.SVG_DIR = ${CONFIG.SVG_DIR}`);
			finalObj[key].filePath = `${CONFIG.SVG_DIR}/${dataArr[i].dir}/${dataArr[i].num}/${dataArr[i].object}/SVG/`;



			// fileNames
			// console.log(`Look up filenames ${fullSVGPath}/${finalObj[key].filePath}`);
			finalObj[key].fileNames = await FS_Files.getFilesInDir(`${fullSVGPath}/${finalObj[key].filePath}`, "files", "fileExts", ".svg");

			if (!finalObj[key].fileNames || finalObj[key].fileCount < 0) {
				console.warn("3. LOOP ❌ => row: ${i} - ${key} Skipping directory / files found = 0", finalObj[key].fileNames);
				// continue;
				throw new Error("NO FILES FOUND")
			}
			console.log(`3. LOOP ${i} ✅ => ${finalObj[key].fileNames.length} files in ${key}`);

			// fileCount
			finalObj[key].fileCount = finalObj[key].fileNames.length;



			// console.log(dataArr[i])

			// add to count for report
			assetsFoundPerRowTotal += finalObj[key].fileCount;
		}
		// console.log(finalObj);

	} catch (err) {
		console.error("3. LOOP ❌ ERROR", err);
	}



	// 4. WRITE THE DATA
	if (all){
		await fs.writeFile(path.resolve(__dirname, './data/data-all.json'), JSON.stringify(finalObj));
		console.log(`4. WRITE DATA ✅ => to file: './data/data-all.json'`);
	}
	else{
		await fs.writeFile(path.resolve(__dirname, './data/data-tz.json'), JSON.stringify(finalObj));
		console.log(`4. WRITE DATA ✅ => to file: './data/data-tz.json'`);
	}



	// 5. REPORT
	try {
		// make the report a little nicer by removing the long list of files
		let temp = JSON.parse(JSON.stringify(finalObj));
		for (var o in temp) {
			temp[o].fileNames = `${temp[o].fileNames.length} files`;
		}
		// console.log(temp);
		console.log(`5. REPORT ✅ => to file: 🐋 DATA EXPORT FINISHED ... rows: ${Object.keys(finalObj).length}, assets: ${assetsFoundPerRowTotal}`);
	} catch (err) {
		console.error("5. REPORT ❌ ERROR", err);
	}



	console.log(`#############################################################################\n`);
	return finalObj;

};
// exports.getData(true);






async function getColorsFromSVG(path) {
	// fs.readFile(dirPath + file, 'utf8', (err, data) => {
	// 	if (err) {
	// 		console.error(err);
	// 		return;
	// 	}
	// 	// console.log(data);
	// 	let matches = data.match(/#([0-9a-f]{6})/gi);
	// 	if (matches.length > 0) {
	// 		console.log("matches", matches);
	// 		for (let i = 0; i < matches.length; i++) {
	// 			if (!colors.includes(matches[i]))
	// 				colors.push(matches[i]);
	// 		}
	// 	}
	//
	// });
}



function removeArrayDuplicates(arr) {
	return [...new Set(arr)];
}

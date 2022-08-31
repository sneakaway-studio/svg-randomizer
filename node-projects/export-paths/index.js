/**
 *	Write all the filenames
 */

const fs = require('fs').promises;
const path = require('path');

const CONFIG = require('../../config.js');
const fullSVGPath = CONFIG.FULL_SVG_PATH;

var exports = module.exports = {};



async function getDataFromGoogleSheets() {

	// spreadsheet
	// https://docs.google.com/spreadsheets/d/1-VmzIyWNhzmaAiSLaPCoY6ZnJaxl3G_bxcljgXgxWKU/edit#gid=225781419




	// the google sheets api method ...
	// // require file
	// const exportGoogleSheets = require('../export-google-sheets/quickstart.js');
	// // run export-google-sheets
	// await exportGoogleSheets.main();
	// // get downloaded file and parse json data
	// dataArr = JSON.parse(await fs.readFile('../export-google-sheets/data/chasing-the-sun-data.json', 'utf8'));



	// the google-sheets as CSV method

	// require file
	const exportGoogleSheets = require('../export-google-sheets');
	// run export-google-sheets
	return await exportGoogleSheets.getData();
	// console.log(dataArr);




}








exports.getData = async () => {
	try {





		let dataArr = [],
			finalObj = {};



		dataArr = await getDataFromGoogleSheets();

		// make sure data is imported
		if (!dataArr) {
			console.error("NO DATA FOUND");
			return;
		}



		// 2. LOOP THROUGH ALL TIMEZONES

		let totalRecordsInSpreadsheet = dataArr.length,
			assetsFoundPerRowTotal = 0,
			currentTZ = "";



		// first loop (in reverse) to remove those we don't want ...
		for (var i = dataArr.length - 1; i >= 0; i--) {
			// console.log(dataArr[i]);
			// skip if no location data or the "include" flag is not set
			if (!dataArr[i].location || !dataArr[i].include) {
				dataArr.splice(i, 1);
			}
		}
		console.log(`\n#############################################################################`);
		console.log(`Compiling ${dataArr.length} (out of ${totalRecordsInSpreadsheet} total) rows`);
		console.log(`#############################################################################\n`);


		// loop through all rows
		for (let i = 0; i < dataArr.length; i++) {
			if (!dataArr[i]) continue;

			// new timezone?
			if (currentTZ !== dataArr[i].dir) {
				currentTZ = dataArr[i].dir;

				// log if there is data
				// if (dataArr[i].location !== undefined) console.log(currentTZ);
			}
			let key = `${currentTZ}-${dataArr[i].num}-${dataArr[i].location}-${dataArr[i].object}`;

			// console.log(`${i} - ${key}`);
			// console.log(dataArr[i]);


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

			// test path on Owen's Macbook Pro (override)
			if (CONFIG.USE_TEST_SVG_DIR)
				finalObj[key].filePath = `UTC-ORIGINALS_03-03_01/${dataArr[i].object}/SVG/`;
			else // Joelle's Mac Pro
				finalObj[key].filePath = `${dataArr[i].dir}/${dataArr[i].num}/${dataArr[i].object}/SVG/`;

			// fileNames
			// console.log(`add the filenames ${fullSVGPath}/${finalObj[key].filePath}`);
			finalObj[key].fileNames = await getFilesInDir(`${fullSVGPath}/${finalObj[key].filePath}`);
			// fileCount
			finalObj[key].fileCount = finalObj[key].fileNames.length;



			// console.log(dataArr[i])

			// add to count for report
			assetsFoundPerRowTotal += finalObj[key].fileCount;
		}
		// console.log(finalObj);



		// 3. WRITE THE DATA
		await fs.writeFile(path.resolve(__dirname, './data/all-data.json'), JSON.stringify(finalObj));



		// 4. REPORT

		// make the report a little nicer by removing the long list of files
		let temp = JSON.parse(JSON.stringify(finalObj));
		for (var o in temp) {
			temp[o].fileNames = `${temp[o].fileNames.length} files`;
		}
		console.log(temp);
		console.log(`🐋 DATA EXPORT FINISHED ... rows: ${Object.keys(finalObj).length}, assets: ${assetsFoundPerRowTotal}\n\n`);


		return finalObj;

	} catch (err) {
		console.error(err);
	}
};
// exports.getData();



/**
 *	Return an array with all the files in a directory
 */
async function getFilesInDir(dirPath) {
	// console.log(dirPath);
	let arr = [];

	// read files in directory
	await fs.readdir(dirPath).then(files => {
		// console.log(files.length, files);

		files.sort().forEach(file => {
			if (ignoredFiles(file)) return;
			// console.log(dirPath + file);
			arr.push(file);
		});
	}).catch(err => console.error("ERROR in getFilesInDir()", err));

	return arr;
}
/**
 *	Return true if filename (string) should be ignored
 */
function ignoredFiles(str, add) {
	try {
		// hidden files
		if (/^\..*/.test(str)) return true;
		// "_meta" files
		if (/^_/.test(str)) return true;
	} catch (err) {
		console.error(err);
	}
}



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


/**
 *	Return all the file or folder names in directory - AN OLD VERSION ?
 */
const getFilenames = async () => {
	let dirs = [];
	// loop through top level
	fs.readdirSync(fullSVGPath).sort()
		.forEach(file => {
			if (ignoredFiles(file)) return;
			// console.log(file);
			// console.log(importPath + file);
			dirs.push(file);
		}).catch(err => console.error("ERROR in getFilenames()", err));
	// console.log(dirs.join("\n"));
	return dirs;
};




function removeArrayDuplicates(arr) {
	return [...new Set(arr)];
}

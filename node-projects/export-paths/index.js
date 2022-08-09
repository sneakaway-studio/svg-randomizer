/**
 *	Write all the filenames
 */


const fs = require('fs').promises;
const path = require('path');

const globals = require('../../randomizers/assets/globals.js');
const basePath = globals.BASE_PATH;

let finalObj = {},
	dataArr = [];

// MAIN
async function main() {
	console.log(`\n#############################################################################`);



	// 1. UPDATE DATA

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
	dataArr = await exportGoogleSheets.getData();
	// console.log(dataArr);

	// make sure data is imported
	if (!dataArr) {
		console.log("NO DATA FOUND");
		return;
	}





	// 2. LOOP THROUGH ALL TIMEZONES

	let assetsFoundPerRow = 0,
		assetsFoundPerRowTotal = 0,
		currentTZ = "";

	// loop through all rows
	for (let i = 0; i < dataArr.length; i++) {
		if (!dataArr[i]) continue;

		// skip if no data
		if (!dataArr[i].location) continue;
		// only include those marked
		if (!dataArr[i].include) continue;

		// new timezone?
		if (currentTZ !== dataArr[i].dir) {
			currentTZ = dataArr[i].dir;

			// log if there is data
			// if (dataArr[i].location !== undefined) console.log(currentTZ);
		}
		let key = `${currentTZ}-${dataArr[i].num}-${dataArr[i].location}-${dataArr[i].object}`;
		// console.log("   ", key);

		finalObj[key] = {
			location: dataArr[i].location,
			plant: dataArr[i].plant,
			fileCount: 0,
			filePath: '',
			fileNames: [],
			colors: [],
			scaleFactor: 1
		};



		// 3. GET ALL ASSET PATHS

		// reset
		assetsFoundPerRow = 0;

		// add the path
		finalObj[key].filePath = `${dataArr[i].dir}/${dataArr[i].num}/${dataArr[i].object}/SVG/`;
		// add the filenames
		finalObj[key].fileNames = await getFilesInDir(`${basePath}/${finalObj[key].filePath}`);
		// add count
		finalObj[key].fileCount = finalObj[key].fileNames.length;
		// add colors
		if (dataArr[i].hex1) finalObj[key].colors.push(dataArr[i].hex1);
		if (dataArr[i].hex2) finalObj[key].colors.push(dataArr[i].hex2);
		if (dataArr[i].hex3) finalObj[key].colors.push(dataArr[i].hex3);
		// add scale
		if (dataArr[i].scaleFactor) finalObj[key].scaleFactor = dataArr[i].scaleFactor;

// console.log(dataArr[i])

		// add to count for report
		assetsFoundPerRowTotal += finalObj[key].fileCount;

	}
	console.log(finalObj);

	// 3. WRITE THE DATA
	await fs.writeFile(path.resolve(__dirname, './data/all-data.json'), JSON.stringify(finalObj));

	// 4. REPORT
	console.log(`🐋 DATA EXPORT FINISHED ... rows: ${Object.keys(finalObj).length}, assets: ${assetsFoundPerRowTotal}`);

	console.log(`#############################################################################\n`);
}
main();


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
	}).catch(err => console.error("ERROR in getFilesInDir()",err));

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
	fs.readdirSync(basePath).sort()
		.forEach(file => {
			if (ignoredFiles(file)) return;
			// console.log(file);
			// console.log(importPath + file);
			dirs.push(file);
		}).catch(err => console.error("ERROR in getFilenames()",err));
	// console.log(dirs.join("\n"));
	return dirs;
};




function removeArrayDuplicates(arr) {
	return [...new Set(arr)];
}

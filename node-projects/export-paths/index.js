/**
 *	Write all the filenames
 */

const fs = require('fs').promises;
const path = require('path');
const exportGoogleSheets = require('../export-google-sheets/quickstart.js');

const
	basePath = '/Users/owenmundy/Dropbox (Davidson College)/Sneakaway Studio/Chasing the Sun/Artwork/UTC-ORIGINALS',
	assetFilesArr = {
		'p1': `plants-svg/01/SVG/`,
		'h1': `house-svg/01/SVG/`,
		'p2': `plants-svg/02/SVG/`,
		'h2': `house-svg/02/SVG/`,
		'p3': `plants-svg/03/SVG/`,
		'h3': `house-svg/03/SVG/`,
	};

let dataArr = [];

// MAIN
async function main() {

	let assetsFound = 0,
		assetsFoundTotal = 0;

	// 1. UPDATE DATA

	// run export-google-sheets
	await exportGoogleSheets.main();
	// get downloaded file and parse json data
	dataArr = JSON.parse(await fs.readFile('../export-google-sheets/data/chasing-the-sun-data.json', 'utf8'));
	// console.log(dataArr);

	// make sure data is imported
	if (!dataArr) {
		console.log("NO DATA FOUND");
		return;
	}

	// 2. GET ALL ASSET PATHS

	// loop through all rows (backwards so we can remove those we don't want to keep)
	for (let i = dataArr.length; i >= 0; i--) {
		// console.log(dataArr[i]);
		// reset
		assetsFound = 0;
		// loop through all potential asset files to store
		for (let assetPath in assetFilesArr) {
			// if the value is set and > 0
			if (dataArr[i] && dataArr[i][assetPath] && Number(dataArr[i][assetPath]) > 0) {
				// console.log(dataArr[i].location1, assetPath);

				// add the path
				dataArr[i][assetPath + "FilesPath"] = `${dataArr[i].dir}/${assetFilesArr[assetPath]}`;
				// add the filenames
				dataArr[i][assetPath + "Files"] = await getFilesInDir(`${basePath}/${dataArr[i][assetPath + "FilesPath"]}`);
				// add to count for report
				assetsFound += dataArr[i][assetPath + "Files"].length;
			}
		}
		if (assetsFound === 0)
			// if no assets were added then delete this one
			dataArr.splice(i, 1);
		else
			assetsFoundTotal += assetsFound;
	}
	// console.log(dataArr);

	// 3. WRITE THE DATA
	await fs.writeFile(path.resolve(__dirname, './data/all-data.json'), JSON.stringify(dataArr));

	// 4. REPORT
	console.log(`
#############################################################################
🐋 DATA EXPORT FINISHED ... rows: ${dataArr.length}, assets: ${assetsFoundTotal}
#############################################################################
`);

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
	});

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
		});
	// console.log(dirs.join("\n"));
	return dirs;
};




function removeArrayDuplicates(arr) {
	return [...new Set(arr)];
}

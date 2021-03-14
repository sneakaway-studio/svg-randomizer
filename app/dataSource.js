/**
 *	Return list of files for API
 */

const fs = require('fs-extra');
const path = require('path');
const csv = require('csvtojson');

const
	csvFilePath = './data/chasing-the-sun-data - times.csv',
	basePath = '/Users/owenmundy/Dropbox (Davidson College)/Sneakaway Studio/Chasing the Sun/Artwork/UTC-ORIGINALS',
	// basePath = `/Users/owenmundy/Dropbox\ \(Davidson\ College\)/Sneakaway\ Studio/Chasing\ the\ Sun/Artwork/UTC-ORIGINALS`,
	svgPath = `plants-svg/01/SVG/`;

let allData = {
	basePath: basePath,
	svgPath: svgPath,
	plants: [{
		colors: [],
		dir: '12-12',
		files: []
	}, {
		colors: [],
		dir: '17+07',
		files: []
	}, {
		colors: [],
		dir: '19+05',
		files: []
	}, {
		colors: [],
		dir: '21+03',
		files: []
	}, ],
	arch: []
};

var exports = module.exports = {};


/**
 *	Return all the file or folder names in directory
 */
exports.getFilenames = async () => {
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

/**
 *	Convert CSV > JSON
 */
exports.convertCSV2JSON = async () => {
	return await csv().fromFile(csvFilePath)
		.then((jsonObj) => {
			// console.log(jsonObj);
			return jsonObj;
		});
};

/**
 *	Return all data
 */
exports.getFiles = async () => {
	return allData;
};


/**
 *	Return an array with all the files in a directory
 */
async function getFilesInDir(dirPath) {
	let arr = [];
	let colors = [];
	// console.log(dirPath);

	// read files
	fs.readdirSync(dirPath).sort()
		.forEach(file => {
			if (ignoredFiles(file)) return;
			// console.log(dirPath + file);
			arr.push(file);

			fs.readFile(dirPath + file, 'utf8', (err, data) => {
				if (err) {
					console.error(err);
					return;
				}
				// console.log(data);
				let matches = data.match(/#([0-9a-f]{6})/gi);
				if (matches.length > 0) {
					console.log("matches", matches);
					for (let i = 0; i < matches.length; i++) {
						if (!colors.includes(matches[i]))
							colors.push(matches[i]);
					}
				}

			});
		});
	return [arr, colors];
}
// /**
//  *	Return an array with all the files in a directory
//  */
// async function getColorsFromSVGsInDir(dirPath) {
// 	let arr = [];
// 	// console.log(dirPath);
//
// 	// read files
// 	fs.readdirSync(dirPath).sort()
// 		.forEach((file) => {
// 			if (ignoredFiles(file)) return;
// 			console.log(dirPath + file);
//
// 			fs.readFile(dirPath + file, 'utf8', (err, data) => {
// 				if (err) {
// 					console.error(err);
// 					return;
// 				}
// 				// console.log(data);
// 				let matches = data.match(/#([0-9a-f]{6})/gi);
// 				if (matches.length > 0) {
// 					console.log("matches", matches);
// 					for (let i = 0; i < matches.length; i++) {
// 						if (!arr.contains(matches[i]))
// 							arr.push(matches[i]);
// 					}
// 				}
//
// 			});
// 		});
//
// 	return arr;
// }

function removeArrayDuplicates(arr) {
	return [...new Set(arr)];
}


/**
 *	Populate all the *.files
 */
async function getFiles() {

	for (let i = 0; i < allData.plants.length; i++) {
		// console.log(item, i);
		[allData.plants[i].files,allData.plants[i].colors] = await getFilesInDir(`${basePath}/${allData.plants[i].dir}/${svgPath}`);
		// allData.plants[i].colors = await getColorsFromSVGsInDir(`${basePath}/${allData.plants[i].dir}/${svgPath}`);
	}

}
getFiles();



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

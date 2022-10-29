const fs = require('fs').promises;
const path = require('path');
const fse = require('fs-extra');


var exports = module.exports = {};

exports.getFilesInDir = getFilesInDir;
exports.ignoredFiles = ignoredFiles;





/**
 *	Return an array with all the files in a directory
 */
async function getFilesInDir(dirPath) {
	// console.log(dirPath);
	let arr = [];

	// does the directory exist?
	let fileExists = await fse.pathExists(dirPath);
	if (!fileExists) return;

	// read files in directory
	await fs.readdir(dirPath).then(files => {
		// console.log(files.length, files);

		files.sort().forEach(file => {
			if (ignoredFiles(file)) return;
			// console.log(dirPath + file);
			arr.push(file);
		});
	}).catch(err => {
		// console.error("ERROR in getFilesInDir()", err);
	});
	// console.log(arr);
	return arr;
}
// getFilesInDir("./");


/**
 *	Return true if filename (string) should be ignored
 */
function ignoredFiles(str, add) {
	// hidden files
	if (/^\..*/.test(str)) return true;
	// "_meta" files
	else if (/^_/.test(str)) return true;
	// default
	return false;
}

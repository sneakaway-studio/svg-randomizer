/**
 *	Convert an SVG to ____ [PNG|JPG|?]
 *	See README.md for info
 */

const sharp = require("sharp");
var FS_Files = require("../om-functions-js/fs-files");
const fse = require('fs-extra');

const inputFilesPath = '../../tests/sample-svg-input/UTC-ORIGINALS_03-03_01/';
const outputFilesPath = inputFilesPath;

/**
 *	Convert SVG > PNG
 */
async function convertSVG2PNG(basePath, filename, outputPath) {
	sharp(basePath + filename)
		.resize({
			width: 2000,
			height: 2000,
			// fit: sharp.fit.contain
			fit: 'inside'
		})
		.png()
		.toFile(outputPath + filename + ".png")
		.then(function(info) {
			console.log(info);
		})
		.catch(function(err) {
			console.log(err);
		});
}

/**
 *	Main
 */
(async function() {
	try {
		let houseSVGs = `${inputFilesPath}house/SVG/`;
		let housePNGs = `${inputFilesPath}house/PNG/`;
		let plantSVGs = `${inputFilesPath}plant/SVG/`;
		let plantPNGs = `${inputFilesPath}plant/PNG/`;

		// get files
		let inputFilesHouse = await FS_Files.getFilesInDir(houseSVGs);
		let inputFilesPlant = await FS_Files.getFilesInDir(plantSVGs);
		// console.log(inputFilesHouse);

		fse.ensureDirSync(housePNGs);
		inputFilesHouse.forEach((item, i) => {
			console.log(i, item);
			convertSVG2PNG(houseSVGs, item, housePNGs);
		});

		fse.ensureDirSync(plantPNGs);
		inputFilesPlant.forEach((item, i) => {
			console.log(i, item);
			convertSVG2PNG(plantSVGs, item, plantPNGs);
		});


	} catch (e) {
		console.error(e);
	}
})();

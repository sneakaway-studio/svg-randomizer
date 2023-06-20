/**
 *	Convert an SVG to ____ [PNG|JPG|?]
 *	See README.md for info
 */

const sharp = require("sharp");
const fse = require('fs-extra');

const inputFilesPath = '../../tests/sample-svg-input/UTC-ORIGINALS_03-03_01/';
const outputFilesPath = inputFilesPath;

/**
 *	Convert SVG > PNG
 */
async function convertSVG2PNG(inputPath, filename, outputPath, w = 1000, h = 1000) {
	sharp(inputPath + filename)
		.resize({
			width: w,
			height: h,
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

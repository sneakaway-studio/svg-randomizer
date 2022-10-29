/**
 *	Convert an SVG to ____ [PNG|JPG|?]
 *	See README.md for info
 */

const sharp = require("sharp");
const fse = require('fs-extra');

// leave the project to get the
var FS_Files = require("../../../om-functions-js/lib/fs-files");

const testPathBase = '../../tests/sample-svg-input/UTC-ORIGINALS'; // -SVG | -PNG
const testPathSpecific = testPathBase + 'SVG/03-03/01/';
// base dir
const CONFIG = require('../../config.js');
const basePath = CONFIG.FULL_SVG_PATH;


(async function() {
	try {
		// convertTest(testPath);
		convertThenCopyAll(basePath, testPathBase);
	} catch (e) {
		console.error(e);
	}
})();


async function convertThenCopyAll(inputPath) {
	// get directories to convert
	let inputDirs = await FS_Files.getFilesInDir(inputPath);
	// console.log(inputFilesHouse);

	// 00-00/
	for (var i = 0; i < inputDirs.length; i++) {
		let inputSubDir = inputDirs[i];
		console.log(i, inputSubDir);

		// update path
		currentPath = `${inputPath}/${inputSubDir}`;
		// loop through each number in the timezone
		let inputSubDirs = await FS_Files.getFilesInDir(currentPath);

		for (var j = 0; j < inputSubDirs.length; j++) {
			// update path

			let inputSubSubDir = inputSubDirs[j];
			currentPath = `${inputPath}/${inputSubDir}/${inputSubSubDir}`;

			//tests
			// let inputSubSubDirs = await FS_Files.getFilesInDir(currentPath);
			// console.log(i, j, "   ", inputSubSubDir, inputSubSubDir[j]);
			// console.log(currentPath);


			// convert all at current path
			await convertAllAtPath(currentPath, "house");
			await convertAllAtPath(currentPath, "plant");


			FS_Files.copyFiles(
				`${inputPath}/${inputSubDir}/${inputSubSubDir}/house/SVG`,
				`${testPathBase}-SVG/${inputSubDir}/${inputSubSubDir}/house/SVG`
			);
			FS_Files.copyFiles(
				`${inputPath}/${inputSubDir}/${inputSubSubDir}/house/PNG`,
				`${testPathBase}-PNG/${inputSubDir}/${inputSubSubDir}/house/PNG`
			);

			FS_Files.copyFiles(
				`${inputPath}/${inputSubDir}/${inputSubSubDir}/plant/SVG`,
				`${testPathBase}-SVG/${inputSubDir}/${inputSubSubDir}/plant/SVG`
			);
			FS_Files.copyFiles(
				`${inputPath}/${inputSubDir}/${inputSubSubDir}/plant/PNG`,
				`${testPathBase}-PNG/${inputSubDir}/${inputSubSubDir}/plant/PNG`
			);



			// if (j > 2) break;
		}
		// if (i > 0) break;
	}
}
// convert all house and plants in just in one directory
async function convertAllAtPath(inputPath, subdir = "house") {
	// 1. make sure they exist
	if (await !fse.pathExists(`${inputPath}/${subdir}`)) return;
	// 2. save paths
	let svgDir = `${inputPath}/${subdir}/SVG/`;
	let pngDir = `${inputPath}/${subdir}/PNG/`;
	// 3. get list files
	let inputFiles = await FS_Files.getFilesInDir(svgDir);
	// console.log(inputFiles);
	// 4. create directory if it doesn't exist
	fse.ensureDirSync(pngDir);
	// 5. loop through each and create the PNG from SVG
	inputFiles.forEach(async (item, i) => {
		console.log(i, item);
		let w=1000,h=1000;
		if (subdir == "house") {
			w=2500; h=2500;
		}
		await convertSVG2PNG(svgDir, item, pngDir, w, h);
	});
}


// FS_Files.copyFiles(
// 	'/Volumes/GoogleDrive/My\ Drive/Art\ \(Dietrick\ Studio\)/_Artwork\ Process/Chasing\ the\ Sun/Artwork/UTC-ORIGINALS/00-00/02/house/SVG',
// 	'/Users/joelledietrick/Documents/Github/svg-randomizer/tests/sample-svg-input/UTC-ORIGINALS-SVG/00-00/02/house/SVG'
// );


/**
 *	Convert SVG > PNG
 */
async function convertSVG2PNG(inputPath, filename, outputPath, w=1000,h=1000) {
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

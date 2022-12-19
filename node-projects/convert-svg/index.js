/**
 *	Convert an SVG to ____ [PNG|JPG|?]
 *	See README.md for info
 */

const sharp = require("sharp");
const fse = require('fs-extra');

// leave the project to get the files lib
var FS_Files = require("../../../om-functions-js/lib/fs-files");

const testPathBase = '../../tests/sample-svg-input/UTC-ORIGINALS-PNG-TEST'; // -SVG | -PNG
const testPathSpecific = testPathBase + 'SVG/03-03/01/';


const unityPathBase = `/Users/joelledietrick/Documents/Github/CTS-Viz/Assets/Resources/UTC-ORIGINALS`;

// base dir
const CONFIG = require('../../config.js');
const basePath = CONFIG.FULL_SVG_PATH;


const finishedTimezones = [

	"00-00/01",
 	"01-01/02",
	// "02-02/01",
	"03-03/01",
	// "04-04/03",
	// "05-05/03",
	// "06-06/03",
	"07-07/01",
	"08-08/01",
	"09-09/03",
	// "10-10/02",
	"11-11/03",
	"12-12/01",
	// "13+11/02",
	// "15+09/02",
						//"16+08/04",
	// "20+04/01",
	// "21+03/01",




];


(async function() {
	try {
		// original, convert, copy all to get folder structure
		// timezoneLoop(["convert", "copy"], basePath, testPathBase);

		// now that we have folders structure (and Joelle is exporting manually)
		// we can just copy what we want
		// timezoneLoop(["copyPNG"], ["03-03/01"], basePath, testPathBase);

		timezoneLoop(["copyPNG"], finishedTimezones, basePath, unityPathBase);

	} catch (e) {
		console.error(e);
	}
})();


async function timezoneLoop(commands, specificDirectories, inputPath, outputPath) {
	// get directories to convert or copy
	let inputDirs = await FS_Files.getFilesInDir(inputPath, ["folders"]);
	console.log(inputDirs, basePath);


	// LOOP THROUGH TIMEZONES: 00-00, 01-01, ...
	for (var i = 0; i < inputDirs.length; i++) {
		let inputSubDir = inputDirs[i];



		// update path
		currentPath = `${inputPath}/${inputSubDir}`;
		// loop through each number in the timezone
		let inputSubDirs = await FS_Files.getFilesInDir(currentPath, ["folders"]);
		console.log(i, inputSubDir, inputSubDirs);



		// LOOP THROUGH VERSIONS: 01, 02, 03, ...
		for (var j = 0; j < inputSubDirs.length; j++) {
			// update path
			let inputSubSubDir = inputSubDirs[j];
			currentPath = `${inputPath}/${inputSubDir}/${inputSubSubDir}`;
			// console.log(currentPath);


			// only allow specific timezones/directories
			if (specificDirectories.length > 0 && !specificDirectories.includes(`${inputSubDir}/${inputSubSubDir}`)) continue;


			//tests
			let inputSubSubDirs = await FS_Files.getFilesInDir(currentPath, ["folders"]);
			console.log(i, j, `${inputSubDir}/${inputSubSubDir}`);








			/**
			 *	CONVERT ALL AT CURRENT PATH
			 *	- Uncomment to convert
			 *	- Not currently in use now that Joelle is exporting from Illustrator manually
			 */

			// IF NO SVGs THEN SKIP
			if (await !fse.pathExists(`${currentPath}/house/SVG`) ||
				await !fse.pathExists(`${currentPath}/plant/SVG`)
			) {
				console.log("NO 🏠 or 🌿 SVGs");
				continue;
			}

			if (commands.includes("convert")) {
				console.log(i, commands, "🌈 CONVERTING");
				await convertAllAtPath(currentPath, "house");
				await convertAllAtPath(currentPath, "plant");
			}


			/**
			 *	COPY FILES
			 */

			if (commands.includes("copySVG")) {
				console.log(i, commands, "🦋 COPY SVG");

				// HOUSE
				FS_Files.copyFiles(
					`${inputPath}/${inputSubDir}/${inputSubSubDir}/house/SVG`,
					`${outputPath}-SVG/${inputSubDir}/${inputSubSubDir}/house/SVG`, true
				);
				// PLANT
				FS_Files.copyFiles(
					`${inputPath}/${inputSubDir}/${inputSubSubDir}/plant/SVG`,
					`${outputPath}-SVG/${inputSubDir}/${inputSubSubDir}/plant/SVG`, true
				);
			}



			// get array of files
			let tempHousePNGsArr = await FS_Files.getFilesInDir(`${currentPath}/house/PNG`, ["files", "folders"]);
			let tempPlantPNGsArr = await FS_Files.getFilesInDir(`${currentPath}/plant/PNG`, ["files", "folders"]);
			// IF NO PNGs THEN SKIP
			if (await !fse.pathExists(`${currentPath}/house/PNG`) ||
				await !fse.pathExists(`${currentPath}/plant/PNG`) ||
				tempHousePNGsArr.length <= 0 ||
				tempPlantPNGsArr.length <= 0
			) {
				// console.log("NO 🏠 or 🌿  PNG");
				continue;
			}

			if (commands.includes("copyPNG")) {
				console.log(i, commands, "🐠 COPY PNG");

				// HOUSE
				FS_Files.copyFiles(
					`${inputPath}/${inputSubDir}/${inputSubSubDir}/house/PNG`,
					`${outputPath}-PNG/${inputSubDir}/${inputSubSubDir}/house/PNG`, true
				);
				// PLANT
				FS_Files.copyFiles(
					`${inputPath}/${inputSubDir}/${inputSubSubDir}/plant/PNG`,
					`${outputPath}-PNG/${inputSubDir}/${inputSubSubDir}/plant/PNG`, true
				);
			}


			// test
			// if (j > 1) break;
		}
		// test
		// if (i > 0) break;
	}
}

// FS_Files.copyFiles(
// 	'/Volumes/GoogleDrive/My\ Drive/Art\ \(Dietrick\ Studio\)/_Artwork\ Process/Chasing\ the\ Sun/Artwork/UTC-ORIGINALS/00-00/02/house/SVG',
// 	'/Users/joelledietrick/Documents/Github/svg-randomizer/tests/sample-svg-input/UTC-ORIGINALS-SVG/00-00/02/house/SVG',
// false
// );


/**
 *	Convert all house and plants in just in one directory
 */
async function convertAllAtPath(inputPath, subdir = "house") {
	// 1. make sure they exist
	if (await !fse.pathExists(`${inputPath}/${subdir}`)) return;
	// 2. save paths
	let svgDir = `${inputPath}/${subdir}/SVG/`;
	let pngDir = `${inputPath}/${subdir}/PNG/`;
	// 3. get list files
	let inputFiles = await FS_Files.getFilesInDir(svgDir, ["files", "fileExts", ".svg"]);
	// console.log(inputFiles);
	// 4. create directory if it doesn't exist
	fse.ensureDirSync(pngDir);
	// 5. loop through each and create the PNG from SVG
	inputFiles.forEach(async (item, i) => {
		console.log(i, item);
		let w = 1000,
			h = 1000;
		if (subdir == "house") {
			w = 2500;
			h = 2500;
		}
		await convertSVG2PNG(svgDir, item, pngDir, w, h);
	});
}

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

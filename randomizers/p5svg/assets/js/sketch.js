/**
 *	P5.js test to visualize, export, animate SVGs
 *	https://p5js.org/reference/
 */



/********************************************************
0. VARS
********************************************************/

// GLOBALS
const basePath = globals.BASE_PATH;
// console.log("globals",globals)

// OUTPUT
var img, sketch;
let house, plant,
	filePaths = {
		house: [],
		plant: []
	},
	filePathsCombined = [];
// INPUT
let screenW = 1500,
	screenH = 1000;




/********************************************************
1. SETUP
********************************************************/

(async function() {
	init();
})();

async function init(){
	// 1. Fetch data
	[house, plant] = await globals.getHousePlantData();
	// console.log(house.fileNames, house.fileNames.length);
	// console.log(plant.fileNames, plant.fileNames.length);

	// 2. Prepare data
	filePaths.house = globals.getFullPaths(house);
	filePaths.plant = globals.getFullPaths(plant);
	console.log(filePaths.house, filePaths.house.length);
	console.log(filePaths.plant, filePaths.plant.length);

	// 3. shuffle each
	filePaths.house = FS_Object.shuffleArray(filePaths.house);
	filePaths.plant = FS_Object.shuffleArray(filePaths.plant);
	console.log("filePaths", filePaths);

	// for testing
	// filePathsCombined = filePaths.house.concat(filePaths.plant);
	filePathsCombined = filePaths.house.concat([]);

	callRandomizer();
}


function callRandomizer(){
	// 4. create the sketch
	// sketch = new p5(createSketch1); // simple hello world
	// sketch = new p5(createSketch2); // basic proof SVG lib works
	sketch = new p5(createSketch3); // working function, well not working
}



/********************************************************
2. VISUALIZE
********************************************************/

function createSketch1(p) {
	p.setup = function() {
		p.noLoop();
		p.createCanvas(700, 410);
		p.background(255);
		p.fill(0);
		p.stroke(150);
		p.ellipse(100, 100, 50, 50); // x,y,w,h
	};
}

function createSketch2(p) {
	p.preload = function() {
		// test2 - load a single
		img = p.loadSVG('../../tests/sample-svg-input/UTC-ORIGINALS_03-03_01/house/SVG/Asset 276.svg');
	};
	p.setup = function() {
		p.noLoop();
		p.createCanvas(screenW, screenH, p.SVG); // use SVG renderer
	};
	p.draw = function() {

		// props that work with the SVG renderer
		var x = 200;
		var y = 200;
		let scale = 0.45; // (Math.random() * 0.25 + Math.random() * 0.25);


		// props that DO NOT
		p.rotate(Math.random() * 360); // only works in WebGL

		// add image
		p.image(img, x, y, screenW * scale, screenH * scale);
		addRotation();
	};
}

function addRotation(ele = "rect, circle, ellipse, line, polyline, polygon, path") {

	// select all the shapes
	// https://developer.mozilla.org/en-US/docs/Web/SVG/Tutorial/Basic_Shapes
	var _p = document.querySelectorAll(ele);

	for (let i = 0; i < _p.length; i++) {
		console.log("addCSSRotationInline()", i, _p[i], _p[i].getBoundingClientRect());

		let deg = Math.random() * 360;

		// ❌  INLINE CSS DOES NOT WORK IN SVG
		// - it works in the browser, but not in Illustrator (doesn't support inline CSS??)
		// _p[i].style.transform = `rotate(${deg}deg)`;

		// ✅  instead set the property directly
		// https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/transform
		_p[i].setAttribute("transform", `rotate(${deg})`);

	}
}

function createSketch3(p) {
	p.preload = function() {
		console.log(`preload()`); //  runs once, halting setup until finished

		// test2 - load a single
		img = p.loadSVG('../../tests/sample-svg-input/UTC-ORIGINALS_03-03_01/house/SVG/Asset 276.svg');
		// ^ THIS HAS TO RUN ONCE BEFORE THE BELOW WILL WORK
		// test3 - load joelle's
		for (let i = 0; i < filePathsCombined.length; i++) {
			console.log(filePathsCombined[i]);
			img[i] = p.loadSVG(filePathsCombined[i]);
		}
	};
	p.setup = function() {
		console.log(`setup()`);
		p.noLoop();
		p.createCanvas(screenW, screenH, p.SVG);
	};
	p.draw = function() {
		for (let i = 0; i < filePathsCombined.length; i++) {

			var x = 0;
			var y = 0;
			let scale = 1000 * (Math.random() * 0.25 + Math.random() * 0.25);

			p.image(img[i], x, y, scale, scale);
			// addRotation("g>svg");
			addRotation();
		}
	};
}


// save SVG
document.querySelector(".saveSVG").addEventListener("click", function() {
	console.log("File saved", FS_Date.returnDateISO());
	sketch.save(`test-${FS_Date.returnDateISO()}`);
	showSuccessButton(this);
});
document.querySelector(".randomize").addEventListener("click",  function() {
	// clear??
	callRandomizer();
	showSuccessButton(this);
});
document.querySelector(".updateData").addEventListener("click",  function() {
	updateDataAsync(this);
});


async function updateDataAsync(btn){
	await globals.refreshLocalDataFromSheet();
	init();
	console.log("Data updated");
	showSuccessButton(btn);
}

function showSuccessButton(btn){
	let currentBackground = btn.style.background;
	btn.style.background = "green";
	setTimeout(function(){
		btn.style.background = currentBackground;
	}, 1500);
}

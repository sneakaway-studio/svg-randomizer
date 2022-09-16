/**
 *	P5.js test to visualize, export, animate SVGs
 *	https://p5js.org/reference/
 */



/********************************************************
0. VARS
********************************************************/

// GLOBALS
const fullSVGPath = CONFIG.FULL_SVG_PATH;
console.log("CONFIG", CONFIG)

// DATA
let data, selectionKeysArr = [];

// INPUT / OUTPUT
let screenW = 1500,
	screenH = 1000,
	settings = {
		count: {
			min: 5,
			max: 15
		}
	},
	// the number of svgs that will be included in this viz
	count = FS_Number.randomIntBetween(settings.count.min, settings.count.max);
var img, sketch;



/********************************************************
1. SETUP
********************************************************/

(async function() {
	init();
})();

async function init() {
	// 1. Fetch data
	data = await globals.getAllData();
	// console.log("data", data);

	// 2. create selection keys arr (combines and weights them all)
	selectionKeysArr = await globals.getWeightedSelectionKeysArr(data, count);
	console.log("selectionKeysArr", selectionKeysArr);

	// 3. Run randomizer
	randomizer();
}





/********************************************************
2. VISUALIZE
********************************************************/

function randomizer() {
	// create the sketch
	// sketch = new p5(createSketch1); // simple hello world
	// sketch = new p5(createSketch2); // basic proof SVG lib works
	sketch = new p5(createSketch3); // working function, well not working
}

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
		addRotationHack();
	};
}

function addRotationHack(ele = "rect, circle, ellipse, line, polyline, polygon, path") {
	// select all the potential shapes in the SVG
	// https://developer.mozilla.org/en-US/docs/Web/SVG/Tutorial/Basic_Shapes
	var elements = document.querySelectorAll(ele);
	// loop through them
	for (let i = 0; i < elements.length; i++) {
		console.log("addRotationHack()", i, elements[i], elements[i].getBoundingClientRect());

		let deg = Math.random() * 360;

		// ❌  INLINE CSS DOES NOT WORK IN SVG
		// - it works in the browser, but not in Illustrator (which doesn't support inline CSS(?))
		// elements[i].style.transform = `rotate(${deg}deg)`;

		// ✅  instead set the property directly
		// https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/transform
		elements[i].setAttribute("transform", `rotate(${deg})`);
	}
}

function createSketch3(p) {
	p.preload = function() {
		console.log(`preload()`); //  runs once, halting setup until finished

		// test2 - load a single
		img = p.loadSVG('../../tests/sample-svg-input/UTC-ORIGINALS_03-03_01/house/SVG/Asset 276.svg');
		// ^ THIS HAS TO RUN ONCE BEFORE THE BELOW WILL WORK
		// test3 - load joelle's
		for (let i = 0; i < selectionKeysArr.length; i++) {
			console.log(selectionKeysArr[i]);
			img[i] = p.loadSVG(globals.relativeFilePathFromKeyObj(selectionKeysArr[i]));
		}
	};
	p.setup = function() {
		console.log(`setup()`);
		p.noLoop();
		p.createCanvas(screenW, screenH, p.SVG);
	};
	p.draw = function() {
		for (let i = 0; i < selectionKeysArr.length; i++) {

			var x = 0;
			var y = 0;
			let scale = 1000 * (Math.random() * 0.25 + Math.random() * 0.25);

			p.image(img[i], x, y, scale, scale);
			// addRotationHack("g>svg");
			addRotationHack();
		}
	};
}




/********************************************************
3. CONTROLS & SAVE
********************************************************/

// save SVG
document.querySelector(".saveSVG").addEventListener("click", function() {
	console.log("File saved", FS_Date.returnDateISO(null, ["", "-", "", ""]));
	sketch.save(`test-${FS_Date.returnDateISO(null, ["", "-", "", ""])}`);
	showSuccessButton(this);
});
document.querySelector(".randomize").addEventListener("click", function() {
	// clear??
	randomizer();
	showSuccessButton(this);
});
document.querySelector(".updateData").addEventListener("click", function() {
	updateDataAsync(this);
});


async function updateDataAsync(btn) {
	data = await globals.refreshLocalDataFromSheet();
	init();
	console.log("Data updated");
	showSuccessButton(btn);
}

function showSuccessButton(btn) {
	let currentBackground = btn.style.background;
	btn.style.background = "green";
	setTimeout(function() {
		btn.style.background = currentBackground;
	}, 1500);
}

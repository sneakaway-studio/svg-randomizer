/**
 *	Main Randomizer
 */


/********************************************************
0. VARS
********************************************************/

// GLOBALS
const basePath = globals.BASE_PATH;
// console.log("globals",globals)

// DATA
let data, selectionKeysArr = [];

// INPUT / OUTPUT
let screenW = 1500,
	screenH = 1000,
	browser = {
		w: window.innerWidth,
		h: window.innerHeight,
	},
	settings = {
		count: {
			min: 30,
			max: 50
		},
		// scale: min / max = decimal %
		// this is the default, to be used if the cts-data spreadsheet doesn't have the value
		// e.g. adding 20 in the spreadsheet on one line could make just the house smaller
		scale: {
			min: 4,
			max: 7
		},
		// w,h,x,y: min / max = % of total
		w: {
			min: 10,
			max: 40
		},
		h: {
			min: 10,
			max: 40
		},
		x: {
			min: 40,
			max: 90
		},
		y: {
			min: 60,
			max: 90
		},
		// rotation: min / max = 360 degrees
		rotation: {
			min: 0,
			max: 360
		}
	},
	count = 0;

// OUTPUT
let svgString = '',
	svgArr = [];


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

	// check controls
	count = $('.countInput').val() || FS_Number.randomIntBetween(settings.count.min, settings.count.max);

	// 2. create selection keys arr (combines and weights them all)
	selectionKeysArr = await globals.getWeightedSelectionKeysArr(data, count);
	console.log("selectionKeysArr", selectionKeysArr);

	// 3. Run randomizer
	randomizer();
}


// randomize all properties
function propRandomizer(parentObj) {
	let prop = {
		scale: parentObj.scale || FS_Number.round(FS_Number.randomFloatBetween(settings.scale.min, settings.scale.max) * 100, 2),
		x: FS_Number.round((FS_Number.randomFloatBetween(settings.x.min, settings.x.max)), 0) * 0.5,
		y: FS_Number.round((FS_Number.randomFloatBetween(settings.y.min, settings.y.max)), 0) * 0.5,
		rotation: FS_Number.randomIntBetween(settings.rotation.min, settings.rotation.max)
	};
	return prop;
}



/********************************************************
2. VISUALIZE
********************************************************/

async function randomizer() {
	// INPUT
	let parentObj = {};
	// reset
	svgString = '';
	svgArr = [];

	// add a new random SVG
	for (let i = 0; i < selectionKeysArr.length; i++) {

		// SETTINGS

		// reference to the parent obj
		parentObj = data[selectionKeysArr[i].key];
		// console.log("parentObj", data[selectionKeysArr[i].key]);

		let {
			scale,
			x,
			y,
			rotation
		} = propRandomizer(parentObj);

		let filePath = `/files/${parentObj.filePath}${FS_Object.randomArrayIndex(parentObj.fileNames)}`;
		console.log(selectionKeysArr[i].key, `x:${x}, y:${y}, rotation:${rotation}, scale:${scale}`);

		// GET THE SVG FILE

		// fetch the string of the svg
		let svgChildStr = await fetch(filePath).then(d => d.text());
		// console.log("svgChildStr [1]", svgChildStr);

		// update attribute names in entire SVG string
		svgChildStr = FS_HTML.createUniqueSelectorNames(svgChildStr, i);
		// console.log("svgChildStr [2]", svgChildStr);

		svgChildStr = FS_HTML.cleanSVG(svgChildStr);
		// console.log("svgChildStr [3]", svgChildStr);



		// get viewBox values
		// let viewBox = FS_HTML.getAllAttributeValues(svgChildStr, "viewBox")[0].split(" ");
		// console.log(viewBox);

		// apply style to main Layer id
		let ids = FS_HTML.getAllAttributeValues(svgChildStr, "id");
		// console.log("ids",ids);
		let id = '';
		for (let i = 0; i < ids.length; i++) {
			if (ids[i].includes('Layer'))
				id = ids[i];
		}
		// console.log("id",id);
		if (id != '') {
			svgChildStr = svgChildStr.replace(/<style>/gi, `<style>#${id} { transform-origin: 50% 50%; transform: rotate(${rotation}deg); } `);
		}


		// add transform
		svgChildStr = svgChildStr.replace(/<g /i, `<g transform="rotate(${rotation} 50 50)" `);


		// add svg x, y, width, height
		svgChildStr = svgChildStr.replace(/<svg /gi, `
<svg x="${x}" y="${y}" width="${scale}" height="${scale}" style="overflow: visible;"  `);






		// add the nested svg
		svgArr.push(svgChildStr);
		// if (i > 30) break;
	}
	// console.log("svgArr", svgArr);



	let itemMetadata = ``;

	for (var key in data) {
		if (data.hasOwnProperty(key)) {
			itemMetadata += `\n${JSON.stringify(data[key], null, 2)}\n`;
		}
	}


	// ${data[selectionKeysArr[0].key].location}-${data[selectionKeysArr[0].key].plant}







	svgString = `

<svg class="parent" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0" y="0" width="1000" height="1000" viewBox="0 0 100 100">

<!--
Date: ${FS_Date.returnDateISO(null, ["", "-", "", ""])}
${itemMetadata}
-->

`;

	// GRADIENT OR DEFAULT TO BG COLOR?
	// Joelle will only put in fff in the spreadsheet, while the defaults in export-paths is ffffff
	if (parentObj.bgColor.length != 3) {

		svgString += `
<defs><linearGradient id="backgroundGrad" x1="0%" y1="0%" x2="0%" y2="100%">
	<stop offset="0%" style="stop-color:#${parentObj.bgGrad1};stop-opacity:1" />
	<stop offset="35%" style="stop-color:#${parentObj.bgGrad2};stop-opacity:1" />
	<stop offset="100%" style="stop-color:#${parentObj.bgGrad3};stop-opacity:1" />
</linearGradient></defs>
<rect x="-50" y="0" width="200" height="200" fill="url(#backgroundGrad)"></rect>
`;
	}

	svgString += `
${svgArr.join("\n")}

</svg>
`;

	// this is all that is left of the "print-page" version - just loaded the SVGs as images
	// files.push(`<img
	// 	style="width: ${w}px; height: ${h}px; top: ${y}px; left: ${x}px; transform: rotate(${r}deg) scale(${scale});"
	// 	src="${filePath}">`);


	// add all together in a nested SVG
	$(".svgContainer").html(svgString);

	// update colors
	$('html,body').css({
		"background-color": `#${parentObj.bgColor}`
	});
	// $('.svgContainer').css({
	// 	"background-color": `#${parentObj.bgGrad1}`,
	// 	"background": `linear-gradient(0deg, #${parentObj.bgGrad1} 0%, #${parentObj.bgGrad2} 35%, #${parentObj.bgGrad3} 100%)`
	// });

	// update display
	$('.countInput').val(count);

}






/********************************************************
3. CONTROLS & SAVE
********************************************************/

// don't need XML part in SVG for HTML display so add dtd to make downloadable file
function getSVGfileStr() {
	// let dtd = '<?xml version="1.1" encoding="utf-8" ?>';
	return '<?xml version="1.0" encoding="utf-8" ?>' + svgString;
}


/**
 * 	Download a file
 */
function download(filename, textInput) {
	var element = document.createElement('a');
	element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(textInput));
	element.setAttribute('download', filename);
	document.body.appendChild(element);
	element.click();
	document.body.removeChild(element);
}
document.querySelector(".saveSVGstring").addEventListener("click", function() {
	str = getSVGfileStr();
	console.log("str", str);
	// var filename = `test-${FS_Date.returnDateISO(null, ["", "-", "", ""])}.svg`;
	var filename = `${data[selectionKeysArr[0].key].dir}-${data[selectionKeysArr[0].key].num}-${data[selectionKeysArr[0].key].location}-${data[selectionKeysArr[0].key].plant}-${FS_Date.returnDateISO(null, ["", "-", "", ""])}.svg`;
	console.log("File saved", filename);
	download(filename, str);
	showSuccessButton(this);
}, false);

/**
 *	Copy to clipboard
 */
function copyToClipboard(ele, str) {
	$(ele).val(str).select();
	document.execCommand("copy");
}
// copyToClipboard('.svgString', svgParentStr);


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

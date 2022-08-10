let data;

fetch('../../node-projects/export-paths/data/all-data.json')
	.then(response => response.json())
	.then(d => {
		console.log(d);
		data = d;
		randomizer();
	});

const basePath = globals.BASE_PATH;
// console.log("globals",globals)



let svgParentStr = '', // final string
	browser = {
		w: window.innerWidth,
		h: window.innerHeight,
	},
	settings = {
		count: {
			min: 5,
			max: 15
		},
		scale: {
			min: 0.15,
			max: 0.5
		},
		w: { // min and max % width of total
			min: 10,
			max: 40
		},
		h: {
			min: 10,
			max: 40
		},
		x: {
			min: 10, // %
			max: 90
		},
		y: {
			min: 10, // %
			max: 90
		},
		r: {
			min: 0,
			max: 360
		}
	};

async function randomizer() {

	let svgParentArr = [],
		count = FS_Number.randomIntBetween(settings.count.min, settings.count.max),
		bgColorArr = [];

	// for each nested SVG
	for (let i = 0; i < count; i++) {


		let imgObj = FS_Object.randomObjProperty(data),
			s = FS_Number.round(FS_Number.randomFloatBetween(settings.scale.min, settings.scale.max) *100, 2),
			x = FS_Number.round(FS_Number.randomFloatBetween(settings.x.min, settings.x.max), 2),
			y = FS_Number.round(FS_Number.randomFloatBetween(settings.y.min, settings.y.max), 2),
			// x = FS_Number.round((FS_Number.randomFloatBetween(settings.x.min, settings.x.max) * browser.w) * 0.5),
			// y = FS_Number.round((FS_Number.randomFloatBetween(settings.y.min, settings.y.max) * browser.h) * 0.5),
			r = FS_Number.randomIntBetween(settings.r.min, settings.r.max);

		// console.log("imgObj", imgObj);
		// console.log(s, x, y, r);

		// save background color
		bgColorArr = imgObj.colors;

		let filePath = `/files/${imgObj.filePath}${FS_Object.randomArrayIndex(imgObj.fileNames)}`;



		// fetch the string of the svg
		let svgChildStr = await fetch(filePath).then(d => d.text());
		// console.log("svgChildStr1", svgChildStr);

		// update attribute names in entire SVG string
		svgChildStr = updateSelectorNames(svgChildStr, i);
		// console.log("svgChildStr2", svgChildStr);

		// remove extra data
		svgChildStr = svgChildStr.replace(/ data-name="Layer 2"/gi, '');
		console.log("svgChildStr3", svgChildStr);


		// get viewBox values
		// let viewBox = getAllAttributeValues(svgChildStr, "viewBox")[0].split(" ");
		// console.log(viewBox);

		// apply style to main Layer id
		let ids = getAllAttributeValues(svgChildStr, "id");
		// console.log("ids",ids);
		let id = '';
		for (let i = 0; i < ids.length; i++) {
			if (ids[i].includes('Layer'))
				id = ids[i];
		}
		// console.log("id",id);
		if (id != '') {
			svgChildStr = svgChildStr.replace(/<style>/gi, `<style>#${id} { transform-origin: 50% 50%; transform: rotate(${r}deg); } `);
		}


		// add transform
		svgChildStr = svgChildStr.replace(/<g /i, `<g transform="rotate(${r} 50 50)" `);


		// add svg x, y, width, height
		svgChildStr = svgChildStr.replace(/<svg /gi, `
<svg x="${x}" y="${y}" width="${s}" height="${s}" style="overflow: visible;"  `);



		console.log(s, x, y, r);





		// add the nested svg
		svgParentArr.push(svgChildStr);
		// if (i > 30) break;
	}
	// console.log("svgParentArr", svgParentArr);


	svgParentStr = `<?xml version="1.0" standalone="no"?>
<svg class="parent" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0" y="0" width="100%" height="100%" viewBox="0 0 100 100">

<defs><linearGradient id="backgroundGrad" x1="0%" y1="0%" x2="0%" y2="100%">
<stop offset="0%" style="stop-color:#${bgColorArr[0]};stop-opacity:1" />
<stop offset="35%" style="stop-color:#${bgColorArr[1]};stop-opacity:1" />
<stop offset="100%" style="stop-color:#${bgColorArr[2]};stop-opacity:1" />
</linearGradient></defs>
<rect x="-50" y="0" width="200" height="100" fill="url(#backgroundGrad)"></rect>

${svgParentArr.join("\n")}

</svg>
	`;


	// add all together in a nested SVG
	$("body").append(svgParentStr);
	// add string to input
	$('.copyPaste').val(svgParentStr);
}


$('body').on('click', function() {
	copyToClipboard('.copyPaste', svgParentStr);
});
$(document).mouseenter(() => {
	$(".copyPaste").css({
		"display": "block"
	});
}).mouseleave(() => {
	$(".copyPaste").css({
		"display": "none"
	});
});

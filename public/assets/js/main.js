let data;

fetch('./api/getFiles')
	.then(response => response.json())
	.then(d => {
		console.log(d);
		data = d;
		randomizer();
	});

let browser = {
		w: window.innerWidth,
		h: window.innerHeight,
	},
	settings = {
		count: {
			min: 40,
			max: 100
		},
		w: {
			min: 300,
			max: 700
		},
		h: {
			min: 300,
			max: 700
		},
		r: {
			min: 0,
			max: 360
		}
	};

async function randomizer() {

	let files = [],
		count = FS_Number.randomIntBetween(settings.count.min, settings.count.max),
		colors = [];

	//
	for (let i = 0; i < count; i++) {
		let item = FS_Object.randomArrayIndex(data.plants),
			w = FS_Number.randomIntBetween(settings.w.min, settings.w.max),
			h = FS_Number.randomIntBetween(settings.h.min, settings.h.max),
			x = FS_Number.round((FS_Number.randomFloatBetween(0.3, 0.85) * browser.w) - (w / 2)),
			y = FS_Number.round((FS_Number.randomFloatBetween(0.4, 0.85) * browser.h) - (h / 2)),
			r = FS_Number.randomIntBetween(settings.r.min, settings.r.max);

		colors = [
			FS_Object.randomArrayIndex(item.colors),
			FS_Object.randomArrayIndex(item.colors),
			FS_Object.randomArrayIndex(item.colors),
		];
		// console.log(browser, w, h, x, y, r);

		files.push(`<img
				style="width: ${w}px; height: ${h}px; top: ${y}px; left: ${x}px; transform: rotate(${r}deg);"
			 	src="files/${item.dir}/${data.svgPath}${FS_Object.randomArrayIndex(item.files)}">`);
	}
	// console.log("files", files);

	$(".container").append(files.join(""));
	// console.log($(".container").html());
	console.log("colors", colors);

	$('body').css({
		"background-color": `${colors[0]}`,
		"background": `linear-gradient(0deg, ${colors[0]} 0%, ${colors[1]} 35%, ${colors[2]} 100%)`
	});

}

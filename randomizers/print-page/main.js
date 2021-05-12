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

let browser = {
		w: window.innerWidth,
		h: window.innerHeight,
	},
	settings = {
		count: {
			min: 4,
			max: 10
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
		let item = FS_Object.randomObjProperty(data),
			w = FS_Number.randomIntBetween(settings.w.min, settings.w.max),
			h = FS_Number.randomIntBetween(settings.h.min, settings.h.max),
			x = FS_Number.round((FS_Number.randomFloatBetween(0.3, 0.85) * browser.w) - (w / 2)),
			y = FS_Number.round((FS_Number.randomFloatBetween(0.4, 0.85) * browser.h) - (h / 2)),
			r = FS_Number.randomIntBetween(settings.r.min, settings.r.max);

		// console.log("item", item);


		colors = [
			// FS_Object.randomArrayIndex(item.colors),
			// FS_Object.randomArrayIndex(item.colors),
			// FS_Object.randomArrayIndex(item.colors),
			"red", "green", "blue"
		];

		colors = item.colors;

		// console.log(browser, w, h, x, y, r);

		let filePath = `/files/${item.filePath}${FS_Object.randomArrayIndex(item.fileNames)}`;
		// console.log(filePath);

		files.push(`<img
				style="width: ${w}px; height: ${h}px; top: ${y}px; left: ${x}px; transform: rotate(${r}deg);"
			 	src="${filePath}">`);
	}
	// console.log("files", files);

	$(".container").append(files.join(""));
	// console.log($(".container").html());
	console.log("colors", colors);

	$('.container').css({
		"background-color": `#${colors[0]}`,
		"background": `linear-gradient(0deg, #${colors[0]} 0%, #${colors[1]} 35%, #${colors[2]} 100%)`
	});


	// animator();
}


function animator() {

	// set the transform origin
	$('img').each(() => {
		$(this).css({
			"rotate": `${Math.random()*360}deg`,
			"transform-origin": `${Math.random()*200}px ${Math.random()*200}px`
		});
	});

// return;
	anime({
		targets: 'img',
		// transform: "rotate(0deg) translate(120px)",
		// rotate: function(el, i, l) {
		// 	return Math.random() * 360;
		// },
		rotate: [{
			value: '+=10deg'
		}],

		// translateX: [{
		// 		value: 250,
		// 		duration: 1000,
		// 		delay: 500
		// 	},
		// 	{
		// 		value: 0,
		// 		duration: 1000,
		// 		delay: 500
		// 	}
		// ],
		// translate: 120,
		delay: 100,
		loop: true,
		duration: function(el, i, l) {
			return anime.random(3000, 5000);
		},
		// easing: 'easeInOutSine'
	});

}

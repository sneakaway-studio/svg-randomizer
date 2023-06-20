
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

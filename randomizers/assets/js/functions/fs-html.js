/*  HTML / SVG / XML / CSS FUNCTIONS
 ******************************************************************************/

window.FS_HTML = (function() {
	// PUBLIC
	return {

		testSvg: `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 771.78 1092.93"><defs><style>.cls-1{fill:none;}.cls-2{clip-path:url(#clip-path);}.cls-3{fill:#920015;}</style><clipPath id="clip-path" transform="translate(-0.17 -0.13)"><rect class="cls-1" width="771.89" height="1093.12"/></clipPath></defs><g id="Layer 2" data-name="Layer 2"></g><g class="cls-3" id="Layer 3" data-name="Layer 3"></g></svg>`,

		testStyle: `.cls-1{fill:url(#linear-gradient);}.cls-2{fill:url(#linear-gradient-2);}.cls-3{fill:url(#linear-gradient-3);}.cls-4{fill:url(#linear-gradient-4);}.cls-5{fill:url(#linear-gradient-5);}.cls-6{fill:url(#linear-gradient-6);}`,


		cleanSVG: function(str) {
			// remove dtd (for individual svgs, you will need to add it later for the whole doc)
			str = str.replace(/<\?xml version="1.0" encoding="UTF-8"\?>/ig, "");
			// data-name not allowed on groups
			// https://validator.w3.org/#validate_by_upload
			str = str.replace(/ data-name="Layer 2"/gi, '');

			return str;
		},


		/**
		 *	Return all the specified attribute values from a string as an array
		 */
		getAllAttributeValues: function(str, attr) {
			// create new regex using variable
			var regex = new RegExp(`${attr}="(.*?)"`, 'gi');
			// get all matches
			let attrArr = str.match(regex);
			// remove enclosing strings
			attrArr = attrArr.map((x) => {
				return x.replace(new RegExp(`${attr}="`, 'gi'), '')
					.replace(/(")/g, '');
			});
			// remove duplicates
			attrArr = FS_Object.removeArrayDuplicates(attrArr);
			// console.log(attr, attrArr);
			return attrArr;
		},




		/**
		 *	Update selector names with content of "append"
		 * 	selectorType could be class (.) or id (#)
		 */
		createUniqueSelectorNames: function(str, append = 'hello') {

			// remove underscores
			str = str.replaceAll('_', '-');


			// 1. get all the values

			let ids = this.getAllAttributeValues(str, "id");
			let classes = this.getAllAttributeValues(str, "class");
			// console.log(ids, classes);


			// 2. replace all the names

			let selectorArr = ids.concat(classes);
			// const regex = /(.[a-z]+-[0-9]+)/gi;
			for (let i = 0; i < selectorArr.length; i++) {
				// console.log(selectorArr[i]);
				str = str.replaceAll(selectorArr[i], `${selectorArr[i]}-${i}-${append}`);

			}
			// console.log("createUniqueSelectorNames() -> str", str);

			return str;
		},
		// test
		// this.createUniqueSelectorNames(testSvg, '🦋');






		getNamesFromStyleEle: function(str) {
			// 1. Get selector names from style

			// get style
			let style = copyStyle(str);
			// split on period
			var rulesArr = style.split(selectorType).slice(1);
			console.log("createUniqueSelectorNames() -> rulesArr", rulesArr);

			// get names
			var selectorArr = rulesArr.map(function(val) {
				return val.split('{')[0];
			});
			console.log("createUniqueSelectorNames() -> selectorArr", selectorArr);

		},


		/**
		 *	Return copy of style from string
		 */
		copyStyle: function(str) {
			let style = '';
			// if exists
			if (str.match(/[<style]/gi)) {
				// copy the style
				style = str.split('<style>').pop().split('</style>')[0];
				// console.log("style", style);
			}
			return style;
		},
		// copyStyle(testSvg);


		/**
		 *	Replace contents of style tag with new string
		 */
		replaceStyle: function(str, style) {
			// if exists
			if (str.match(/[<style]/gi)) {
				const regex = /<style>.*<\/style>/g;
				str = str.replace(regex, `<style>${style}</style>`);
				// console.log("str", str);
			}
			return str;
		}
		// replaceStyle(testSvg, '.newStyle{}');



	};
})();

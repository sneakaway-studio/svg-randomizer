(function(window) {
    var globals = {


		// PROJECT-SPECIFIC PATHS


		ALL_DATA_PATH_RELATIVE_RANDOMIZERS: '../../../node-projects/export-paths/data/data-tz.json',
		ALL_DATA_API_URL: 'http://localhost:3000/api/refreshLocalDataFromSheet',

		BASE_PATH_RELATIVE_RANDOMIZERS: "../../",
		TEST_DIR_PATH_RELATIVE_RANDOMIZERS: "../../tests/sample-svg-input/",






        relativeFilePathFromKeyObj: function(keyObj) {
            return this.TEST_DIR_PATH_RELATIVE_RANDOMIZERS + data[keyObj.key].filePath + data[keyObj.key].fileNames[keyObj.fileNameIndex];
        },

        /**
         * 	Refresh the data from the sheet and then return latest
         */
        refreshLocalDataFromSheet: async function(path = this.ALL_DATA_API_URL) {
            return fetch(path)
                .then(response => response.json())
                .then(_d => {
                    // console.log(_d);
                    return _d;
                });
        },
        /**
         * 	fetch all local json
         */
        getAllData: async function(path = this.ALL_DATA_PATH_RELATIVE_RANDOMIZERS) {
            return fetch(path)
                .then(response => response.json())
                .then(_d => {
                    // console.log(_d);
                    return _d;
                });
        },
        // get data file
        // let d = await getData();


        /**
         *	Get all data combined, weighted (adding additional versions)
         */
        getKeysWeighted: async function(data) {
            // console.log(data);
            let d = [];
            // loop through obj
            for (var key in data) {
                if (data.hasOwnProperty(key)) {
                    // console.log(key, data[key]);
                    // add each according to value in "include" field
                    for (let i = 0; i < data[key].include; i++) {
                        d.push(key);
                    }
                }
            }
            // console.log(d);
            return d;
        },

        /**
         *	Create array of objects, weighted, to select from
         */
        getWeightedSelectionKeysArr: async function(data, count = 10) {

            // an array of keys, weighted
            let keysWeighted = await this.getKeysWeighted(data);
            console.log("keysWeighted (see google sheet include column)", keysWeighted);

            let d = [];

            // create an array of objects
            for (let i = 0; i < count; i++) {
                // pick a key
                let key = keysWeighted[Math.floor(Math.random() * keysWeighted.length)];
                let obj = {
                    fileNameIndex: Math.floor(Math.random() * data[key].fileNames.length),
                    key: key
                };
                d.push(obj);
            }
            return d;
        },


        getFullPaths: function(obj) {
            console.log("getFullPaths()", obj);
            let str, arr = [];
            for (let i = 0; i < obj.fileNames.length; i++) {
                let path = `../../tests/sample-svg-input/${obj.filePath}${obj.fileNames[i]}`;
                // console.log(path);
                // str += `<img src="${path}" style="max-width:150px;max-height:150px">` // checking paths
                arr.push(path);
            }
            // document.querySelector("body").innerHTML = str; // checking paths
            return arr;
        }

    };

    if (typeof module === 'object' && module && typeof module.exports === 'object') {
        module.exports = globals;
    } else {
        window.globals = globals;
    }
})(this);

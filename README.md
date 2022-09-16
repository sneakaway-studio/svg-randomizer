
# SVG Randomizer


## TO DO

1. fix problem with cache / refresh
1. update readme instructions
1. animate



## Instructions


### Step 1. Update Spreadsheet Data

Column | Description | Default value
--- | --- | ---
`include` | Add `1` to include files. Higher numbers change ratio (e.g. `1:2`) | `0`
`bgColor` | Background color for whole page | `fff`
`bgGrad1-3` | Background [gradients](https://cssgradient.io/) | `fff`
`scale` | Increase/decrease scale. e.g. `1.5` = `150%` | `1` (`100%`)
`placeHolder` | A google sheets hack. Any data is fine. | `0`


### Step 2. Export Spreadsheet Data*

1. Open [Atom](https://atom.io/)
1. Open `/node-projects/export-paths` in Terminal (right+click and choose "Open Terminal Here")
1. Type `node index.js` and hit return. This exports data from the spreadsheet to `/node-projects/export-paths/data/all-data.json`
1. To re-export data, press the up arrow and return each time.


### Step 3: Start the file-server*

1. Open [Atom](https://atom.io/)
1. Open `/node-projects/file-server` in separate Terminal window (right+click Open Terminal Here)
1. Type `node server.js` and hit return
1. This starts the test server. Leave this running in a separate Terminal window.
1. View randomizer http://localhost:3000/randomizers/
1. Print page to make image





### Step 4: Export SVG


#### SVG Copy / Paste method

1. Go to http://localhost:3000/randomizers/svg-paste/
1. Inspect the page and search for "SVG" in the code
1. Click to copy / paste svg code




### Notes
<small>

1. Exports and uses spreadsheet data and to itemize files on your computer
1. Allows loading of local files and data into randomizer w/o CORS error

</small>






## Working with Illustrator

- Illustrator does not support using CSS inside SVGs. You must use the attributes which are built-in

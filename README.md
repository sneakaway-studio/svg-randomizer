


# SVG Randomizer


## About

Two things are required:

1. Run Export data tool: This pre-exports data
  - From the spreadsheet
  - And then gets a list of files on your computer based on the settings in the spreadsheet
1. Run the test-server to view the randomized images.
  - Basically allows you to run localhost to get local files




## Instructions


### Step 1. Update Spreadsheet Data

1. Update spreadsheet as needed
1. **Include** - Add a 1 to include files at this path.
1. **Hex1-3** - These are the background colors. Hex1 will make a solid color, while adding all three will make a gradient.
1. **scaleFactor** - Add a value to change the scale. For example: 1.5 = 150% of current scale. It will default to 1 (100% scale) if you don't.
1. **placeHolder** - This is a google sheets hack. Put anything in there.


### Step 2. Export Spreadsheet Data

1. Open [Atom](https://atom.io/)
1. Open `/node-projects/export-paths` in Terminal (right+click and choose "Open Terminal Here")
1. Type `node index.js` and hit return. This exports data from the spreadsheet to `/node-projects/export-paths/data/all-data.json`
1. To re-export data, press the up arrow and return each time.


### Step 3: Start the test-server

1. Open [Atom](https://atom.io/)
1. Open `/node-projects/test-server` in separate Terminal window (right+click Open Terminal Here)
1. Type `node server.js` and hit return
1. This starts the test server. Leave this running in a separate Terminal window.
1. View randomizer http://localhost:3000/randomizers/
1. Print page to make image







### NOTES

- Illustrator does not support using CSS inside SVGs. You must use the attributes which are built-in




### SVG Copy / Paste method


~~~
#### Instructions

HTTP: http://localhost:3000/randomizers/svg-paste/
HTTPS: https://localhost:3000/randomizers/svg-paste/
Click to copy / paste svg code
~~~

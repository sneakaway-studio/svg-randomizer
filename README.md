
# SVG Randomizer


## TO DO

1. fix problem with cache / refresh
1. update readme instructions
1. animate



## Instructions


### Step 0. Open Project

1. In Github Desktop, select the repository `svg-randomizer`
1. Click "Fetch" to see if there are changes, then pull if it shows changes (not "Pull Request", which is different)
1. Open VS Code (from Github Desktop use Shift + Command + A)


### Step 1. Update Spreadsheet Data

Column | Description | Default value
--- | --- | ---
`include` | Add `1` to include files. Higher numbers change ratio (e.g. `1:2`) | `0`
`bgColor` | Background color for whole page | `fff`
`bgGrad1-3` | Background [gradients](https://cssgradient.io/) | `fff`
`scale` | Increase/decrease scale. e.g. `1.5` = `150%` | `1` (`100%`)
`placeHolder` | A google sheets hack. Any data is fine. | `0`


### Step 2. Export Spreadsheet Data

Skip this step (the fileserver now lets you export by clicking a button). 

> Testing notes: 
> - Exports data from spreadsheet to `/node-projects/export-paths/data/data-tz.json`
> - To start nodemon w/ignore flags use: `npm run start-dev` 


### Step 3: Start the file-server

1. Open VS Code (see #0)
1. Right click on `/node-projects/file-server` and choose "Open in Integrated Terminal" to open a terminal in VS Code.
1. Type `npm run start` and hit return to start the test server. 
1. View randomizer http://localhost:3000/randomizer
1. Print page to make image



### Step 4: Export SVG

1. Click the button




### Notes
<small>

1. Exports and uses spreadsheet data and to itemize files on your computer
1. Allows loading of local files and data into randomizer w/o CORS error

</small>





## Notes

### Working with Illustrator

- Illustrator does not support using CSS inside SVGs. You must use the attributes which are built-in


### Save an SVG from a web page using copy / paste

1. Go to the URL
1. Inspect the page and search for "SVG" in the code
1. Right click to copy svg code to clipboard
1. Paste svg code in a text file



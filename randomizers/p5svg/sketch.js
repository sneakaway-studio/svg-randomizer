
var img;
function preload() {
    img = loadSVG('../../tests/output-p5/output1.svg');
}

function setup() {
    createCanvas(1000, 1000, SVG);
    background(255);
    fill(150);
    stroke(150);



ellipse(30, 30, 20, 20);

}
function draw() {
    image(img, 0, 0, 1000, 1000);
}







function saveSVG(){
	save();
}

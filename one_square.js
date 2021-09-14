
// some globals
var gl;

var theta = 0.0;
var thetaLoc, colorLoc;

var delay = 100;
var direction = true;
var triangleBuffer, stripBuffer, fanBuffer;
var colorTriangle, colorStrip, colorFan;
var program;
var triangleVertices = [];
var stripVertices = [];
var fanVertices = [];
var colorsTriangle = [];
var colorsStrip = [];
var colorsFan = [];
var numSquares = 0;
var offset1, offset2, offset3 = 0;
var colorOff1, colorOff2, colorOff3 = 0;
var colorOffset=0;
var colorBuffer;

var showTriangles = true;
var showStrips = true;
var showFan = true;

var color_vals = [Math.random(), Math.random(), Math.random(), 1.];

var max_prims = 600, num_triangles = 0;

window.onload = function init() {

	var show = "Yes"
	if(!showFan){
		show = "No"
	}
	document.getElementById('fan').innerHTML = show
	var show2 = "Yes"
	if(!showStrips){
		show2 = "No"
	}
	document.getElementById('strip').innerHTML = show2
	var show3 = "Yes"
	if(!showTriangles) {
		show3 = "No"
	}
	document.getElementById('tri').innerHTML = show3
	// get the canvas handle from the document's DOM
    var canvas = document.getElementById( "gl-canvas" );
    
	// initialize webgl
    gl = WebGLUtils.setupWebGL(canvas);

	// check for errors
    if ( !gl ) { 
		alert("WebGL isn't available"); 
	}

    // set up a viewing surface to display your image
    gl.viewport(0, 0, canvas.width, canvas.height);

	// clear the display with a background color 
	// specified as R,G,B triplet in 0-1.0 range
    gl.clearColor( 0.5, 0.5, 0.5, 1.0 );

    //  Load shaders -- all work done in init_shaders.js
    program = initShaders(gl, "vertex-shader", "fragment-shader");

	// make this the current shader program
    gl.useProgram(program);

	// Get a handle to theta  - this is a uniform variable defined 
	// by the user in the vertex shader, the second parameter should match
	// exactly the name of the shader variable
    thetaLoc = gl.getUniformLocation(program, "theta");

	colorLoc = gl.getUniformLocation(program, "vertColor");

	// create a vertex buffer - this will hold all vertices
    triangleBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, triangleBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, (300*4*6*4), gl.STATIC_DRAW)

	stripBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, stripBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, (300*4*6*4), gl.STATIC_DRAW)

	fanBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, fanBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, (300*4*6*4), gl.STATIC_DRAW)
	// create a vertex color buffer
    
	colorTriangle = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, colorTriangle);
	gl.bufferData(gl.ARRAY_BUFFER, (300*4*6*4), gl.STATIC_DRAW)


	colorStrip = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, colorStrip)
	gl.bufferData(gl.ARRAY_BUFFER, (300*4*4*4), gl.STATIC_DRAW)

	colorFan = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, colorFan)
	gl.bufferData(gl.ARRAY_BUFFER, (300*4*4*4), gl.STATIC_DRAW)

	// create the square geometry, send it to GPU
	updateVertices();
	
    render();
};

function createTraingles() {
	colorsTriangle = [];
	var x = Math.random() * (0.7 - -0.7) + -0.7
	var y = Math.random() * (0.7 - -0.7) + -0.7
	var buffer = Math.random() * (0.01 - -0.05) + -0.05

	triangleVertices.push([x, y])
	triangleVertices.push([x, y+buffer])
	triangleVertices.push([x+buffer, y+buffer])

	triangleVertices.push([x, y])
	triangleVertices.push([x+buffer , y])
	triangleVertices.push([x+buffer, y+buffer])

	gl.bindBuffer(gl.ARRAY_BUFFER, triangleBuffer);
	gl.bufferSubData(gl.ARRAY_BUFFER, offset1+48, flatten(triangleVertices));
	var vPosition = gl.getAttribLocation(program, "vPosition");
	gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
	gl.enableVertexAttribArray(vPosition);

	var color = 255;

	for(let i = 0; i < 6 * numSquares; i++){
		colorsTriangle.push([color, 0 , 0, 1]);
	}
	
	gl.bindBuffer(gl.ARRAY_BUFFER, colorTriangle);
	gl.bufferSubData(gl.ARRAY_BUFFER, colorOff1, flatten(colorsTriangle));
	colorOff1 += 96
	var vColor = gl.getAttribLocation(program, "vColor");
	gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 0, 0);
	gl.enableVertexAttribArray(vColor);

	gl.drawArrays(gl.TRIANGLES, 0, numSquares*6);
}

function createTriangleStrip() {
	colorsStrip = [];
	var x = Math.random() * (0.7 - -0.7) + -0.7
	var y = Math.random() * (0.7 - -0.7) + -0.7
	var buffer = Math.random() * (0.01 - -0.05) + -0.05
	
	stripVertices.push([x, y+buffer])
	stripVertices.push([x,y])
	stripVertices.push([x+buffer, y+buffer])
	stripVertices.push([x+buffer, y])

	gl.bindBuffer(gl.ARRAY_BUFFER, stripBuffer);
	gl.bufferSubData(gl.ARRAY_BUFFER, offset2+32, flatten(stripVertices));
	var vPosition = gl.getAttribLocation(program, "vPosition");
	gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
	gl.enableVertexAttribArray(vPosition);

	var color = 255;

	for(let i = 0; i < 6 * numSquares; i++){
		colorsStrip.push([0, color, 0, 1]);
	}
	
	gl.bindBuffer(gl.ARRAY_BUFFER, colorStrip)
	gl.bufferSubData(gl.ARRAY_BUFFER, colorOff2, flatten(colorsStrip))
	colorOff2 += 64;
	var vColor = gl.getAttribLocation(program, "vColor");
	gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 0 , 0);
	gl.enableVertexAttribArray(vColor)

	for(i = 0; i < numSquares; i += 4){
		gl.drawArrays(gl.TRIANGLE_STRIP, i, 4);
	}
}

function createTriangleFan() {
	colorsFan = [];
	var x = Math.random() * (0.7 - -0.7) + -0.7
	var y = Math.random() * (0.7 - -0.7) + -0.7
	var buffer = Math.random() * (0.01 - -0.05) + -0.05

	fanVertices.push([x,y])
	fanVertices.push([x, y+buffer])
	fanVertices.push([x+buffer, y+buffer])
	fanVertices.push([x+buffer, y])

	gl.bindBuffer(gl.ARRAY_BUFFER, fanBuffer);
	gl.bufferSubData(gl.ARRAY_BUFFER, offset3+32, flatten(fanVertices));
	var vPosition = gl.getAttribLocation(program, "vPosition");
	gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
	gl.enableVertexAttribArray(vPosition);

	var color = 255;
	for(let i = 0; i < 6 * numSquares; i++){
		colorsFan.push([0, 0, color, 1]);
	}
	
	gl.bindBuffer(gl.ARRAY_BUFFER, colorFan)
	gl.bufferSubData(gl.ARRAY_BUFFER, colorOff3, flatten(colorsFan))
	colorOff3 += 64;
	var vColor = gl.getAttribLocation(program, "vColor");
	gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 0 , 0);
	gl.enableVertexAttribArray(vColor)

	for(i = 0; i < numSquares; i += 4){
		gl.drawArrays(gl.TRIANGLE_FAN, i, 4);
	}
}

function updateVertices() {
	if (showTriangles) {
		createTraingles()
	}
	if (showStrips) {
		createTriangleStrip()
	} 
	if (showFan) {
		createTriangleFan()
	}
}

counter = 0;
function render() {
	// this is render loop

	// clear the display with the background color
    gl.clear( gl.COLOR_BUFFER_BIT );

	if (numSquares < 300) {
		updateVertices();
		numSquares++;
	}

	theta += 0.1;
	// set the theta value
	gl.uniform1f(thetaLoc, theta);

	//gl.uniform4fv(colorLoc, color_vals)
	
    setTimeout(
        function (){requestAnimFrame(render);}, delay
    );
}

function enableTriangles() {
	showTriangles = !showTriangles
	var show = "Yes"
	if(!showTriangles) {
		show = "No"
	}
	document.getElementById('tri').innerHTML = show
}

function enableStrip() {
	showStrips = !showStrips
	var show = "Yes"
	if(!showStrips){
		show = "No"
	}
	document.getElementById('strip').innerHTML = show
}

function enableFan() {
	showFan = !showFan
	var show = "Yes"
	if(!showFan){
		show = "No"
	}
	document.getElementById('fan').innerHTML = show
}

function showArtifacts(event) {
	if(event.keyCode == 49) {
		enableTriangles()
	}
	if(event.keyCode == 50) {
		enableStrip()
	}
	if(event.keyCode == 51) {
		enableFan()
	}
}

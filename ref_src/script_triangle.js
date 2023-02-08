// THIS FILE IS ONLY FOR PRACTICING AND EXPLORING. NOT FOR THE SELECTION TASK!

// Set up the canvas for drawing the 3D objects
let canvas = document.getElementById("3d_canvas");
let gl = canvas.getContext("experimental-webgl");

// Example preparing vertices of a triangle
// First, create a buffer for the vertices
let vertices = [-0.8, 0.8, -0.5, -0.5, 0.0, 0.5];
let vertexBuffer = gl.createBuffer();
// Bind empty array buffer to vertexBuffer
gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
// Write data into the buffer
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
// Unbind the buffer
gl.bindBuffer(gl.ARRAY_BUFFER, null);

// Second, create and compile Shader programs
// Create a vertex shader object and attach it to the source code
let vertexShader = gl.createShader(gl.VERTEX_SHADER);
let vertCode = 'attribute vec2 coordinates;' + 'void main() {' + 'gl_Position = vec4(coordinates,0.0, 1.0);' + 'gl_PointSize = 10.0;' + '}';
gl.shaderSource(vertexShader, vertCode);
// Compile the vertex shader
gl.compileShader(vertexShader);
// Create a fragment shader object and attach it to the source code
let fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
let fragCode = 'void main() {' + 'gl_FragColor = vec4(1.0, 0.5, 0.0, 1.0);' + '}';
gl.shaderSource(fragmentShader, fragCode);
// Compile the fragment shader
gl.compileShader(fragmentShader);
// Create a shader program object and attach the vertex and fragment shaders
let shaderProgram = gl.createProgram();
gl.attachShader(shaderProgram, vertexShader);
gl.attachShader(shaderProgram, fragmentShader);
// Link the program
gl.linkProgram(shaderProgram);
// Use the program
gl.useProgram(shaderProgram);

// Third, associate the shader program with the buffer objects
// Bind vertex buffer objects
gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
// Get the attribute location
let coord = gl.getAttribLocation(shaderProgram, "coordinates");
// Point an attribute to the currently bound VBO (vertex buffer object)
gl.vertexAttribPointer(coord, 2, gl.FLOAT, false, 0, 0);
// Enable the attribute
gl.enableVertexAttribArray(coord);

// Fourth, draw the triangle
gl.clearColor(0.0, 0.0, 0.0, 1.0);
// Enable the depth test
gl.enable(gl.DEPTH_TEST);
gl.clear(gl.COLOR_BUFFER_BIT);
// Set viewport
gl.viewport(0, 0, canvas.width, canvas.height);
// Draw the triangle
gl.drawArrays(gl.TRIANGLE_FAN, 0, 3);
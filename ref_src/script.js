// Set up the canvas for drawing the 3D objects
let canvas = document.getElementById('3d_canvas');
let gl = canvas.getContext('experimental-webgl');

// Example preparing vertices of a square sides
// First, create a buffer for the vertices, colors, and indices
let vertices = [
    // front face of the cube
    -0.5, -0.5, -0.5, 0.5, -0.5, -0.5, 0.5, 0.5, -0.5, -0.5, 0.5, -0.5,
    // back face of the cube
    -0.5, -0.5, 0.5, 0.5, -0.5, 0.5, 0.5, 0.5, 0.5, -0.5, 0.5, 0.5,
    // left face of the cube
    -0.5, -0.5, -0.5, -0.5, 0.5, -0.5, -0.5, 0.5, 0.5, -0.5, -0.5, 0.5,
    // right face of the cube
    0.5, -0.5, -0.5, 0.5, 0.5, -0.5, 0.5, 0.5, 0.5, 0.5, -0.5, 0.5,
    // top face of the cube
    -0.5, -0.5, -0.5, -0.5, -0.5, 0.5, 0.5, -0.5, 0.5, 0.5, -0.5, -0.5,
    // bottom face of the cube
    -0.5, 0.5, -0.5, -0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, -0.5,
];

let colors = [
    // Front face of the cube is colored white 
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
    // Back face of the cube is colored pink
    1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1,
    // Left face of the cube is colored blue
    0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1,
    // Right face of the cube is colored red
    1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0,
    // Top face of the cube is colored yellow
    1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 0,
    // Bottom face of the cube is colored green
    0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0
];

// Since webGL can only draw triangles, we need to create and combine triangles to create
// or approximate a square for the sides of the cubes, which is by combining two triangles
// To show the webgl on how to create the triangles, indices must be defined so that the program can know where to start drawing and where to next
let indices = [
    0, 1, 2, 0, 2, 3, 4, 5, 6, 4, 6, 7,
    8, 9, 10, 8, 10, 11, 12, 13, 14, 12, 14, 15,
    16, 17, 18, 16, 18, 19, 20, 21, 22, 20, 22, 23
];

// Create and store data into vertex buffer
let vertex_buffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
gl.bindBuffer(gl.ARRAY_BUFFER, null);
// Create and store data into color buffer
let color_buffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, color_buffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
gl.bindBuffer(gl.ARRAY_BUFFER, null);
// Create and store data into index buffer
let index_buffer = gl.createBuffer();
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, index_buffer);
gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

// Second, create and compile Shader programs
// Create a vertex shader object and attach it to the source code
// The source code is written in a strictly typed C/C++ language named GLSL
let vertCode = 'attribute vec3 position;' +
    'uniform mat4 Pmatrix;' +
    'uniform mat4 Vmatrix;' +
    'uniform mat4 Mmatrix;' +
    'attribute vec3 color;' +
    'varying vec3 vColor;' +

    'void main(void) { ' + 
    'gl_Position = Pmatrix*Vmatrix*Mmatrix*vec4(position, 1.);' +
    'vColor = color;' +
    '}';

let fragCode = 'precision mediump float;' +
    'varying vec3 vColor;' +
    'void main(void) {' +
    'gl_FragColor = vec4(vColor, 1.);' +
    '}';

// Create a vertex shader object and attach it to the source code
// After attaching, it will then be compiled so that it can be used by the GPU
let vertShader = gl.createShader(gl.VERTEX_SHADER);
gl.shaderSource(vertShader, vertCode);
gl.compileShader(vertShader);

// Create a fragment shader object and attach it to the source code
// After attaching, it will then be compiled so that it can be used by the GPU
let fragShader = gl.createShader(gl.FRAGMENT_SHADER);
gl.shaderSource(fragShader, fragCode);
gl.compileShader(fragShader);

// Create a shader program object to store the combined shader program from the vertex and fragment shader
// After that, it will be linked to the GPU and can be used by the GPU to render the scene on the canvas
let shaderProgram = gl.createProgram();
gl.attachShader(shaderProgram, vertShader);
gl.attachShader(shaderProgram, fragShader);
gl.linkProgram(shaderProgram);

// Since there is a rotation on the cube, the program will need to keep track of the location of all the vertices on the canvas
// The following code will create a variable for each of the attributes of the shader program and store the location of each attribute to be used in the rotation function later
let Pmatrix = gl.getUniformLocation(shaderProgram, "Pmatrix");
let Vmatrix = gl.getUniformLocation(shaderProgram, "Vmatrix");
let Mmatrix = gl.getUniformLocation(shaderProgram, "Mmatrix");

// After binding the vertices' information previously in code line 46 - 60,
// the following code will bind the vertices' information to the shader program
// Binding the position attributes
gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);
let position = gl.getAttribLocation(shaderProgram, "position");
gl.vertexAttribPointer(position, 3, gl.FLOAT, false, 0, 0);
gl.bindBuffer(gl.ARRAY_BUFFER, null);
gl.enableVertexAttribArray(position);
// Binding the color attributes
gl.bindBuffer(gl.ARRAY_BUFFER, color_buffer);
let color = gl.getAttribLocation(shaderProgram, "color");
gl.vertexAttribPointer(color, 3, gl.FLOAT, false, 0, 0);
gl.bindBuffer(gl.ARRAY_BUFFER, null);
gl.enableVertexAttribArray(color);

// Note that while it's optional to unbind the buffer,
// It's a good practice so that the old buffer doesn't overlap with the new buffer when the program wish to draw a new shape

// Use the shader program object to draw the cube
gl.useProgram(shaderProgram);

// Since the object is animated, the program will need to project the vertices on the canvas using the projection matrix at every second
function get_projection(angle, a, zMin, zMax) {
    let ang = Math.tan((angle * .5) * Math.PI / 180);
    return [
        0.5 / ang, 0, 0, 0,
        0, 0.5 * a / ang, 0, 0,
        0, 0, -(zMax + zMin) / (zMax - zMin), -1,
        0, 0, (-2 * zMax * zMin) / (zMax - zMin), 0
    ];
}

let proj_matrix = get_projection(45, canvas.width / canvas.height, 1, 100);
let movement_matrix = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
let view_matrix = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];

// This code snippet will zoom in the cube without changing the [-1,1] barrier
view_matrix[14] = view_matrix[14] - 2;

// For rotation functions through all x,y,z axis, the following code snippet will be used
function rotateZ(m, angle) {
    let c = Math.cos(angle);
    let s = Math.sin(angle);
    let mv0 = m[0],
        mv4 = m[4],
        mv8 = m[8];

    m[0] = c * m[0] - s * m[1];
    m[4] = c * m[4] - s * m[5];
    m[8] = c * m[8] - s * m[9];

    m[1] = c * m[1] + s * mv0;
    m[5] = c * m[5] + s * mv4;
    m[9] = c * m[9] + s * mv8;
}

function rotateX(m, angle) {
    let c = Math.cos(angle);
    let s = Math.sin(angle);
    let mv1 = m[1],
        mv5 = m[5],
        mv9 = m[9];

    m[1] = m[1] * c - m[2] * s;
    m[5] = m[5] * c - m[6] * s;
    m[9] = m[9] * c - m[10] * s;

    m[2] = m[2] * c + mv1 * s;
    m[6] = m[6] * c + mv5 * s;
    m[10] = m[10] * c + mv9 * s;
}

function rotateY(m, angle) {
    let c = Math.cos(angle);
    let s = Math.sin(angle);
    let mv0 = m[0],
        mv4 = m[4],
        mv8 = m[8];

    m[0] = c * m[0] + s * m[2];
    m[4] = c * m[4] + s * m[6];
    m[8] = c * m[8] + s * m[10];

    m[2] = c * m[2] - s * mv0;
    m[6] = c * m[6] - s * mv4;
    m[10] = c * m[10] - s * mv8;
}

// This function will be used to animate the cube's rotation and shape
let old_time = 0;
let animate = function(new_time) {
    // The base for the rotation is the current time because time has a constant speed
    let time_difference = new_time - old_time;
    rotateZ(movement_matrix, time_difference * 0.0005);
    rotateY(movement_matrix, time_difference * 0.0002);
    rotateX(movement_matrix, time_difference * 0.0003);
    old_time = new_time;

    // For 3D objects, depth testing is used to determine which object is in front of the other
    // That way, indices won't be drawn over each other
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);
    gl.clearColor(0.5, 0.5, 0.5, 0.9);
    gl.clearDepth(1.0);

    // Setting the viewport and the projection matrix. Then the objects are drawn and animated
    gl.viewport(0.0, 0.0, canvas.width, canvas.height);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.uniformMatrix4fv(Pmatrix, false, proj_matrix);
    gl.uniformMatrix4fv(Vmatrix, false, view_matrix);
    gl.uniformMatrix4fv(Mmatrix, false, movement_matrix);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, index_buffer);
    gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);

    window.requestAnimationFrame(animate);
}
animate(0);
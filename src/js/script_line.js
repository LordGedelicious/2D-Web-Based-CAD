/* Preparing the canvas and get WebGL context */
let canvas = document.getElementById('2d_canvas');
let gl = canvas.getContext('webgl');

/* Initialize empty list to store vertices for dynamic line-making */
let vertices = [[0.0, 0.0]];
// Create a new buffer object
let vertex_buffer = gl.createBuffer();
// Bind an empty array buffer to it
gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);
// Note that passing the vertices data to the buffer is not done here because it's done dynamically

// Create color buffer and pass the color data
let color_buffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, color_buffer);
let color = [ 1.0, 0.0, 0.0, 1.0,   0.0, 1.0, 0.0, 1.0 ];
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(color), gl.STATIC_DRAW); 

// Create edge buffer to connect the vertices and load them
let edge_buffer = gl.createBuffer();
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, edge_buffer);
let edges = [ 0, 1 ]; // By default there will only be 2 edges. You can add more for the advanced features
gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(edges), gl.STATIC_DRAW);

// Create vertex shader and associate it with the shader source with the colors
let vertex_shader = gl.createShader(gl.VERTEX_SHADER);
gl.shaderSource(vertex_shader,
    `attribute vec2 position;
    attribute vec4 color;
    varying vec4 vColor;
    void main() {
        vColor = color;
        gl_Position = vec4(position, 0.0, 1.0);
    }`);
gl.compileShader(vertex_shader);

// Create fragment shader and associate it with the shader source
let fragment_shader = gl.createShader(gl.FRAGMENT_SHADER);
gl.shaderSource(fragment_shader, `
    precision mediump float;
    varying vec4 vColor;
    void main() {
        gl_FragColor = vColor;
    }`);
gl.compileShader(fragment_shader);

// Create a shader program and attach the vertex and fragment shaders to it
let program = gl.createProgram();
gl.attachShader(program, vertex_shader);
gl.attachShader(program, fragment_shader);
// Linking and using the program
gl.linkProgram(program);
gl.useProgram(program);

// Get the position attribute location and enable it
let position = gl.getAttribLocation(program, 'position');
gl.enableVertexAttribArray(position);
// Binding the vertex buffer to the position attribute
gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);
gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

// Get the color attribute location and enable it
let color_location = gl.getAttribLocation(program, 'color');
gl.enableVertexAttribArray(color_location);
// Binding the color buffer to the color attribute
gl.bindBuffer(gl.ARRAY_BUFFER, color_buffer);
gl.vertexAttribPointer(color_location, 4, gl.FLOAT, false, 0, 0);

// Initially there's no vertices, so there's nothing to draw.
// Create an event listener to add a new vertex when the user clicks on the canvas
canvas.addEventListener('click', function(event) {
    let x = event.clientX;
    let y = event.clientY;

    // Add the X and Y coordinates to the vertices list
    vertices.push([2 * x / canvas.width - 1, -(2 * y / canvas.height - 1)]);
    if (vertices.length > 2) {
        // If there are more than 2 vertices, pop the nearest vertex from all vertices in the canvas
        vertices.shift();
    }
    // Update the edges array
    edges = [];
    for (let i = 0; i < vertices.length - 1; i++) {
        edges.push(i, i + 1);
    }

    document.getElementById('vertex-a-x').value = vertices[0][0];
    document.getElementById('vertex-a-y').value = vertices[0][1];
    document.getElementById('vertex-b-x').value = vertices[1][0];
    document.getElementById('vertex-b-y').value = vertices[1][1];

    gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices.flat()), gl.STATIC_DRAW);

    // Update the edge buffer with the new edges data
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, edge_buffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(edges), gl.STATIC_DRAW);

    render();
});

function getNearestVertex(x, y, verticesList) {
    let nearestVertex = null;
    let nearestDistance = 1000000;
    for (let i = 0; i < verticesList.length; i++) {
        let distance = Math.sqrt(Math.pow(x - verticesList[i][0], 2) + Math.pow(y - verticesList[i][1], 2));
        if (distance < nearestDistance) {
            nearestDistance = distance;
            nearestVertex = i;
        }
    }
    return nearestVertex;
};

// Render the vertices
function render() {
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    // Rebind and re-insert buffer data for vertex, color, and edge
    gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices.flat()), gl.STATIC_DRAW);
    gl.drawElements(gl.LINES, edges.length, gl.UNSIGNED_SHORT, 0);
    console.log('Rendering vertices...');
    for (let i = 0; i < vertices.length; i++) {
        console.log(`Vertex ${i}: ${vertices[i]}`);
    }
};

render();
var shapes = [];
var state ={
    isDone: 0,
    pass_val: {
        x: 0,
        y:0,
    }
}

let canvas = document.getElementById('2d_canvas');
var gl = canvas.getContext('webgl');
//initialize vertex buffer
var vertex_buffer = gl.createBuffer();
// Create color buffer and pass the color data
var color_buffer = gl.createBuffer();
// initialize canvas and program for webgl
const initWebGL = (canvas)=>{
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

    //get the color attribute location and enable it
    let color_location = gl.getAttribLocation(program, 'color');
    gl.enableVertexAttribArray(color_location);
    // Binding the color buffer to the color attribute
    gl.bindBuffer(gl.ARRAY_BUFFER, color_buffer);
    gl.vertexAttribPointer(color_location, 4, gl.FLOAT, false, 0, 0);
}

initWebGL(canvas);
 
canvas.addEventListener('click', (e)=>{
    let x = 2*e.clientX/canvas.width-1;
    let y = 2*e.clientY/canvas.height-1;
    
    console.log(x,y)

    let tempColor = hexColortoRGB(document.getElementById('color-picker').value);
    let tempShape = document.getElementById('shape').value;

    let kindOfShape = setShape(tempShape);

    if(state.isDone){
        shapes.push(new kindOfShape(state.pass_val.x,state.pass_val.y,x,y,tempColor)); 
        state.isDone = 0;
        console.log("masuk shape")
        render();
    }else{
        state.pass_val.x = x;
        state.pass_val.y = y;
        state.isDone = 1;
    }

    
})


const setShape = (shape)=>{
    switch(shape){
        case 'line':
            return new Line();
        case 'circle':
            return new Circle();
        case 'rectangle':
            return Rectangle;
        case 'triangle':
            return new Triangle();
        default:
            return Rectangle;
    }
}


function render() {
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    console.log('Rendering vertices...');
    console.log(shapes)
    for (let shape of shapes){
        console.log(shape)
        shape.draw();
    }
}

render();
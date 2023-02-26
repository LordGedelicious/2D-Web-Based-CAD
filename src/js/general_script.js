const translateButton = document.getElementById('translation-change');
const dilationButton = document.getElementById('dilation-change');
const saveButton = document.getElementById('save');
const specialButton = document.getElementById('special');
const loadButton = document.getElementById('load');
let clearCanvas = document.getElementById('clear-canvas');
clearCanvas.addEventListener('click', ()=>{
    shapes = [];
    state.isDone = 0;
    state.pass_val.x = 0;
    state.pass_val.y = 0;
    countEdges = 0;
    state.is_ongoing_polygon = false;
    state.list_of = [];
    console.log("clear canvas")
    updateDrawing();
})

let canvas = document.getElementById('2d_canvas');
var gl = canvas.getContext('webgl');
//initialize vertex buffer
// Create color buffer and pass the color data

var vertex_buffer = gl.createBuffer();
var color_buffer = gl.createBuffer();

// initialize canvas and program for webgl
const initWebGL = ()=>{
    let vertex_shader = gl.createShader(gl.VERTEX_SHADER);

    gl.shaderSource(vertex_shader,
        `attribute vec2 position;
        attribute vec4 color;
        varying vec4 vColor;
        void main() {
            vColor = color;
            gl_Position = vec4(position, 0.0, 1.0);
            gl_PointSize = 5.0;
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
    
    // Cr[eate a shader program and attach the vertex and fragment shaders to it
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

initWebGL();
 
canvas.addEventListener('click', (e)=>{
    let x = 2*(e.clientX-27)/canvas.width -1;
    let y = -(2*(e.clientY-27)/canvas.height-1);
    let tempShape = document.getElementById('shape').value;
    let tempColor = hexColortoRGB(document.getElementById('color-picker').value);
    let isEditPolygon = document.getElementById('isEditPolygonMode').checked;
    console.log(x,y)

    let isDrawing = document.getElementById('isDrawing').checked;
    let isMovePoint = document.getElementById('isMovePoint').checked;
    if(!isDrawing){
        let node = getNode(x,y)
        let clickedShape = -1;
        clickedShape = getClickedShape(x,y);
        state.clicked = clickedShape;
        console.log("shapenya: ",[node])
        if(node){
            //console.log("shapenya: ",shapes[node.idx], "indeks: ",ans)
            shapes[node.idx].changeColorOnNode(hexColortoRGB(document.getElementById('color-picker').value),[node.x,node.y]);
            rebind();
        }
        else if(clickedShape !== -1){
            console.log("clicked shape: ",clickedShape)
            shapes[clickedShape].changeColor(hexColortoRGB(document.getElementById('color-picker').value));
            rebind();
        }
    }else if(isEditPolygon&&tempShape === 'polygon'){
        let node = getNode(x,y)
        let clickedShape = -1;
        clickedShape = getClickedShape(x,y);
        if(clickedShape !== -1){
            console.log("clicked shape--: ",clickedShape)
            state.poly = clickedShape;
        }
        if(node){
            shapes[node.idx].removeNode([node.x,node.y]);
            rebind();
        }else if(clickedShape === -1 && state.poly !== -1){
            console.log("lalalalala", state.poly)
            shapes[state.poly].addNode([x,y],[tempColor]);
            rebind();
        }
    }else if (isMovePoint) {
        if (!movingPoint) {
            movingPoint = true;
            let node = getNode(x,y);
            selected.objectIdx = node.idx;
            selected.pointIdx = getPointIdx(node.idx, node.x, node.y);
            // console.log("selected: ", selected)
        }
        else {
            shapes[selected.objectIdx].moveVertex(x, y);
            rebind()
            console.log(shapes[selected.objectIdx].x1, shapes[selected.objectIdx].y1, shapes[selected.objectIdx].x2, shapes[selected.objectIdx].y2)
            movingPoint = false;
        }
    }else if(tempShape === 'polygon'){
        if(state.is_ongoing_polygon){
            state.list_of.push([x,y])
            rebind()
            gl.bindBuffer(gl.ARRAY_BUFFER,vertex_buffer)
            console.log("temp state:", state.list_of)
            gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(state.list_of.flat()),gl.STATIC_DRAW);
            gl.drawArrays(gl.TRIANGLE_FAN,0,state.list_of.length);
            gl.drawArrays(gl.POINTS,0,state.list_of.length);

        }else{
            state.list_of.push([x,y])
            rebind();
            gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(state.list_of.flat()),gl.STATIC_DRAW);
            gl.drawArrays(gl.POINTS,0,1);
            state.is_ongoing_polygon = true;

        }
    }
    else{
        console.log("color for rend:", tempColor)
        console.log("kind of shape:",  tempShape)
        let kindOfShape = setShape(tempShape);
        console.log("ngambar:", state)
        if(state.isDone === 1){
            shapes.push(new kindOfShape(state.pass_val.x,state.pass_val.y,x,y,([tempColor]))); 
            state.isDone = 0;
            console.log("masuk shape", shapes.length)
            rebind();
        }else{
            state.pass_val.x = x;
            state.pass_val.y = y;
            state.isDone = 1;
        }
    }
    
})

canvas.addEventListener("mousemove", (e) => {
    let x = 2*(e.clientX-27)/canvas.width -1;
    let y = -(2*(e.clientY-27)/canvas.height-1);

    let isDrawing = document.getElementById('isDrawing').checked;
    let isMovePoint = document.getElementById('isMovePoint').checked;
    
    if (isMovePoint && isDrawing && movingPoint) {
        shapes[selected.objectIdx].moveVertex(x, y);
        rebind()
    }
})

translateButton.addEventListener('click', ()=>{
    console.log("clicked: ", state.clicked)
    let x = parseFloat(document.getElementById('translate-x').value);
    let y = parseFloat(document.getElementById('translate-y').value);
    shapes[state.clicked].translate(x,y);
    rebind();
})

dilationButton.addEventListener('click', ()=>{
    console.log("clicked: ", state.clicked)
    let x = parseFloat(document.getElementById('dilate-factor').value);
    shapes[state.clicked].dilate(x);
    rebind();
})

saveButton.addEventListener('click', ()=>{
    lshape = saveFile(shapeToFile());
})

const loadFile = document.getElementById('loadFile');
loadFile.addEventListener('change', (e)=>{
    var file = e.target.files[0];
    var fr = new FileReader();
    fr.onload = function(e) {
        loadingFile(e.target.result);
    }
    fr.readAsText(file);
    rebind();   
})

const loadingFile = (text)=>{
    text = text.trim()
    shapes = []
    let kind = {};
    let vert = []
    let color = [];
    let lines = text.split("\n");
    lines.forEach(x =>{
        target = x.trim()
        if(target.length === 0) return;
        if(target[0] === '/' && target[1] === '/'){
            vert = [];
            color = [];
            shape = target.slice(3);
            console.log("shape: ",shape)
            kind = setShape(shape);
        }else if(target[0] === '*'){
            if(kind.name==="Polygon"){
                console.log("constructing: ",vert,color)
                shapes.push(new kind(vert,color))
            }else if(kind.name==="Line"){
                console.log("constructing: ",vert[0][0],vert[0][1],vert[1][0],vert[1][1],color)
                shapes.push(new kind(vert[0][0],vert[0][1],vert[1][0],vert[1][1],color))
            }else{
                console.log("constructing: ",vert[0][0],vert[0][1],vert[2][0],vert[2][1],color)
                shapes.push(new kind(vert[0][0],vert[0][1],vert[2][0],vert[2][1],color))
            }
        }else{
            console.log("target: ",target )
            let temp = target.split(" ");
            vert.push([parseFloat(temp[0]),parseFloat(temp[1])]);
            color.push([parseFloat(temp[2]),parseFloat(temp[3]),parseFloat(temp[4]),1]);
        }
    })
    rebind();
}

const shapeToFile = () =>{
    strings = []
    shapes.forEach(x =>{
        console.log("prin shape: ",x)
        let shapeName = (()=>{
            if (x instanceof Line) return "line"
            else if (x instanceof Rectangle) return "rectangle"
            else if (x instanceof Square) return "square"
            else if (x instanceof Polygon) return "polygon"
        })();
        strings.push("// "+shapeName+ "\n" + x.toString());
    })
    return new Blob(strings, {type: "text/plain;charset=utf-8"});
}

const rebind = ()=>{
    console.log("shapes: ",shapes)
    updateDrawing();
}

const getClickedShape = (x,y)=>{
    for (let i = shapes.length-1; i >= 0; i--) {
        if(shapes[i].isInside(x,y)){
            console.log("masuk:", i)
            return i;
        }
    }
    return -1;
}


const setShape = (shape)=>{
    switch(shape){
        case 'line':
            return Line;
        case 'rectangle':
            return Rectangle;
        case 'square':
            return Square;
        case 'polygon':
            return Polygon;
        default:
            return Rectangle;
    }
}

updateDrawing();

function saveFile(blob) {
    let url = URL.createObjectURL(blob);
    let a = document.createElement('a');
    a.style.display = "none";
    a.href = url;
    a.download = Date.now() + ".txt";
    document.body.appendChild(a);
    window.requestAnimationFrame(function() {
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
    })
}


specialButton.addEventListener('click',()=>{
    console.log("clicked: ", state.clicked)
    let x = document.getElementById('vertex-x').value;
    let y = document.getElementById('vertex-y').value;
    let isDrawing =document.getElementById('isDrawing').checked;
    if(!isDrawing){
        console.log("masukkk")
        shapes[state.clicked].special(x,y);
        rebind();
    }
})


canvas.addEventListener('contextmenu', (e)=>{
    if(state.is_ongoing_polygon){
        state.is_ongoing_polygon = false;
        state.isDone = 0;
        let tempColor = hexColortoRGB(document.getElementById('color-picker').value);
        state.is_ongoing_polygon = false;
        shapes.push(new Polygon(state.list_of, [tempColor]));
        state.list_of = [];
        console.log("masuk shape: ", state.list_of)
        rebind();
    }
})

const shapeMode = document.getElementById('shape');

shapeMode.addEventListener('change', (e) => {
    if(e.target.value === 'polygon'){
        document.getElementById('polygon').style.display = 'block';
        document.getElementById('special-mode').style.display = 'none';
    }else{
        document.getElementById('polygon').style.display = 'none';
        document.getElementById('special-mode').style.display = 'block';
    }
})
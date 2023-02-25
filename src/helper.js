var globEdges = [];
var globVertices = [];
var countEdges = 0;
var shapes = [];
var globColors = [];
var state ={
    isDone: 0,
    pass_val: {
        x: 0,
        y:0,
    },
    clicked: 0,
}

const hexColortoRGB = (hex)=>{
    return [Number('0x'+hex.substr(1,2))/255,Number('0x'+hex.substr(3,2))/255,Number('0x'+hex.substr(5,2))/255,1]
}

const getDistance = (x1,y1,x2,y2)=>{
    let x = x1-x2;
    let y = y1-y2;
    return Math.sqrt(x*x+y*y)
}

class Color{
    constructor(red, green, blue){
        this.red = red
        this.green = green
        this.blue = blue
    }

    toArray(){
        return [this.red, this.green, this.blue]
    }
}

class Shape{
    constructor(color, vertices,edges){
        this.vertices = vertices;
        this.colors = []
        for(let idx = 0; idx<vertices.length; idx++){
            this.colors.push(...color)
        }
        this.edges = edges;
        this.edges_count = edges.length;
    }

    toString(){
        return`
            number of vertices: ${this.vertices.length}\t
            vertices: ${this.vertices}\t
            color per vertex: ${this.colors}\t
        `
    }

    draw(shape){
        globEdges.push(...this.edges)
        globVertices.push(...this.vertices)
        console.log("before", globColors)
        globColors.push(...this.colors)
        console.log("colors:", globColors)
        updateDrawing(shape)
    }

    changeColor(color){
        this.colors = []
        for(let idx = 0; idx<this.vertices.length; idx++){
            this.colors.push(...color)
        }
        console.log("jadinya: ", this.colors)
        return this;
    }

    changeColorOnNode(color, node){
        for(let i=0;i<this.vertices.length;i++){
            if(this.vertices[i][0] === node[0] && this.vertices[i][1] === node[1]){
                this.colors[i*4] = color[0]
                this.colors[i*4+1] = color[1]
                this.colors[i*4+2] = color[2]
            }
        }
        return this;
    }

    dilate(x){
        for(let i=0;i<this.vertices.length;i++){
            this.vertices[i][0] *= x
            this.vertices[i][1] *= x
        }
        return this;
    }

    translate(x,y){
        for(let i=0;i<this.vertices.length;i++){
            this.vertices[i][0] += parseFloat(x)
            this.vertices[i][1] += parseFloat(y)
        }
        return this;
    }

    toString(){
        let str = "\\"
        for(let i=0;i<this.vertices.length;i++){
            str += this.vertices[i][0] + " " + this.vertices[i][1] + " " + this.colors[i*4] + " " + this.colors[i*4+1] + " " + this.colors[i*4+2] + "\n"
        } 
        str += "*"

        return str;
    }

}

class Square extends Shape{ 
    constructor(x1,y1,x2,y2, colors){

        // gua masi mikir ytansformasinya
        if((x1<x2&&y1>y2)||(x1>x2 && y1<y2)){
            y2 = y1 + (x1-x2);
        }else{
            y2 = y1 + (x2-x1)
        }
        super(colors, [[x1,y1], [x1,y2], [x2,y2], [x2,y1]],[countEdges+3, countEdges+2,countEdges+1,countEdges+3, countEdges+1, countEdges])
        countEdges += 4

        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;
    }

    translate(x,y){
        super.translate(x,y)
        this.x1 += x
        this.x2 += x
        this.y1 += y
        this.y2 += y
    }

    dilate(x){
        super.dilate(x)
        this.x1 *= x
        this.x2 *= x
        this.y1 *= x
        this.y2 *= x
    }

    draw(){
        super.draw(gl.TRIANGLES);
    }

    isInside(x,y){
        return (x>=this.x1 && x<=this.x2 && y>=this.y1 && y<=this.y2) || 
            (x>=this.x2 && x<=this.x1 && y>=this.y2 && y<=this.y1) ||
            (x>=this.x1 && x<=this.x2 && y>=this.y2 && y<=this.y1) ||
            (x>=this.x2 && x<=this.x1 && y>=this.y1 && y<=this.y2)
    }
}

class Rectangle extends Shape{ 
    constructor(x1,y1,x2,y2, colors){
        // gua masi mikir ytansformasinya
        super(colors, [[x1,y1], [x1,y2], [x2,y2], [x2,y1]],[countEdges+3, countEdges+2,countEdges+1,countEdges+3, countEdges+1, countEdges])
        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;
        countEdges += 4
    }

    translate(x,y){
        super.translate(x,y)
        this.x1 += x
        this.x2 += x
        this.y1 += y
        this.y2 += y
    }

    dilate(x){
        super.dilate(x)
        this.x1 *= x
        this.x2 *= x
        this.y1 *= x
        this.y2 *= x
    }

    draw(){
        super.draw(gl.TRIANGLES);
    }

    isInside(x,y){
        return (x>=this.x1 && x<=this.x2 && y>=this.y1 && y<=this.y2) || 
            (x>=this.x2 && x<=this.x1 && y>=this.y2 && y<=this.y1) ||
            (x>=this.x1 && x<=this.x2 && y>=this.y2 && y<=this.y1) ||
            (x>=this.x2 && x<=this.x1 && y>=this.y1 && y<=this.y2)
    }
}

class Line extends Shape{
    constructor(x1,y1,x2,y2, colors){
        console.log(colors)
        super(colors, [[x1,y1], [x2,y2]],[countEdges+1])
        countEdges++
    }

    draw(){
        super.draw(gl.LINES);
    }

    isInside(x,y){
        let equation = (x1-x2)/(y1-y2) == (x-x2)/(y-y2)
        let checkPos = (y1 <= y &&  y <= y2) || (y2 <= y && y <= y1)
        return equation && checkPos
    }

    translate(x,y){
        super.translate(x,y)
        this.x1 += x
        this.x2 += x
        this.y1 += y
        this.y2 += y
    }

    dilate(x){
        super.dilate(x)
        this.x1 *= x
        this.x2 *= x
        this.y1 *= x
        this.y2 *= x
    }
}

class Polygon extends Shape{
    constructor(){
        super();
    }
}



function render(shape) {
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    console.log('Rendering edges...', globEdges);
    gl.drawElements(shape, globEdges.length, gl.UNSIGNED_SHORT, 0);

    //draw points
    gl.drawArrays(gl.POINTS, 0, globVertices.length);
}

function updateDrawing(shape){
    gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(globVertices.flat()), gl.STATIC_DRAW);
    // Update the edge buffer with the new edges data
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, edge_buffer); 
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(globEdges), gl.STATIC_DRAW);

    //update color
    gl.bindBuffer(gl.ARRAY_BUFFER, color_buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(globColors), gl.STATIC_DRAW);

    render(shape);
}

const getMinimumDistanceOfShape = (shape,x,y) =>{
    
    if(!(shape instanceof Polygon)){
        points = [{
            x: shape.x1,
            y: shape.y1,
            dist: getDistance(x, y, shape.x1, shape.y1) 
        },{
            x: shape.x2,
            y: shape.y2,
            dist: getDistance(x, y, shape.x2, shape.y2)
        },{
            x: shape.x1,
            y: shape.y2,
            dist: getDistance(x, y, shape.x1, shape.y2)
        },{
            x: shape.x2,   
            y: shape.y1,
            dist: getDistance(x, y, shape.x2, shape.y1)
        }]
        let ret = points.sort((a,b)=>a.dist-b.dist)[0]
        console.log("min ",ret)
        return ret;
    }
}

const getNode = (x,y) =>{
    console.log("Lokasi: ",x,y)
    let ret = null;
    if(!shapes.length) return ret;
    let dist  = Number.MAX_SAFE_INTEGER;
    let ans = -1;
    for(let i = 0; i<shapes.length; i++){
        let temp = getMinimumDistanceOfShape(shapes[i],x,y);
        if(!temp) continue;
        if(temp.dist < dist){
            ret = temp;
            dist = temp.dist;
            ans = i;
        }
    }
    if(dist > 0.03) return null;
    ret.idx = ans;
    return ret;
}
var shapes = [];
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

function testHello (){
    console.log("hello")
}

class Shape{
    constructor(color, vertices,edges){
        this.vertices = vertices;
        this.colors =[];
        this.edges = edges;
        console.log("color: ", color)
        if(color.length !== this.vertices.length){
            for(let idx = 0; idx<this.vertices.length; idx++){
                this.colors.push(...color)
            }
        }else{
            this.colors = color
        }
    }

    draw(shape){
        let vc = []
        let cp = []
        console.log("edges: ", this.colors)
        this.edges.forEach((x)=>{
            vc.push(this.vertices[x])
            cp.push(...this.colors[x])
        })

        console.log("vc: ", vc, this.vertices.length)
        gl.bindBuffer(gl.ARRAY_BUFFER,vertex_buffer)
        gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(vc.flat()),gl.STATIC_DRAW);
        gl.bindBuffer(gl.ARRAY_BUFFER,color_buffer)
        gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(cp.flat()),gl.STATIC_DRAW);
        gl.drawArrays(shape,0,Math.floor(this.edges.length));

    }

    changeColor(color){
        this.colors = []
        for(let idx = 0; idx<this.vertices.length; idx++){
            this.colors.push(color)
        }
        console.log("jadinya: ", this.colors)
    }

    changeColorOnNode(color, node){
        for(let i=0;i<this.vertices.length;i++){
            if(this.vertices[i][0] === node[0] && this.vertices[i][1] === node[1]){
                this.colors[i] = color
            }
        }
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
        let str = ""
        for(let i=0;i<this.vertices.length;i++){
            str += this.vertices[i][0] + " " + this.vertices[i][1] + " " + this.colors[i][0] + " " + this.colors[i][1] + " " + this.colors[i][2] + "\n"
        } 
        str += "*\n,"

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
        super(colors, [[x1,y1], [x2,y1], [x2,y2], [x1,y2]], [0,1,3,1,2,3])
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

    special(x,y){
        x = parseFloat(x ? x : 0)
        y = parseFloat(y ? y : 0)
        let factor = Math.abs(x) > Math.abs(y) ? x : y;
        let x1 = this.x1 + factor;
        let y1 = this.y1 + factor;
        let x2 = this.x2
        let y2 = this.y2
        if((x1<x2&&y1>y2)||(x1>x2 && y1<y2)){
            y2 = y1 + (x1-x2);
        }else{
            y2 = y1 + (x2-x1)
        }
        this.vertices = [[x1,y1], [x2,y1], [x2,y2], [x1,y2]]
        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;
        console.log("vertices: ", this.vertices)
    }
}

class Rectangle extends Shape{ 
    constructor(x1,y1,x2,y2, colors){
        // gua masi mikir ytansformasinya
        super(colors, [[x1,y1], [x2,y1], [x2,y2], [x1,y2]], [0,1,3,1,2,3])
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

    special(x,y){
        x = parseFloat(x ? x : 0)
        y = parseFloat(y ? y : 0)
        this.x1 = this.x1 + x;
        this.y1 = this.y1 + y;
        this.vertices = [[this.x1,this.y1], [this.x2,this.y1], [this.x2,this.y2], [this.x1,this.y2]]

    }
}

class Line extends Shape{
    constructor(x1,y1,x2,y2, colors){
        console.log(colors)
        super(colors, [[x1,y1], [x2,y2]],[0,1])
        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;
    }

    draw(){
        super.draw(gl.LINES);
    }

    isInside(x,y){
        let equation = (this.x1-this.x2)/(this.y1-this.y2) == (x-this.x2)/(y-this.y2)
        let checkPos = (this.y1 <= y &&  y <= this.y2) || (this.y2 <= y && y <= this.y1)
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




function updateDrawing(){
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);
    console.log(": ", shapes)
    for(let i=0;i<shapes.length;i++){
        console.log("shapenya",i,shapes[i])
        shapes[i].draw()
    }
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
    if(dist > 0.05) return null;
    ret.idx = ans;
    return ret;
}
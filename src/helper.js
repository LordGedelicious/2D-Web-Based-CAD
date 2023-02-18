const hexColortoRGB = (hex)=>{
    return [Number('0x'+hex.substr(1,2))/255,Number('0x'+hex.substr(3,2))/255,Number('0x'+hex.substr(5,2))/255,1]
}

const getDistance = (x1,x2,y1,y2)=>{
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


class Polygon extends Shape{
    constructor(){
        super();
    }
}
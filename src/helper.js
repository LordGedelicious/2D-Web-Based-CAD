const hexColortoRGB = (hex)=>{
    return [Number('0x'+hex.substr(1,2)),Number('0x'+hex.substr(3,2)),Number('0x'+hex.substr(5,2))]
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
        this.colors = color;
        this.edges = edges;
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
        updateDrawing(shape)
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
    }

    draw(){
        super.draw(gl.TRIANGLES);
    }
}

class Rectangle extends Shape{ 
    constructor(x1,y1,x2,y2, colors){
        // gua masi mikir ytansformasinya
        super(colors, [[x1,y1], [x1,y2], [x2,y2], [x2,y1]],[countEdges+3, countEdges+2,countEdges+1,countEdges+3, countEdges+1, countEdges])
        countEdges += 4
    }

    draw(){
        super.draw(gl.TRIANGLES);
    }
}

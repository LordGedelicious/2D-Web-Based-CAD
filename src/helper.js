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
    constructor(color, vertices){
        this.vertices = vertices;
        this.colors = color;
    }

    toString(){
        return`
            number of vertices: ${this.vertices.length}\t
            vertices: ${this.vertices}\t
            color per vertex: ${this.colors}\t
        `
    }

    draw(){
        let cvertices = [];
        for(let i =0;i<this.vertices.length;i++){
            console.log("spec:",...this.vertices[i],...this.colors[i])
            cvertices.push(...this.vertices[i],...this.colors[i]);
        }

        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(cvertices), gl.STATIC_DRAW);


        let count = this.vertices.length;

        gl.drawArrays(gl.TRIANGLE_FAN, 0, count)
    }

}

class Rectangle extends Shape{ 
    constructor(x1,y1,x2,y2, colors){
        // gua masi mikir ytansformasinya
        if((x1<x2&&y1>y2)||(x1>x2 && y1<y2)){
            y2 = y1 + (x1-x2);
        }else{
            y2 = y1 + (x2-x1)
        }
        super(colors, [[x1,y1], [x1,y2], [x2,y2], [x2,y1]])
    }

    draw(){
        console.log("drawing rectangle")
        super.draw();
    }
}

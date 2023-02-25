/* Initiate and prepare the canvas */
let canvas = document.getElementById('canvas');
let gl = canvas.getContext('webgl');
gl.clearColor(0.0, 0.0, 0.0, 1.0);
gl.clear(gl.COLOR_BUFFER_BIT);

/* Initialize the vertices */

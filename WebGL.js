//TODO HW03
//! Below is copy from Lab
function compileShader(gl, vShaderText, fShaderText) {
    //////Build vertex and fragment shader objects
    var vertexShader = gl.createShader(gl.VERTEX_SHADER)
    var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER)
    //The way to  set up shader text source
    gl.shaderSource(vertexShader, vShaderText)
    gl.shaderSource(fragmentShader, fShaderText)
    //compile vertex shader
    gl.compileShader(vertexShader)
    if(!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)){
        console.log('vertex shader ereror');
        var message = gl.getShaderInfoLog(vertexShader); 
        console.log(message);//print shader compiling error message
    }
    //compile fragment shader
    gl.compileShader(fragmentShader)
    if(!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)){
        console.log('fragment shader ereror');
        var message = gl.getShaderInfoLog(fragmentShader);
        console.log(message);//print shader compiling error message
    }

    /////link shader to program (by a self-define function)
    var program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    //if not success, log the program info, and delete it.
    if(!gl.getProgramParameter(program, gl.LINK_STATUS)){
        alert(gl.getProgramInfoLog(program) + "");
        gl.deleteProgram(program);
    }

    return program;
}

function initAttributeVariable(gl, a_attribute, buffer){
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.vertexAttribPointer(a_attribute, buffer.num, buffer.type, false, 0, 0);
    gl.enableVertexAttribArray(a_attribute);
}
  
function initArrayBufferForLaterUse(gl, data, num, type) {
    // Create a buffer object
    var buffer = gl.createBuffer();
    if (!buffer) {
        console.log('Failed to create the buffer object');
        return null;
    }
    // Write date into the buffer object
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);

    // Store the necessary information to assign the object to the attribute variable later
    buffer.num = num;
    buffer.type = type;

    return buffer;
}

function initVertexBufferForLaterUse(gl, vertices, normals, texCoords){
    var nVertices = vertices.length / 3;

    var o = new Object();
    o.vertexBuffer = initArrayBufferForLaterUse(gl, new Float32Array(vertices), 3, gl.FLOAT);
    if( normals != null ) o.normalBuffer = initArrayBufferForLaterUse(gl, new Float32Array(normals), 3, gl.FLOAT);
    if( texCoords != null ) o.texCoordBuffer = initArrayBufferForLaterUse(gl, new Float32Array(texCoords), 2, gl.FLOAT);
    //you can have error check here
    o.numVertices = nVertices;

    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

    return o;
}

//! Variables
var mouseLastX, mouseLastY;
var mouseDragging = false;
var angleX = 0, angleY = 0;
var gl, canvas;

var nVertex;
var cameraX = 3, cameraY = 3, cameraZ = 7;

//* Changing variables
var scale = 0;
var offset_x = 0, offset_z = 0;
var angle1 = 0.0, angle2 = 0.0, angle3 = 0.0;
var angle4 = 0.0, angle5 = 0.0;

//* Grab
var is_touch = 0;
var is_grab = 0;

var coordinateRobot = new Vector4([0.0, 0.0, 0.0, 1.0]);
var coordinateRobotWorld;
var coordinateObject = new Vector4([0.0, 0.0, 0.0, 1.0]);
var coordinateObjectWorld;

//! Main function
async function main() { 
    canvas = document.getElementById("webgl");
    gl = canvas.getContext("webgl2");
    if (!gl) {
        console.log("Failed to get the rendering context for WebGL");
        return;
    }
    program = compileShader(gl, VSHADER_SOURCE, FSHADER_SOURCE);
    gl.useProgram(program);

    program.a_Position = gl.getAttribLocation(program, 'a_Position'); 
    program.a_Normal = gl.getAttribLocation(program, 'a_Normal'); 
    program.u_MvpMatrix = gl.getUniformLocation(program, 'u_MvpMatrix'); 
    program.u_modelMatrix = gl.getUniformLocation(program, 'u_modelMatrix'); 
    program.u_normalMatrix = gl.getUniformLocation(program, 'u_normalMatrix');
    // program.u_LightMdlMatrix = gl.getUniformLocation(program, 'u_LightMdlMatrix');
    program.u_LightPosition = gl.getUniformLocation(program, 'u_LightPosition');
    program.u_ViewPosition = gl.getUniformLocation(program, 'u_ViewPosition');
    program.u_Ka = gl.getUniformLocation(program, 'u_Ka');
    program.u_Kd = gl.getUniformLocation(program, 'u_Kd');
    program.u_Ks = gl.getUniformLocation(program, 'u_Ks');
    program.u_shininess = gl.getUniformLocation(program, 'u_shininess');
    program.u_Color = gl.getUniformLocation(program, 'u_Color');

    setGround();
    getAllModelData();
    interface();
    draw();
}

//! mouse event
function mouseDown(ev){ 
    var x = ev.clientX;
    var y = ev.clientY;
    var rect = ev.target.getBoundingClientRect();
    if( rect.left <= x && x < rect.right && rect.top <= y && y < rect.bottom){
        mouseLastX = x;
        mouseLastY = y;
        mouseDragging = true;
    }
}

function mouseUp(ev){ 
    mouseDragging = false;
}

function mouseMove(ev){ 
    var x = ev.clientX;
    var y = ev.clientY;
    if( mouseDragging ){
        var factor = 100 / canvas.height; //100 determine the spped you rotate the object
        var dx = factor * (x - mouseLastX);
        var dy = factor * (y - mouseLastY);

        angleX += dx; //yes, x for y, y for x, this is right
        angleY += dy;
    }
    mouseLastX = x;
    mouseLastY = y;

    draw();
}

function interface() { 
    canvas.onmousedown = function (evt) { mouseDown(evt);}
    canvas.onmousemove = function (evt) { mouseMove(evt); }
    canvas.onmouseup = function (evt) { mouseUp(evt); }

    //* Slider
    var zooming = document.getElementById("zoom");
    zooming.oninput = function () { 
        scale = this.value;
        draw();
    }
    var off_x = document.getElementById("movement-x");
    off_x.oninput = function () { 
        offset_x = this.value / 100.0;
        draw();
    }
    var off_z = document.getElementById("movement-z");
    off_z.oninput = function () { 
        offset_z = this.value / 100.0;
        draw();
    }
    var deg1 = document.getElementById("rotate-1");
    deg1.oninput = function () { 
        angle1 = this.value;
        draw();
    }
    var deg2 = document.getElementById("rotate-2");
    deg2.oninput = function () { 
        angle2 = this.value;
        draw();
    }
    var deg3 = document.getElementById("rotate-3");
    deg3.oninput = function () { 
        angle3 = this.value;
        draw();
    }
    var deg4 = document.getElementById("obj-rotate-1");
    deg4.oninput = function () { 
        angle4 = this.value;
        draw();
    }
    var deg5 = document.getElementById("obj-rotate-2");
    deg5.oninput = function () { 
        angle5 = this.value;
        draw();
    }

    document.addEventListener('keydown', function (evt) {
        if (evt.key == 'G' || evt.key == 'g') {
            if (is_touch === 1) {
                console.log("Can grab!!");
                if (is_grab === 1) {
                    is_grab = 0;
                    console.log("Release!!");
                    var tempForObjAfterGrab = new Matrix4(touchObjModelMatrix);
                    tempForObjAfterGrab.translate(0.0, 0.0, -2.35);
                    tempForObjAfterGrab.scale(1.92, 1.92, 1.14);
                    tempForObjAfterGrab.rotate(-angle5, 0.0, 0.0, 1.0);
                    objectModelMatrix = new Matrix4(tempForObjAfterGrab);
                } else { console.log("Got it!!"), is_grab = 1;}
            } else { is_grab = 0; }
        }
        draw();
    });
}

function draw() { 
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(0.8,0.8,0.8,1);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.enable(gl.DEPTH_TEST);
    setDrawModelMatrix();
}

function getNormalOnVertices(vertices){
    var normals = [];
    var nTriangles = vertices.length/9;
    for(let i=0; i < nTriangles; i ++ ){
        var idx = i * 9 + 0 * 3;
        var p0x = vertices[idx+0], p0y = vertices[idx+1], p0z = vertices[idx+2];
        idx = i * 9 + 1 * 3;
        var p1x = vertices[idx+0], p1y = vertices[idx+1], p1z = vertices[idx+2];
        idx = i * 9 + 2 * 3;
        var p2x = vertices[idx+0], p2y = vertices[idx+1], p2z = vertices[idx+2];
  
        var ux = p1x - p0x, uy = p1y - p0y, uz = p1z - p0z;
        var vx = p2x - p0x, vy = p2y - p0y, vz = p2z - p0z;
  
        var nx = uy*vz - uz*vy;
        var ny = uz*vx - ux*vz;
        var nz = ux*vy - uy*vx;
  
        var norm = Math.sqrt(nx*nx + ny*ny + nz*nz);
        nx = nx / norm;
        ny = ny / norm;
        nz = nz / norm;
  
        normals.push(nx, ny, nz, nx, ny, nz, nx, ny, nz);
    }
    return normals;
}

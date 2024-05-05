//obj: the object components
//mdlMatrix: the model matrix without mouse rotation
//colorR, G, B: object color

//! Variables
var mvpMatrix, modelMatrix, normalMatrix;

var ground = [];
var groundVertices = [];

//! Objects
let cylinderObj = [];

function drawOneObject(obj, mdlMatrix, colorR, colorG, colorB) {
    mvpMatrix = new Matrix4();
    modelMatrix = new Matrix4();
    normalMatrix = new Matrix4();

    //model Matrix (part of the mvp matrix)
    if (mdlMatrix != lightModleMatrix) { 
        modelMatrix.setRotate(angleY, 1, 0, 0);//for mouse rotation
        modelMatrix.rotate(angleX, 0, 1, 0);//for mouse rotation
    }
    // gl.uniformMatrix4fv(program.u_LightMdlMatrix, false, modelMatrix.elements);
    modelMatrix.multiply(mdlMatrix);
    //mvp: projection * view * model matrix  
    mvpMatrix.setPerspective(70 - scale, canvas.width / canvas.height, 1, 15);
    mvpMatrix.lookAt(cameraX, cameraY, cameraZ, 0, 0, -2, 0, 1, 0);
    mvpMatrix.multiply(modelMatrix);

    //normal matrix
    normalMatrix.setInverseOf(modelMatrix);
    normalMatrix.transpose();

    // gl.uniform3f(program.u_LightPosition, modelMatrix.elements[12], modelMatrix.elements[13], modelMatrix.elements[14]);
    gl.uniform3f(program.u_LightPosition, 0, 5, -5);
    gl.uniform3f(program.u_ViewPosition, cameraX, cameraY, cameraZ);
    gl.uniform1f(program.u_Ka, 0.2);
    gl.uniform1f(program.u_Kd, 0.7);
    gl.uniform1f(program.u_Ks, 1.0);
    gl.uniform1f(program.u_shininess, 15.0);
    gl.uniform3f(program.u_Color, colorR, colorG, colorB);

    gl.uniformMatrix4fv(program.u_MvpMatrix, false, mvpMatrix.elements);
    gl.uniformMatrix4fv(program.u_modelMatrix, false, modelMatrix.elements);
    gl.uniformMatrix4fv(program.u_normalMatrix, false, normalMatrix.elements);

    for( let i=0; i < obj.length; i ++ ){
        initAttributeVariable(gl, program.a_Position, obj[i].vertexBuffer);
        initAttributeVariable(gl, program.a_Normal, obj[i].normalBuffer);
        gl.drawArrays(gl.TRIANGLES, 0, obj[i].numVertices);
    }
}

function setGround() { 
    //F: Face, T: Triangle, V: vertex (XYZ)
    var V0 = [1.0, 1.0, 1.0];
    var V1 = [-1.0, 1.0, 1.0];
    var V2 = [-1.0, -1.0, 1.0];
    var V3 = [1.0, -1.0, 1.0];
    var V4 = [1.0, -1.0, -1.0];
    var V5 = [1.0, 1.0, -1.0];
    var V6 = [-1.0, 1.0, -1.0];
    var V7 = [-1.0, -1.0, -1.0];
    groundVertices = [
        V1, V2, V0, V0, V2, V3,   //this row for the face z = 1.0
        V0, V3, V4, V5, V0, V4,   //this row for the face x = 1.0
        V5, V6, V1, V5, V1, V0,   //this row for the face y = 1.0
        V1, V7, V2, V1, V6, V7,   //this row for the face x = -1.0
        V2, V4, V3, V7, V4, V2,   //this row for the face y = -1.0
        V5, V4, V7, V5, V7, V6,   //this row for the face z = -1.0
    ];
    groundVertices = groundVertices.flat(1);
    let cubeNormals = getNormalOnVertices(groundVertices);
    let o = initVertexBufferForLaterUse(gl, groundVertices, cubeNormals, null);
    ground.push(o);
}

async function getAllModelData() { 
    //TODO Load all models
    cylinderObj = await load_model("./object/cylinder.obj");
}

async function load_model(dataPath) { 
    let obj_data = [];
    let response = await fetch(dataPath);
    let text = await response.text();
    let object = parseOBJ(text);
    for (let i = 0; i < object.geometries.length; i++) {
        let o = initVertexBufferForLaterUse(
            gl,
            object.geometries[i].data.position,
            object.geometries[i].data.normal,
            object.geometries[i].data.texcoord
        );
        obj_data.push(o);
    }
    return obj_data;
}

function parseOBJ(text) {
    // because indices are base 1 let's just fill in the 0th data
    const objPositions = [[0, 0, 0]];
    const objTexcoords = [[0, 0]];
    const objNormals = [[0, 0, 0]];

    // same order as `f` indices
    const objVertexData = [objPositions, objTexcoords, objNormals];

    // same order as `f` indices
    let webglVertexData = [
        [], // positions
        [], // texcoords
        [], // normals
    ];

    const materialLibs = [];
    const geometries = [];
    let geometry;
    let groups = ["default"];
    let material = "default";
    let object = "default";

    const noop = () => {};

    function newGeometry() {
        // If there is an existing geometry and it's
        // not empty then start a new one.
        if (geometry && geometry.data.position.length) {
            geometry = undefined;
        }
    }

    function setGeometry() {
        if (!geometry) {
            const position = [];
            const texcoord = [];
            const normal = [];
            webglVertexData = [position, texcoord, normal];
            geometry = {
                object,
                groups,
                material,
                data: {
                    position,
                    texcoord,
                    normal,
                },
            };
            geometries.push(geometry);
        }
    }

    function addVertex(vert) {
        const ptn = vert.split("/");
        ptn.forEach((objIndexStr, i) => {
            if (!objIndexStr) {
                return;
            }
            const objIndex = parseInt(objIndexStr);
            const index =
                objIndex + (objIndex >= 0 ? 0 : objVertexData[i].length);
            webglVertexData[i].push(...objVertexData[i][index]);
        });
    }

    const keywords = {
        v(parts) {
            objPositions.push(parts.map(parseFloat));
        },
        vn(parts) {
            objNormals.push(parts.map(parseFloat));
        },
        vt(parts) {
            // should check for missing v and extra w?
            objTexcoords.push(parts.map(parseFloat));
        },
        f(parts) {
            setGeometry();
            const numTriangles = parts.length - 2;
            for (let tri = 0; tri < numTriangles; ++tri) {
                addVertex(parts[0]);
                addVertex(parts[tri + 1]);
                addVertex(parts[tri + 2]);
            }
        },
        s: noop, // smoothing group
        mtllib(parts, unparsedArgs) {
            // the spec says there can be multiple filenames here
            // but many exist with spaces in a single filename
            materialLibs.push(unparsedArgs);
        },
        usemtl(parts, unparsedArgs) {
            material = unparsedArgs;
            newGeometry();
        },
        g(parts) {
            groups = parts;
            newGeometry();
        },
        o(parts, unparsedArgs) {
            object = unparsedArgs;
            newGeometry();
        },
    };

    const keywordRE = /(\w*)(?: )*(.*)/;
    const lines = text.split("\n");
    for (let lineNo = 0; lineNo < lines.length; ++lineNo) {
        const line = lines[lineNo].trim();
        if (line === "" || line.startsWith("#")) {
            continue;
        }
        const m = keywordRE.exec(line);
        if (!m) {
            continue;
        }
        const [, keyword, unparsedArgs] = m;
        const parts = line.split(/\s+/).slice(1);
        const handler = keywords[keyword];
        if (!handler) {
            console.warn("unhandled keyword:", keyword); // eslint-disable-line no-console
            continue;
        }
        handler(parts, unparsedArgs);
    }

    // remove any arrays that have no entries.
    for (const geometry of geometries) {
        geometry.data = Object.fromEntries(
            Object.entries(geometry.data).filter(
                ([, array]) => array.length > 0
            )
        );
    }

    return {
        geometries,
        materialLibs,
    };
}
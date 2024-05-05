//! Variables
let lightModleMatrix = new Matrix4();
let groundModelMatrix = new Matrix4();

let carModelMatrix = new Matrix4();
let carUpModelMatrix = new Matrix4();
let windowModelMatrix = new Matrix4();
let righttireModelMatrix = new Matrix4();
let lefttireModelMatrix = new Matrix4();

let joint1ModelMatrix = new Matrix4();
let joint2ModelMatrix = new Matrix4();
let joint3ModelMatrix = new Matrix4();

let connector1ModelMatrix = new Matrix4();
let connector2ModelMatrix = new Matrix4();
let connector3ModelMatrix = new Matrix4();

let touchObjModelMatrix = new Matrix4();

//! Objects
let objectModelMatrix = new Matrix4();
//* Original setting
objectModelMatrix.setIdentity();
objectModelMatrix.translate(2.5, 0.4, 0.0);
objectModelMatrix.scale(0.3, 0.3, 0.3);

function judgeDistance(arg1, arg2) { 
    let distance = Math.sqrt(
        Math.pow((arg1.elements[0]) - (arg2.elements[0]), 2) +
        Math.pow((arg1.elements[1]) - (arg2.elements[1]), 2) +
        Math.pow((arg1.elements[2]) - (arg2.elements[2]), 2));
    if (distance < 0.25) { is_touch = 1; }
    else { is_touch = 0;}
}

function setDrawModelMatrix() {
    //TODO set light
    lightModleMatrix.setTranslate(0, 5, -5);
    lightModleMatrix.scale(0.1, 0.1, 0.1);

    //TODO Draw light cube
    drawOneObject(ground, lightModleMatrix, 1.0, 1.0, 1.0);
    
    //TODO set ground
    groundModelMatrix.setIdentity();
    groundModelMatrix.scale(4.0, 0.1, 4.0);

    //TODO Draw ground
    drawOneObject(ground, groundModelMatrix, 0.5, 0.5, 0.5);

    //TODO set car
    carModelMatrix.setIdentity();
    carModelMatrix.setTranslate(offset_x, 0, offset_z);
    carModelMatrix.scale(0.5, 0.35, 0.9);
    carModelMatrix.translate(0, 1.5, 0);

    //TODO set car up
    carUpModelMatrix.setIdentity();
    carUpModelMatrix.setTranslate(offset_x, 0, offset_z);
    carUpModelMatrix.translate(0.0, 1.0, -0.5);
    carUpModelMatrix.scale(0.3, 0.3, 0.3);

    //TODO set window
    windowModelMatrix.setIdentity();
    windowModelMatrix.setTranslate(offset_x, 0, offset_z);
    windowModelMatrix.translate(0.0, 1.1, -0.5);
    windowModelMatrix.scale(0.35, 0.15, 0.2);

    //TODO Draw car
    drawOneObject(ground, carModelMatrix, 1.0, 0.7, 1.0);
    drawOneObject(ground, carUpModelMatrix, 1.0, 0.7, 1.0);
    drawOneObject(ground, windowModelMatrix, 0.7, 0.9, 1.0);
    
    //TODO set right back tire
    righttireModelMatrix.setIdentity();
    righttireModelMatrix.setTranslate(offset_x, 0, offset_z);
    righttireModelMatrix.rotate(90, 0, 1, 0);
    righttireModelMatrix.translate(0.5, 0.3, 0.5);
    righttireModelMatrix.scale(0.2, 0.2, 0.2);

    //TODO set left back tire
    lefttireModelMatrix.setIdentity();
    lefttireModelMatrix.setTranslate(offset_x, 0, offset_z);
    lefttireModelMatrix.rotate(90, 0, 1, 0);
    lefttireModelMatrix.translate(0.5, 0.3, -0.5);
    lefttireModelMatrix.scale(0.2, 0.2, 0.2);

    //TODO Draw tire
    drawOneObject(ground, righttireModelMatrix, 0.1, 0.1, 0.1);
    drawOneObject(ground, lefttireModelMatrix, 0.1, 0.1, 0.1);

    //TODO inner tire
    righttireModelMatrix.scale(0.55, 0.55, 1.2);
    lefttireModelMatrix.scale(0.55, 0.55, 1.2);
    drawOneObject(ground, righttireModelMatrix, 1.0, 1.0, 1.0);
    drawOneObject(ground, lefttireModelMatrix, 1.0, 1.0, 1.0);
    righttireModelMatrix.translate(-9.5, 0.0, 0.0);
    lefttireModelMatrix.translate(-9.5, 0.0, 0.0);
    drawOneObject(ground, righttireModelMatrix, 1.0, 1.0, 1.0);
    drawOneObject(ground, lefttireModelMatrix, 1.0, 1.0, 1.0);

    //! Reset matrix
    righttireModelMatrix.scale(1.0 / 0.55, 1.0 / 0.55, 1.0 / 1.2);
    lefttireModelMatrix.scale(1.0 / 0.55, 1.0 / 0.55, 1.0 / 1.2);

    //TODO set right front tire
    drawOneObject(ground, righttireModelMatrix, 0.1, 0.1, 0.1);

    //TODO set left front tire
    drawOneObject(ground, lefttireModelMatrix, 0.1, 0.1, 0.1);

    //TODO set joint1
    joint1ModelMatrix.setIdentity();
    joint1ModelMatrix.setTranslate(offset_x, 0, offset_z);
    joint1ModelMatrix.rotate(90, 0.0, 0.0, 1.0);
    joint1ModelMatrix.translate(0.8, 0.0, 0.8);
    joint1ModelMatrix.scale(0.023, 0.008, 0.023);

    //TODO Draw joint1
    drawOneObject(cylinderObj, joint1ModelMatrix, 0.5, 0.5, 1.0);

    //TODO set connector1
    connector1ModelMatrix.setIdentity();
    connector1ModelMatrix.setTranslate(offset_x, 0, offset_z);
    connector1ModelMatrix.rotate(parseFloat(angle1) + 20.0, 1.0, 0.0, 0.0);
    connector1ModelMatrix.translate(0, 1.5, 0.5);
    connector1ModelMatrix.scale(0.12, 0.5, 0.12);

    //TODO Draw connector1
    drawOneObject(ground, connector1ModelMatrix, 0.5, 0.5, 0.5);
    
    //TODO set joint2
    joint2ModelMatrix.setIdentity();
    joint2ModelMatrix.setTranslate(offset_x, 0.0, offset_z + 0.5);
    joint2ModelMatrix.rotate(90, 0.0, 0.0, 1.0);
    joint2ModelMatrix.rotate(angle1, 0.0, -1.0, 0.0);
    joint2ModelMatrix.translate(1.7, 0, 0.65);
    joint2ModelMatrix.scale(0.023, 0.008, 0.023);
    
    //TODO Draw joint2
    drawOneObject(cylinderObj, joint2ModelMatrix, 0.5, 0.7, 0.8);

    //TODO set connector2
    connector2ModelMatrix.setIdentity();
    connector2ModelMatrix.setTranslate(offset_x, -0.01, offset_z + 0.5);
    connector2ModelMatrix.rotate(angle1, 1.0, 0.0, 0.0);
    connector2ModelMatrix.translate(0, 1.8, 0.7);
    connector2ModelMatrix.rotate(50.0 + parseFloat(angle2), 1.0, 0.0, 0.0);
    connector2ModelMatrix.translate(0, 0.6, 0);
    connector2ModelMatrix.scale(0.12, 0.5, 0.12);
    
    //TODO Draw connector2
    drawOneObject(ground, connector2ModelMatrix, 0.5, 0.5, 0.5);

    //TODO set joint3
    joint2ModelMatrix.setIdentity();
    joint2ModelMatrix.setTranslate(offset_x, 0.0, offset_z + 0.5);
    joint2ModelMatrix.rotate(90, 0.0, 0.0, 1.0);
    joint2ModelMatrix.rotate(angle1, 0.0, -1.0, 0.0);
    joint2ModelMatrix.translate(1.8, 0, 0.7);
    joint2ModelMatrix.rotate(50 + parseFloat(angle2), 0.0, -1.0, 0.0);
    joint2ModelMatrix.translate(1.2, 0.0, 0.0);
    joint2ModelMatrix.scale(0.023, 0.008, 0.023);

    //TODO dwaw joint3
    drawOneObject(cylinderObj, joint2ModelMatrix, 0.0, 0.9, 0.75);

    //TODO set connector3
    connector3ModelMatrix.setIdentity();
    connector3ModelMatrix.setTranslate(offset_x, 0.5, offset_z + 0.5);
    connector3ModelMatrix.rotate(angle1, 1.0, 0.0, 0.0);
    connector3ModelMatrix.translate(0.0, 1.8, 0.7);
    connector3ModelMatrix.rotate(50.0 + parseFloat(angle2), 1.0, 0.0, 0.0);
    connector3ModelMatrix.translate(0.0, 1.2, 0.0);
    connector3ModelMatrix.rotate(parseFloat(angle3) - parseFloat(angle1) - parseFloat(angle2) + 130.0, 1.0, 0.0, 0.0);
    connector3ModelMatrix.translate(0.0, 1.4, 0.0);
    connector3ModelMatrix.scale(0.001, 0.04, 0.001);

    //TODO Draw connector3
    drawOneObject(cylinderObj, connector3ModelMatrix, 1.0, 1.0, 0.0);

    //TODO set touchObj
    touchObjModelMatrix.setIdentity();
    touchObjModelMatrix.setTranslate(offset_x, 0.5, offset_z + 0.5);
    touchObjModelMatrix.rotate(angle1, 1.0, 0.0, 0.0);
    touchObjModelMatrix.translate(0.0, 1.8, 0.7);
    touchObjModelMatrix.rotate(50.0 + parseFloat(angle2), 1.0, 0.0, 0.0);
    touchObjModelMatrix.translate(0.0, 1.2, 0.0);
    touchObjModelMatrix.rotate(parseFloat(angle3) - parseFloat(angle1) - parseFloat(angle2) + 130.0, 1.0, 0.0, 0.0);
    touchObjModelMatrix.translate(0.0, 2.5, 0.0);
    touchObjModelMatrix.scale(0.2, 0.2, 0.2);

    //TODO Draw touchObj
    drawOneObject(ground, touchObjModelMatrix, 0.8, 0.6, 0.4);

    //? Calculate coordinate and judge status
    coordinateRobotWorld = touchObjModelMatrix.multiplyVector4(coordinateRobot);
    
    if (!is_grab) { touchObjModelMatrix = new Matrix4(objectModelMatrix); }

    coordinateObjectWorld = touchObjModelMatrix.multiplyVector4(coordinateObject);

    judgeDistance(coordinateRobotWorld, coordinateObjectWorld);

    //? Grab situation
    if (is_grab) { 
        // console.log("WWWWWW");
        touchObjModelMatrix.scale(1.5, 1.5, 1.5);
        touchObjModelMatrix.rotate(-angle3, 1.0, 0.0, 0.0);
    }

    //TODO Draw Object
    if (is_touch === 1) {
        drawOneObject(ground, touchObjModelMatrix, 1.0, 1.0, 0.0);
    } else { 
        drawOneObject(ground, touchObjModelMatrix, 0.2, 0.5, 1.0);
    }

    //TODO Object joint
    touchObjModelMatrix.translate(0.0, 0.0, 1.0);
    touchObjModelMatrix.scale(0.35, 0.35, 0.35);
    drawOneObject(ground, touchObjModelMatrix, 1.0, 0.5, 0.2);
    touchObjModelMatrix.translate(0.0, 0.0, -5.5);
    drawOneObject(ground, touchObjModelMatrix, 1.0, 0.5, 0.2);

    //TODO Object wind
    touchObjModelMatrix.translate(0.0, 0.0, -3.5);
    touchObjModelMatrix.scale(1.5, 1.5, 2.5);
    touchObjModelMatrix.rotate(angle4, 0.0, 0.0, 1.0);
    drawOneObject(ground, touchObjModelMatrix, 0.3, 0.8, 1.0);
    touchObjModelMatrix.rotate(angle5 - angle4, 0.0, 0.0, 1.0);
    touchObjModelMatrix.translate(0.0, 0.0, 4.8);
    drawOneObject(ground, touchObjModelMatrix, 0.3, 0.8, 1.0);
}

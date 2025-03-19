// thanks to stackoverflow and AI assistants ;-)

const svgns = "http://www.w3.org/2000/svg";


/******  preparations  *******/
const SIDE = 30;//96;
const sizeOfSVGinX = 900;
const sizeOfSVGinY = 900;

/******  constants  *******/
const sqrt3 = Math.sqrt(3);
const offsetfromZero = `translate(${1}, ${sqrt3 / 2})`;
const transformScale = `scale(${SIDE}, ${SIDE})`; //scale the whole svg to SIDE
const gridStepsInX = 1.5; // from 1 hex to the next in X direction, steps always in 1.5
const gridStepsInY = sqrt3 / 2; // from 1 hex to the next in Y direction


//put SVG in the document
const svg = createSvg();
// add background pattern to document
const patt = createDefinesAndPattern();
//create hexes and kites for the pattern
addKitesToPattern();
addHexesToPattern();
//make a shape with the pattern the size of the svg
const rectBackground = createRectforPattern();

// find center of center hex of pattern
const centerOfCenterHex = findCenterOfCenterHex();
const transformCenter = `translate(${centerOfCenterHex.x}, ${centerOfCenterHex.y})`;


//add one turtle
// //syntax: createTurtle(color, stepsInX, stepsInY, stepsIn60Deg, invert)
//let myTurt = createTurtle("blue");
svg.appendChild(createTurtle("blue"));
//add another pink turtle
svg.appendChild(createTurtle("pink", -8, -7, 1, true));

// event listeners for the svg, as opposed to the polygon turtle. 
// here move and end because when the grid snaps, the turtle might jump out of the cursor 
svg.addEventListener('mouseup', function (event) { evMouseUp(event) });
svg.addEventListener('touchend', function (event) { evMouseUp(event) });
svg.addEventListener('mousemove', function (event) { evMouseMove(event) });
svg.addEventListener('touchmove', function (event) { evMouseMove(event) });//, { passive: true});

//vars for dragging, deleting, rotating
var TransformRequestObj;
var TransList;
var DragTarget = null;
var Dragging = false;
var OffsetX = 0;
var OffsetY = 0;
const delta = 0.05;
let lastPosGrid = { x: 0, y: 0 };
let wasDragging;
var clickTimer = null;

//the touch event will call the mouse event
// function evMouseDown_t(e) {
//     evMouseDown(e);
// }
// mouse event
function evMouseDown(e) {
    //writeDebug(`mousedown on svg fired, dragging: ${Dragging}`);
    wasDragging = false;  // Reset the flag on mousedown
    if (!Dragging) //---prevents dragging conflicts on other draggable elements---
    {
        DragTarget = e.target;
        if (DragTarget.id === "background") return;
        //---reference point to its respective viewport--
        let pnt = DragTarget.ownerSVGElement.createSVGPoint();
        if (e.type == "touchstart") {
            [pnt.x, pnt.y] = [e.touches[0].clientX, e.touches[0].clientY];
        } else {
            [pnt.x, pnt.y] = [e.clientX, e.clientY];
        }
        //---elements transformed and/or in different(svg) viewports---
        let sCTM = DragTarget.getScreenCTM();
        let Pnt = pnt.matrixTransform(sCTM.inverse());

        TransformRequestObj = DragTarget.ownerSVGElement.createSVGTransform();
        //---attach new or existing transform to element, init its transform list---
        TransList = DragTarget.transform.baseVal;

        OffsetX = Pnt.x
        OffsetY = Pnt.y

        Dragging = true;

    }

}

// function evMouseMove_t(e) {
//     evMouseMove(e);
// }
function evMouseMove(e) {
    //writeDebug('mouseMOVE, dragging:', Dragging);
    if (Dragging) {
        wasDragging = true;  // Set the flag when dragging occurs
        //var pnt = DragTarget.ownerSVGElement.createSVGPoint();
        // cursor pointer in screen
        const pntClient = svg.createSVGPoint();
        if (e.type == "touchmove") {
            [pntClient.x, pntClient.y] = [e.touches[0].clientX, e.touches[0].clientY];
        } else {
            [pntClient.x, pntClient.y] = [e.clientX, e.clientY];
        }
        //console.log(`client x and y: ${pntClient.x} , ${pntClient.y}`);

        //cusror pointer in svg coordinates
        const pntSVG = pntClient.matrixTransform(svg.getScreenCTM().inverse());
        let clientSVGOffset = { x: 0, y: 0 };

        // offset between client/screen and svg
        [clientSVGOffset.x, clientSVGOffset.y] = [pntClient.x - pntSVG.x, pntClient.y - pntSVG.y];

        // grid posiition in screen coordinates (because added offset)
        let posInGrid = findNextGridPosition(pntSVG.x, pntSVG.y);
        const pntGrid = svg.createSVGPoint();
        pntGrid.x = posInGrid.x + clientSVGOffset.x;
        pntGrid.y = posInGrid.y + clientSVGOffset.y;

        //move enough that we have a new snap position and then apply transform
        if (Math.abs(lastPosGrid.x - posInGrid.x) > delta ||
            Math.abs(lastPosGrid.y - posInGrid.y) > delta) {

            //---elements in different(svg) viewports, and/or transformed ---
            let pnt = pntGrid.matrixTransform(DragTarget.getScreenCTM().inverse());
            TransformRequestObj.setTranslate(pnt.x, pnt.y)
            TransList.appendItem(TransformRequestObj)
            TransList.consolidate()
            //save last pos to compare next cycle
            [lastPosGrid.x, lastPosGrid.y] = [posInGrid.x, posInGrid.y];
        }
        e.preventDefault();
    } else {

    }

}
// function evMouseUp_t(e) {
//     //writeDebug('touchend on svg event fired, dragging: ', Dragging);
//     //e.preventDefault();
//     evMouseUp(e);
// }

function evMouseUp(e) {
    //writeDebug('mouseup on svg event fired, dragging: ', Dragging);
    Dragging = false;
}


/************* just for testing *******************
let myCirc = document.createElementNS(svgns, 'circle');
//myCirc.setAttributeNS(null, 'cx', centerOfCenterHex.x);
//myCirc.setAttributeNS(null, 'cy', centerOfCenterHex.y);
myCirc.setAttributeNS(null, 'cx', 0);
myCirc.setAttributeNS(null, 'cy', 0);
//myCirc.setAttributeNS(null, 'style', 'draggable');
console.log(`origCircle.x: ${SIDE * gridStepsInX * 4 + SIDE}, origCircle.y: ${SIDE * gridStepsInY * 5}`);
myCirc.setAttributeNS(null, 'r', 0.5);
myCirc.setAttributeNS(null, 'transform', `translate(${SIDE * gridStepsInX * 4 + SIDE},${SIDE * gridStepsInY * 5}) ${transformScale}`);
console.log(`orig translate of circle(${SIDE * gridStepsInX * 4 + SIDE},${SIDE * gridStepsInY * 5})`);
myCirc.setAttributeNS(null, 'fill', "red");
//myCirc.addEventListener('click', function (event) { evMouseDown(event) });
//myCirc.addEventListener('mousemove', function (event) { evMouseMove(event) });
//myCirc.addEventListener('mouseup', function (event) { evMouseUp(event) });
svg.appendChild(myCirc);

**/

/************* functions *********************/

function createDefinesAndPattern() {
    let patt = document.createElementNS(svgns, 'pattern');
    patt.setAttributeNS(null, 'id', 'hexes'); // useful for filling with the pattern later
    patt.setAttributeNS(null, 'patternUnits', 'userSpaceOnUse');
    patt.setAttributeNS(null, 'width', `${3 * SIDE}`);
    patt.setAttributeNS(null, 'height', `${sqrt3 * SIDE}`);
    let defs = document.createElementNS(svgns, 'defs');
    svg.appendChild(defs);
    defs.appendChild(patt);
    return patt;
}

function createSvg() {
    let svg = document.createElementNS(svgns, 'svg');
    svg.style.left = '0';
    svg.style.top = '0';
    svg.style.width = sizeOfSVGinX;
    svg.style.height = sizeOfSVGinY;
    svg.style.backgroundColor = "#999999";
    //svg.setAttributeNS(null, 'id', 'svgTest');
    document.getElementById("theDrawing").appendChild(svg);
    return svg;
}

// Define the rotation handler function globally
function handleTurtleRotation(e) {
    //writeDebug('click on turtle event fired');

    if (wasDragging) {
        wasDragging = false;
        return;
    }

    //set a timer and if double click happens, delete the turtle
    if (clickTimer == null) {
        clickTimer = setTimeout(function () {
            clickTimer = null;
        }, 250)
    } else {
        clearTimeout(clickTimer);
        clickTimer = null;
        svg.removeChild(e.target);
        return;
    }

    const currentTransform = e.target.getAttribute('transform');
    let transList = e.target.transform.baseVal;
    let transformRequestObj = svg.createSVGTransform();
    transformRequestObj.setRotate(-60, 0, 0);
    transList.appendItem(transformRequestObj);
    transList.consolidate();

}

function createTurtle(color, stepsInX, stepsInY, stepsIn60Deg, invert) {
    let turtPoly = document.createElementNS(svgns, 'polygon');
    // turtle vectors
    let turtVectors =
        [   /* 1  */{ x: 0, y: 0 },
        /* 2  */{ x: 3 / 4, y: sqrt3 / 4 },
        /* 3  */{ x: 1 / 4, y: -sqrt3 / 4 },
        /* 4  */{ x: 1 / 2, y: 0 },
        /* 5  */{ x: 0, y: -sqrt3 / 2 },
        /* 6  */{ x: -3 / 4, y: -sqrt3 / 4 },
        /* 7  */{ x: -3 / 4, y: -sqrt3 / 4 },
        /* 8  */{ x: -3 / 4, y: sqrt3 / 4 },
        /* 9  */{ x: -1 / 4, y: -sqrt3 / 4 },
        /* 10 */{ x: -1 / 2, y: 0 },
        /* 11 */{ x: 0, y: sqrt3 / 2 },
        /* 12 */{ x: 3 / 4, y: sqrt3 / 4 },
        /* 13 */{ x: -1 / 4, y: sqrt3 / 4 },
        /* 14 */{ x: 1 / 4, y: sqrt3 / 4 }
        ];

    // add the turtle vectors to get the full path of the turtle polygon
    let tempsX = 0, tempsY = 0, turtPointsUnitary = "";
    for (let i = 0; i < turtVectors.length; i++) {
        tempsX += turtVectors[i].x;
        tempsY += turtVectors[i].y;
        turtPointsUnitary += ` ${tempsX},${tempsY}`;
    }

    turtPoly.setAttributeNS(null, 'fill', color);
    turtPoly.setAttributeNS(null, 'fill-opacity', "0.5");
    turtPoly.setAttributeNS(null, 'stroke', "black");
    turtPoly.setAttributeNS(null, 'stroke-width', "1");
    turtPoly.setAttributeNS(null, 'vector-effect', "non-scaling-stroke");
    turtPoly.setAttributeNS(null, 'points', turtPointsUnitary);
    let { myInvert, myTranslateArbitrary, myRotate } = createArbitraryTransform(stepsInX, stepsInY, stepsIn60Deg, invert);
    turtPoly.setAttributeNS(null, 'transform', `${transformCenter} ${transformScale} ${myTranslateArbitrary} ${myRotate} ${myInvert}`);
    // Add transition CSS
    //turtPoly.style.transition = 'transform 0.1s ease';

    let currentRotation = 0;
    let isDragging = false;

    // Add the event listeners using existing functions
    turtPoly.addEventListener('mousedown', evMouseDown);
    turtPoly.addEventListener('touchstart', evMouseDown);//, { passive: true});


    // {
    //     console.log('mousedown on turtle event fired, Dragging:', Dragging);
    //     evMouseDown(e);
    // });


    // Existing click handler for rotation
    turtPoly.addEventListener('click', handleTurtleRotation);

    return turtPoly;
}



function createArbitraryTransform(stepsInX = 0, stepsInY = 0, stepsIn60Deg = 0, invert = false) {
    // stepsInX=stepsInX||0;
    // stepsInY=stepsInY||0;
    // stepsIn60Deg=stepsIn60Deg||0;
    // invert=invert||1;
    let myTranslateArbitrary = ` translate(${stepsInX * gridStepsInX}, ${stepsInY * gridStepsInY})`;
    let myRotate = `rotate(${stepsIn60Deg * 60}, 0, 0)`;

    let myInvert = `scale(1, 1)`;
    if (invert) myInvert = `scale(-1, 1)`;
    //console.log("myInvert: ", myInvert);
    return { myInvert, myTranslateArbitrary, myRotate };
}

function createRectforPattern() {
    myRect = document.createElementNS(svgns, 'rect');
    myRect.setAttributeNS(null, 'width', sizeOfSVGinX);
    myRect.setAttributeNS(null, 'height', sizeOfSVGinY);
    myRect.setAttributeNS(null, 'x', "0");
    myRect.setAttributeNS(null, 'y', "0");
    myRect.setAttributeNS(null, 'stroke', "black");
    myRect.setAttributeNS(null, 'fill', "url(#hexes)");
    myRect.setAttributeNS(null, 'id', 'background');
    svg.appendChild(myRect);
    return myRect;
}

function addHexesToPattern() {
    let myHexPoints = "";
    //rotate around a circle, marking its six points to create a hexagon
    for (let i = 0; i < 6; i++) {
        myHexPoints += `${Math.cos(i * Math.PI / 3)}, ${Math.sin(i * Math.PI / 3)} `;
    }

    // main hexagon
    let myHex = document.createElementNS(svgns, 'polygon');
    myHex.setAttributeNS(null, 'points', myHexPoints);
    myHex.setAttributeNS(null, 'fill', "none");
    myHex.setAttributeNS(null, 'stroke', "black");
    myHex.setAttributeNS(null, 'stroke-width', "2");
    myHex.setAttributeNS(null, 'vector-effect', "non-scaling-stroke");
    myHex.setAttributeNS(null, 'transform', `${transformScale} ${offsetfromZero} `);
    patt.appendChild(myHex);

    // hexagon to the right and lower down
    let myTrasnformHex2 = `translate(${1.5}, ${sqrt3 / 2})`;
    myHex = myHex.cloneNode(true);
    myHex.setAttributeNS(null, 'stroke', "black");
    myHex.setAttributeNS(null, 'transform', `${transformScale} ${offsetfromZero} ${myTrasnformHex2} `);
    patt.appendChild(myHex);
}

function addKitesToPattern() {
    let myPoints = `\
    ${0},${0} \
    ${3 / 4},${sqrt3 / 4} \
    ${1},${0} \
    ${3 / 4},${-sqrt3 / 4}`;

    for (let theta = 0; theta < 360; theta += 60) {
        let myRotate = `rotate(${theta}, ${0}, ${0})`;

        //create center kite
        let myPoly = document.createElementNS(svgns, 'polygon');
        myPoly.setAttributeNS(null, 'fill', "none");
        myPoly.setAttributeNS(null, 'stroke', "purple");
        myPoly.setAttributeNS(null, 'stroke-width', "0.5");
        myPoly.setAttributeNS(null, 'vector-effect', "non-scaling-stroke");
        myPoly.setAttributeNS(null, 'points', myPoints);
        myPoly.setAttributeNS(null, 'transform', `${transformScale} ${offsetfromZero} ${myRotate} `);
        svg.appendChild(myPoly);
        patt.appendChild(myPoly);

        //create the other 4 kites around the center kite
        myPoly = myPoly.cloneNode(true);
        myPoly.setAttributeNS(null, 'stroke', "green");
        myPoly.setAttributeNS(null, 'transform', `${transformScale} ${offsetfromZero}  translate(${1.5}, ${sqrt3 / 2}) ${myRotate}`);
        svg.appendChild(myPoly);
        patt.appendChild(myPoly);

        myPoly = myPoly.cloneNode(true);
        myPoly.setAttributeNS(null, 'stroke', "green");
        myPoly.setAttributeNS(null, 'transform', `${transformScale} ${offsetfromZero}  translate(${-1.5}, ${sqrt3 / 2}) ${myRotate}`);
        svg.appendChild(myPoly);
        patt.appendChild(myPoly);

        myPoly = myPoly.cloneNode(true);
        myPoly.setAttributeNS(null, 'stroke', "green");
        myPoly.setAttributeNS(null, 'transform', `${transformScale} ${offsetfromZero}  translate(${1.5}, ${-sqrt3 / 2}) ${myRotate}`);
        svg.appendChild(myPoly);
        patt.appendChild(myPoly);

        myPoly = myPoly.cloneNode(true);
        myPoly.setAttributeNS(null, 'stroke', "green");
        myPoly.setAttributeNS(null, 'transform', `${transformScale} ${offsetfromZero}  translate(${-1.5}, ${-sqrt3 / 2}) ${myRotate}`);
        svg.appendChild(myPoly);
        patt.appendChild(myPoly);

    }
}

function findCenterOfCenterHex() {

    let midSizeX = sizeOfSVGinX / 2;
    let x = 0;
    let xMinusOne = 0;
    //SIDE is offset from 0,0; 3*SIDE is the step in x direction
    for (x = SIDE + (3 * SIDE); x < midSizeX; x = x + (3 * SIDE)) xMinusOne = x;
    //x is now the next possible center after center of svg, on the right side (because of the last increment in the for loop)
    //now lets find if the one before, on the left, was closer to the center
    let diffRight = x - midSizeX;
    let diffLeft = midSizeX - xMinusOne;
    if (diffRight > diffLeft) {
        //the left side, xMinusOne, is the closest to the center
        x = xMinusOne;
    }

    //same for y
    let midSizeY = sizeOfSVGinY / 2;
    let y = 0;
    let yMinusOne = 0;
    for (y = SIDE * sqrt3 / 2; y < midSizeY; y = y + (sqrt3 * SIDE)) yMinusOne = y;
    let diffDown = y - midSizeY;
    let diffUp = midSizeY - yMinusOne;
    if (diffDown > diffUp) {
        //the upper side, yMinusOne is the closest to the center
        y = yMinusOne;
    }
    return { x: x, y: y };
}

function findNextGridPosition(x, y) {
    //original pos, top left
    let nextX = SIDE, prevNextX = 0;
    let nextY = SIDE * sqrt3 / 2, prevNextY = 0;

    //iterate until find the closest position in the grid
    while (true) {
        if (nextX < x) {
            prevNextX = nextX;
            nextX += gridStepsInX * SIDE;
        }
        if (nextY < y) {
            prevNextY = nextY;
            nextY += gridStepsInY * SIDE;
        }
        if (nextX >= x && nextY >= y) {
            break;
        }
    }
    //decide wheter to go back or forward
    let diffXLeft = nextX - x;
    let diffXRight = x - prevNextX;
    if (diffXLeft > diffXRight) {
        nextX = prevNextX;
    }
    let diffYDown = nextY - y;
    let diffYUp = y - prevNextY;
    if (diffYDown > diffYUp) {
        nextY = prevNextY;
    }
    return { x: nextX, y: nextY };
}


window.controlButtons.setupControls();



// function debugControls() {
//     // Create container for color buttons
//     const controlButtonsContainer = document.createElement('div');
//     controlButtonsContainer.style.position = 'fixed';
//     controlButtonsContainer.style.top = '10px';
//     controlButtonsContainer.style.left = '10px';
//     controlButtonsContainer.style.display = 'flex';
//     controlButtonsContainer.style.flexDirection = 'column';
//     controlButtonsContainer.style.gap = '10px';
//     controlButtonsContainer.style.padding = '10px';
//     controlButtonsContainer.style.backgroundColor = 'rgba(255, 255, 255, 1)';
//     controlButtonsContainer.style.borderRadius = '5px';
//     controlButtonsContainer.style.zIndex = '1000';
//     controlButtonsContainer.id = id = 'debug';
//     document.body.appendChild(controlButtonsContainer);
// }
// debugControls();
// let debugLines = [];
// let lines = 0;
// function writeDebug(...t) {
//     let d = document.getElementById('debug');
//     debugLines.unshift(`${lines++}: ${t.join(' ')}`);
//     debugLines.splice(10);
//     d.innerHTML = debugLines.join('<br />');
// }
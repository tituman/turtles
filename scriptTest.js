// adapted from http://stackoverflow.com/questions/12786797/how-to-draw-rectangles-dynamically-in-svg
const svgns = "http://www.w3.org/2000/svg";


/******  preparations  *******/
const SIDE = 40;//96;
const sizeOfSVGinX = 900;
const sizeOfSVGinY = 900;

/******  constants  *******/
const sqrt3 = Math.sqrt(3);
const offsetfromZero = `translate(${1}, ${sqrt3 / 2})`;
const myScale = `scale(${SIDE}, ${SIDE})`; //scale the whole svg to SIDE
const gridStepsInX = 1.5; // from 1 hex to the next in X direction, steps always in 1.5
const gridStepsInY = sqrt3 / 2; // from 1 hex to the next in Y direction

//put SVG in the document
const svg = createSvg();
// add background pattern to document
const patt = createdefinesAndPattern();
//create hexes and kites for the pattern
addKitesToPattern();
addHexesToPattern();
//make a shape with the pattern the size of the svg
const rectBackground = createRectforPattern();

// find center of center hex of pattern
const centerOfCenterHex = findCenterOfCenterHex();
const transCenter = `translate(${centerOfCenterHex.x}, ${centerOfCenterHex.y})`;


//add one turtle
// //syntax: createTurtle(color, stepsInX, stepsInY, stepsIn60Deg, invert)
let myTurt = createTurtle("blue");
svg.appendChild(myTurt);
//add another pink turtle
myTurt = createTurtle(color = "pink", stepsInX = 2, stepsInY = 0, stepsIn60Deg = 1, invert = -1);
svg.appendChild(myTurt);

/******** more testing */
svg.addEventListener('mouseup', function (event) { evMouseUp(event) });
svg.addEventListener('mousemove', function (event) { evMouseMove(event) });
svg.addEventListener('mousedown', function (event) { evMouseDown(event) });

var TransformRequestObj;
var TransList;
var DragTarget = null;
var Dragging = false;
var OffsetX = 0;
var OffsetY = 0;


function evMouseDown(e) {
    if (!Dragging) //---prevents dragging conflicts on other draggable elements---
    {
        DragTarget = e.target;
        if(DragTarget.id === "background") return;
        //---reference point to its respective viewport--
        let pnt = DragTarget.ownerSVGElement.createSVGPoint();
        pnt.x = e.clientX;
        pnt.y = e.clientY;
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
function evMouseMove(e) {
    if (Dragging) {
        //var pnt = DragTarget.ownerSVGElement.createSVGPoint();
        var pnt = svg.createSVGPoint();
        let clientSVGOffset = svg.createSVGPoint();
        let PntGrid = svg.createSVGPoint();
        // cursor pointer in screen
        pnt.x = e.clientX;
        pnt.y = e.clientY;
        console.log(`client x and y: ${pnt.x} , ${pnt.y}`);
        //cusror pointer in svg coordinates
        var PntSVG = pnt.matrixTransform(svg.getScreenCTM().inverse());
        clientSVGOffset.x = pnt.x - PntSVG.x;
        clientSVGOffset.y = pnt.y - PntSVG.y;
        // grid posiition in screen coordinates (because added offset)
        let posInGrid = findNextGridPosition(PntSVG.x, PntSVG.y);
        PntGrid.x = posInGrid.x + clientSVGOffset.x ;
        PntGrid.y = posInGrid.y + clientSVGOffset.y ;
//Pnt.x -= OffsetX;
//Pnt.y -= OffsetY;
        console.log(`svg x and y: ${PntSVG.x} ,${PntSVG.y}`);
        console.log(`next grid x and y: ${PntGrid.x} ,${PntGrid.y}`);
        console.log(`client-svgOffset : ${clientSVGOffset.x} ,${clientSVGOffset.y}`);

        //---elements in different(svg) viewports, and/or transformed ---
        var Pnt = PntGrid.matrixTransform(DragTarget.getScreenCTM().inverse());        console.log(`will add this transform: ${Pnt.x} ,${Pnt.y}`);
        TransformRequestObj.setTranslate(Pnt.x, Pnt.y)
        TransList.appendItem(TransformRequestObj)
        TransList.consolidate()
    }
}
function evMouseUp(e) {
    if (!Dragging) return;

    Dragging = false;
return;
    let pnt = DragTarget.ownerSVGElement.createSVGPoint();
    pnt.x = 0;
    pnt.y = 0;
        console.log(`pntY: ${pnt.y}`);// pointer on screen
    let cursorpt = pnt.matrixTransform(svg.getScreenCTM().inverse()); //pointer on svg
        console.log(`cursorpnY: ${cursorpt.y}`);// pointer on svg --> make this snap to grid
        console.log(`OffsetY: ${OffsetY}`);// Offset in x
    //---elements in different(svg) viewports, and/or transformed ---
    var Pnt = pnt.matrixTransform(DragTarget.getScreenCTM()); //0 of object relative to svg
    //Pnt.x -= OffsetX;
    //Pnt.y -= OffsetY;
        console.log(`PntY 0 of object relative to svg: ${Pnt.y}`);//0 of object relative to svg
    
    let posInGrid = findNextGridPosition(Pnt.x, Pnt.y);
    pnt.x = posInGrid.x;
    pnt.y = posInGrid.y;
        console.log(`posInGridY: ${posInGrid.y}`); //
    Pnt = pnt.matrixTransform(DragTarget.getScreenCTM().inverse());
    
        console.log(`after inverse: ${Pnt.y}`); //
    //TransformRequestObj.setTranslate(Pnt.x, Pnt.y);
//TODO: get the orig turtle translations and use them instead of append to translist
    let transSnap = `translate(${pnt.x},${pnt.y}) `;
    DragTarget.setAttributeNS(null, 'transform', `${transSnap} ${myScale}`);
    //TransList.appendItem(TransformRequestObj);
//TODO still see about consolidation
    //TransList.consolidate();
    
    
    // myCirc = myCirc.cloneNode(true);
    // pt.x = e.clientX;
    // pt.y = e.clientY;
    // // The cursor point, translated into svg coordinates
    // cursorpt = pt.matrixTransform(svg.getScreenCTM().inverse());
    // console.log("(cursorpt.x:" + cursorpt.x + ", cursorpt.y:" + cursorpt.y + ")");
    // let nextPos = findNextGridPosition(cursorpt.x, cursorpt.y);
    // myCirc.setAttributeNS(null, 'cx', nextPos.x);
    // myCirc.setAttributeNS(null, 'cy', nextPos.y);
    // svg.appendChild(myCirc);

}

// function oMousePos(elmt, evt) {
//     let ClientRect = elmt.getBoundingClientRect();
//               return { 
//               x: Math.round(evt.clientX - ClientRect.left),
//               y: Math.round(evt.clientY - ClientRect.top)
//     }
// }

/************* just for testing *******************
**/
let myCirc = document.createElementNS(svgns, 'circle');
//myCirc.setAttributeNS(null, 'cx', centerOfCenterHex.x);
//myCirc.setAttributeNS(null, 'cy', centerOfCenterHex.y);
myCirc.setAttributeNS(null, 'cx', 0);
myCirc.setAttributeNS(null, 'cy', 0);
//myCirc.setAttributeNS(null, 'style', 'draggable');
console.log(`origCircle.x: ${SIDE * gridStepsInX * 4 + SIDE}, origCircle.y: ${SIDE * gridStepsInY * 5}`);
myCirc.setAttributeNS(null, 'r', 0.5);
myCirc.setAttributeNS(null, 'transform', `translate(${SIDE * gridStepsInX * 4 + SIDE},${SIDE * gridStepsInY * 5}) ${myScale}`);
console.log(`orig translate of circle(${SIDE * gridStepsInX * 4 + SIDE},${SIDE * gridStepsInY * 5})`);
myCirc.setAttributeNS(null, 'fill', "red");
//myCirc.addEventListener('click', function (event) { evMouseDown(event) });
//myCirc.addEventListener('mousemove', function (event) { evMouseMove(event) });
//myCirc.addEventListener('mouseup', function (event) { evMouseUp(event) });
svg.appendChild(myCirc);


/************* functions *********************/

function createdefinesAndPattern() {
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

function createTurtle(color, stepsInX, stepsInY, stepsIn60Deg, invert) {
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

    let turtPoly = document.createElementNS(svgns, 'polygon');
    turtPoly.setAttributeNS(null, 'fill', color);
    turtPoly.setAttributeNS(null, 'fill-opacity', "0.5");
    turtPoly.setAttributeNS(null, 'stroke', "black");
    turtPoly.setAttributeNS(null, 'stroke-width', "2");
    turtPoly.setAttributeNS(null, 'vector-effect', "non-scaling-stroke");
    turtPoly.setAttributeNS(null, 'points', turtPointsUnitary);
    let { myInvert, myTranslateArbitrary, myRotate } = createArbitraryTransform(stepsInX, stepsInY, stepsIn60Deg, invert);
    turtPoly.setAttributeNS(null, 'transform', `${transCenter} ${myScale} ${myTranslateArbitrary} ${myRotate} ${myInvert}`);
    //turtPoly.addEventListener('mousedown', function (event) { evMouseDown(event) });
    //turtPoly.addEventListener('mousemove', function (event) { evMouseMove(event) });
    //turtPoly.addEventListener('mouseup', function (event) { evMouseUo(event) });

    return turtPoly;
}



function createArbitraryTransform(stepsInX = 0, stepsInY = 0, stepsIn60Deg = 0, invert = 1) {
    // stepsInX=stepsInX||0;
    // stepsInY=stepsInY||0;
    // stepsIn60Deg=stepsIn60Deg||0;
    // invert=invert||1;
    let myTranslateArbitrary = ` translate(${stepsInX * gridStepsInX}, ${stepsInY * gridStepsInY})`;
    let myRotate = `rotate(${stepsIn60Deg * 60}, 0, 0)`;
    let myInvert = `scale(${invert}, 1)`;
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
    myHex.setAttributeNS(null, 'stroke-width', "1");
    myHex.setAttributeNS(null, 'vector-effect', "non-scaling-stroke");
    myHex.setAttributeNS(null, 'transform', `${myScale} ${offsetfromZero} `);
    patt.appendChild(myHex);

    // hexagon to the right and lower down
    let myTrasnformHex2 = `translate(${1.5}, ${sqrt3 / 2})`;
    myHex = myHex.cloneNode(true);
    myHex.setAttributeNS(null, 'stroke', "black");
    myHex.setAttributeNS(null, 'transform', `${myScale} ${offsetfromZero} ${myTrasnformHex2} `);
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
        myPoly.setAttributeNS(null, 'transform', `${myScale} ${offsetfromZero} ${myRotate} `);
        svg.appendChild(myPoly);
        patt.appendChild(myPoly);

        //create the other 4 kites around the center kite
        myPoly = myPoly.cloneNode(true);
        myPoly.setAttributeNS(null, 'stroke', "green");
        myPoly.setAttributeNS(null, 'transform', `${myScale} ${offsetfromZero}  translate(${1.5}, ${sqrt3 / 2}) ${myRotate}`);
        svg.appendChild(myPoly);
        patt.appendChild(myPoly);

        myPoly = myPoly.cloneNode(true);
        myPoly.setAttributeNS(null, 'stroke', "green");
        myPoly.setAttributeNS(null, 'transform', `${myScale} ${offsetfromZero}  translate(${-1.5}, ${sqrt3 / 2}) ${myRotate}`);
        svg.appendChild(myPoly);
        patt.appendChild(myPoly);

        myPoly = myPoly.cloneNode(true);
        myPoly.setAttributeNS(null, 'stroke', "green");
        myPoly.setAttributeNS(null, 'transform', `${myScale} ${offsetfromZero}  translate(${1.5}, ${-sqrt3 / 2}) ${myRotate}`);
        svg.appendChild(myPoly);
        patt.appendChild(myPoly);

        myPoly = myPoly.cloneNode(true);
        myPoly.setAttributeNS(null, 'stroke', "green");
        myPoly.setAttributeNS(null, 'transform', `${myScale} ${offsetfromZero}  translate(${-1.5}, ${-sqrt3 / 2}) ${myRotate}`);
        svg.appendChild(myPoly);
        patt.appendChild(myPoly);

    }
}

function findCenterOfCenterHex() {

    let midSizeX = sizeOfSVGinX / 2;
    let x = 0;
    let xminusOne = 0;
    //SIDE is offset from 0,0; 3*SIDE is the step in x direction
    for (x = SIDE + (3 * SIDE); x < midSizeX; x = x + (3 * SIDE)) xminusOne = x;
    //x is now the next possible center after center of svg, on the right side (because of the last increment in the for loop)
    //now lets find if the one before, on the left, was closer to the center
    let diffRight = x - midSizeX;
    let diffLeft = midSizeX - xminusOne;
    if (diffRight > diffLeft) {
        //the left side, xminusOne, is the closest to the center
        x = xminusOne;
    }

    //same for y
    let midSizeY = sizeOfSVGinY / 2;
    let y = 0;
    let yminusOne = 0;
    //SIDE*sqrt3/2 is offset from 0,0; sqrt3*SIDE is the step in y direction
    for (y = SIDE * sqrt3 / 2; y < midSizeY; y = y + (sqrt3 * SIDE)) yminusOne = y;
    let diffDown = y - midSizeY;
    let diffUp = midSizeY - yminusOne;
    if (diffDown > diffUp) {
        //the upper side, yminusOne is the closest to the center
        y = yminusOne;
    }
    return { x: x, y: y };
}

function findNextGridPosition(x, y) {
    
    console.log(`origX: ${x}, origY: ${y}`);
    //original pos, top left
    let nextX = SIDE, prevNextX = 0;
    let nextY = SIDE * sqrt3 / 2, prevNextY = 0;

    //console.log(`SIDE: ${SIDE}, origY: ${y}`);
    //console.log(`nextX: ${nextX}, nextY: ${nextY}`);
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
    console.log(`nextX: ${nextX}, nextY: ${nextY}`);
    return { x: nextX, y: nextY };
}
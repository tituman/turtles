// adapted from http://stackoverflow.com/questions/12786797/how-to-draw-rectangles-dynamically-in-svg
svgns = "http://www.w3.org/2000/svg";

/******  preparations  *******/
let SIDE = 20;//96;
let sizeOfSVGinX = 900;
let sizeOfSVGinY = 900;

/******  constants  *******/
let sqrt3 = Math.sqrt(3);
let offsetfromZero = `translate(${1}, ${sqrt3 / 2})`;
let myScale = `scale(${SIDE}, ${SIDE})`; //scale the whole svg to SIDE
let gridStepsInX = 1.5; // from 1 hex to the next in X direction, steps always in 1.5
let gridStepsInY = sqrt3/2; // from 1 hex to the next in Y direction

//put SVG in the document
let svg = createSvg();
// add background pattern to document
let patt = createdefinesAndPattern();
//create hexes and kites for the pattern
addKitesToPattern();
addHexesToPattern();
//make a shape with the pattern the size of the svg
createRectforPattern();

// find center of center hex of pattern
let centerOfCenterHex = findCenterOfCenterHex();
let transCenter = `translate(${centerOfCenterHex.x}, ${centerOfCenterHex.y})`;


//add one turtle
let myTurt = createTurtle("blue");
//myTurt.setAttributeNS(null, 'transform', `${transCenter} ${myScale}`);
svg.appendChild(myTurt);

//add another pink turtle

//createTurtle(color, stepsInX, stepsInY, stepsIn60Deg, invert)
myTurt = createTurtle(color="pink", stepsInX=2, stepsInY=0, stepsIn60Deg=1, invert=-1);
//myTurt.setAttributeNS(null, 'transform', `${transCenter} ${myScale} ${myInvert} ${myTranslateArbitrary} ${myRotate} `);
svg.appendChild(myTurt);

/******** more testing */
svg.addEventListener('mouseup', function (event) { evMouseUp(event) });
let movingObject = null;
var pt = svg.createSVGPoint();  // Created once for document
let dragging = false;
let offset={};
let cursorpt={};
function evMouseDown(e) {
    pt.x = e.clientX;
    pt.y = e.clientY;
    dragging = true;
    movingObject = e.srcElement;

    // The cursor point, translated into svg coordinates
    cursorpt =  pt.matrixTransform(svg.getScreenCTM().inverse());
    console.log(`pt.x:${pt.x}, pt.y:${pt.y}`);
    console.log("(cursorpt.x:" + cursorpt.x + ", cursorpt.y:" + cursorpt.y + ")");

    
  //offset = oMousePos(svg, e);
    //console.log(e.srcElement.attributes.transform.nodeValue);
    //e.srcElement.setAttributeNS(null, 'transform', `${ e.srcElement.attributes.transform.nodeValue} rotate(60,0,0)`);
    //console.log(e.srcElement.attributes.transform.nodeValue);
    //alert("click");
}
function evMouseMove(e) {
    if (dragging) {
        pt.x = e.clientX;
        pt.y = e.clientY;
        m = oMousePos(svg, e);
        //var cursorpt = pt.matrixTransform(svg.getScreenCTM().inverse());
        //console.log("(" + cursorpt.x + ", " + cursorpt.y + ")");
        //let nextPos = findNextGridPosition(cursorpt.x, cursorpt.y);
        
        // e.srcElement.setAttributeNS(null, 'transform', `translate(${nextPos.x}, ${nextPos.y})`);
        e.srcElement.setAttributeNS(null, 'transform', `translate(${m.x - offset.x}, ${m.y - offset.y})`);
        console.log(`translate(${m.x - offset.x}, ${m.y - offset.y})`);
    }else{
        //console.log("moving");
    }
}
function evMouseUp(e) {
    // if (dragging) {
    //     let nextPos = findNextGridPosition(cursorpt.x, cursorpt.y);
    //     movingObject.setAttributeNS(null, 'transform', `translate(${nextPos.x}, ${nextPos.y})`);
        
    //     movingObject = null;
    // }else{
    //     console.log("up");
    // }
    // dragging = false;
    myCirc = myCirc.cloneNode(true);
    pt.x = e.clientX;
    pt.y = e.clientY;
    // The cursor point, translated into svg coordinates
    cursorpt =  pt.matrixTransform(svg.getScreenCTM().inverse());
    console.log("(cursorpt.x:" + cursorpt.x + ", cursorpt.y:" + cursorpt.y + ")");
    let nextPos = findNextGridPosition(cursorpt.x, cursorpt.y);
    myCirc.setAttributeNS(null, 'cx', nextPos.x);
    myCirc.setAttributeNS(null, 'cy', nextPos.y);
    svg.appendChild(myCirc);

}

function oMousePos(elmt, evt) {
    let ClientRect = elmt.getBoundingClientRect();
              return { 
              x: Math.round(evt.clientX - ClientRect.left),
              y: Math.round(evt.clientY - ClientRect.top)
    }
}

/************* just for testing *******************
**/
let myCirc = document.createElementNS(svgns, 'circle');
//myCirc.setAttributeNS(null, 'cx', centerOfCenterHex.x);
//myCirc.setAttributeNS(null, 'cy', centerOfCenterHex.y);
myCirc.setAttributeNS(null, 'cx', SIDE*gridStepsInX*4+SIDE);
myCirc.setAttributeNS(null, 'cy', SIDE*gridStepsInY*5);
myCirc.setAttributeNS(null, 'style', 'draggable');
console.log(`origCircle.x: ${SIDE*gridStepsInX*4+SIDE}, origCircle.y: ${SIDE*gridStepsInY*5}`);
myCirc.setAttributeNS(null, 'r', 10);
myCirc.setAttributeNS(null, 'fill', "red");
myCirc.addEventListener('click', function (event) { evMouseDown(event) });
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
    [   /* 1  */{x: 0, y: 0},
        /* 2  */{x: 3 / 4, y: sqrt3 / 4},
        /* 3  */{x: 1 / 4, y: -sqrt3 / 4},
        /* 4  */{x: 1 / 2, y: 0},
        /* 5  */{x: 0, y: -sqrt3 / 2},
        /* 6  */{x: -3 / 4, y: -sqrt3 / 4},
        /* 7  */{x: -3 / 4, y: -sqrt3 / 4},
        /* 8  */{x: -3 / 4, y: sqrt3 / 4},
        /* 9  */{x: -1 / 4, y: -sqrt3 / 4},
        /* 10 */{x: -1 / 2, y: 0},
        /* 11 */{x: 0, y: sqrt3 / 2},
        /* 12 */{x: 3 / 4, y: sqrt3 / 4},
        /* 13 */{x: -1 / 4, y: sqrt3 / 4},
        /* 14 */{x: 1 / 4, y: sqrt3 / 4}
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



function createArbitraryTransform(stepsInX=0, stepsInY=0, stepsIn60Deg=0, invert=1) {
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
    svg.appendChild(myRect);
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
    ${3/4},${sqrt3/4} \
    ${1},${0} \
    ${3/4},${-sqrt3/4}`;

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
    for (y = SIDE * sqrt3/2; y < midSizeY; y = y + (sqrt3 * SIDE)) yminusOne = y;    
    let diffDown = y - midSizeY;
    let diffUp = midSizeY - yminusOne;
    if (diffDown > diffUp) {
        //the upper side, yminusOne is the closest to the center
        y = yminusOne;
    }
    return {x:x, y:y};
}

function findNextGridPosition(x, y) {
    //original pos, top left
    let nextX = SIDE, prevNextX=0;
    let nextY = SIDE * sqrt3 / 2, prevNextY=0;

    //iterate until find the closest position in the grid
    while (true) {
        if (nextX < x) {
            prevNextX = nextX;
            nextX += gridStepsInX*SIDE;
        }
        if (nextY < y) {
            prevNextY = nextY;
            nextY += gridStepsInY*SIDE;
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
    return {x:nextX, y:nextY};
}
// thanks to stackoverflow and AI assistants ;-)

const svgns = "http://www.w3.org/2000/svg";


/******  preparations  *******/
const SIDE = 30;//96;
const sizeOfSVGinX = 900;
const sizeOfSVGinY = 900;
const DEBUG = false;
const SHOWHEXAGONS = false;

/******  constants  *******/
const sqrt3 = Math.sqrt(3);
const offsetfromZero = `translate(${1}, ${sqrt3 / 2})`;
const transformScale = `scale(${SIDE}, ${SIDE})`; //scale the whole svg to SIDE
const gridStepsInX = 1.5; // from 1 hex to the next in X direction, steps always in 1.5
const gridStepsInY = sqrt3 / 2; // from 1 hex to the next in Y direction
//for debugging
const debugLines = [];
let lines = 0;


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
//syntax: createTurtle(color, stepsInX, stepsInY, stepsIn60Deg, invert)
svg.appendChild(create4HexAndTurtle("blue"));
//add another pink turtle
svg.appendChild(create4HexAndTurtle("pink", 0, 0, 0, true));

// event listeners for the svg, as opposed to the polygon turtle. 
// here move, mouseup and touchend because when the grid snaps, the turtle might jump out of the cursor 
svg.addEventListener('mouseup', function (event) { evMouseUp(event) });
svg.addEventListener('touchend', function (event) { evMouseUp(event) });
svg.addEventListener('mousemove', function (event) { evMouseMove(event) });
svg.addEventListener('touchmove', function (event) { evMouseMove(event) });
//the click, mousedown, touchstart are added directly to the turtles upon turtle creation

//vars for dragging, deleting, rotating
var TransformRequestObj;
var TransList;
var TransLists = [];
var DragTarget = null;
var Dragging = false;
var OffsetX = 0;
var OffsetY = 0;
const delta = 0.05;
let lastPosGrid = { x: 0, y: 0 };
let wasDragging;
var clickTimer = null;


window.controlButtons.setupControls();


if (DEBUG) {
    debugControls();
}

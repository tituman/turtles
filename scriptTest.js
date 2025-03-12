// adapted from http://stackoverflow.com/questions/12786797/how-to-draw-rectangles-dynamically-in-svg
svgns = "http://www.w3.org/2000/svg";

/******  preparations and constants  *******/
let SIDE = 30;//96;
let sizeOfSVGinX = 900;
let sizeOfSVGinY = 900;
//let x;
//let y;
//let sizeOfGrid = 11;
let sqrt3 = Math.sqrt(3);
let myScale = `scale(${SIDE}, ${SIDE})`; //scale the whole svg to SIDE

//put SVG in the document
var svg = document.createElementNS(svgns, 'svg');
//svg.classList.add("component");
svg.style.left = '0';
svg.style.top = '0';
svg.style.width = sizeOfSVGinX;
svg.style.height = sizeOfSVGinY;
//svg.style.position = "absolute";
svg.style.backgroundColor = "#999999";
svg.setAttributeNS(null, 'id', 'svgTest');
document.getElementById("theTests").appendChild(svg);



/******  preparations and constants  *****
let SIDE = 40;//96;
let x;
let y;
let sizeOfGrid = 11;
let sqrt3 = Math.sqrt(3);
let myScale = `scale(${SIDE}, ${SIDE})`; //scale the whole svg to SIDE
let stepsInXThirds = 1 / sqrt3; // from 1 hex to the next in X direction, but can be divided by 3
let stepsInY = 2; // from 1 hex to the next in Y direction
//[x,y] = makeGridAndReturnMiddle();
**/
//create turtle from ~scaled~ unitary vector, turtle is at middle and blue

let defs = document.createElementNS(svgns, 'defs');
document.getElementById('svgTest').appendChild(defs);
let patt = document.createElementNS(svgns, 'pattern');
patt.setAttributeNS(null, 'id', 'hexes');
patt.setAttributeNS(null, 'patternUnits', 'userSpaceOnUse');
//patt.setAttributeNS(null, 'x', `${1*SIDE}`);   // 40
//patt.setAttributeNS(null, 'y', `${SIDE*sqrt3/2}`);  // 40  
patt.setAttributeNS(null, 'width', `${3 * SIDE}`);   // 40
patt.setAttributeNS(null, 'height', `${sqrt3 * SIDE}`);  // 40   
patt.setAttributeNS(null, 'stroke-width', "1");
patt.setAttributeNS(null, 'vector-effect', "non-scaling-stroke");
//patt.setAttributeNS(null, 'patternTransform', myScale); 
defs.appendChild(patt);


// let hex = document.createElementNS(svgns, 'polygon');
// hex.setAttributeNS(null, 'points', "0,0 1,0 1,0.5 0,1 0,0.5");
// hex.setAttributeNS(null, 'transform', `scale(9, 9)`);
// hex.setAttributeNS(null, 'fill', "red");
let myHexPoints = "";
for (let i = 0; i < 6; i++) {
    myHexPoints += `${Math.cos(i * Math.PI / 3)}, ${Math.sin(i * Math.PI / 3)} `;
}
let myHex = document.createElementNS(svgns, 'polygon');
let myBaseTransform = `translate(${SIDE * 1}, ${SIDE * sqrt3 / 2})`;
myHex.setAttributeNS(null, 'points', myHexPoints);
myHex.setAttributeNS(null, 'fill', "none");
myHex.setAttributeNS(null, 'stroke', "black");
myHex.setAttributeNS(null, 'stroke-width', "1");
myHex.setAttributeNS(null, 'vector-effect', "non-scaling-stroke");
myHex.setAttributeNS(null, 'transform', `${myBaseTransform} ${myScale}`);
patt.appendChild(myHex);

let myTrasnformHex2 = `translate(1.5, ${sqrt3 / 2})`;
myHex = myHex.cloneNode(true);
myHex.setAttributeNS(null, 'stroke', "black");
myHex.setAttributeNS(null, 'transform', `${myBaseTransform} ${myScale} ${myTrasnformHex2} `);
patt.appendChild(myHex);


//--> para el pattern!!! --> myHex.setAttributeNS(null, 'transform', ` translate(10, 10) scale (10,10)`);



//patt.setAttributeNS(null, 'patternTransform', `scale(3, 3)`);

//<rect width="200" height="200" x="0" y="0" stroke="black" fill="url(#patt)" />
myRect = document.createElementNS(svgns, 'rect');
myRect.setAttributeNS(null, 'width', sizeOfSVGinX);
myRect.setAttributeNS(null, 'height', sizeOfSVGinY);
myRect.setAttributeNS(null, 'x', "0");
myRect.setAttributeNS(null, 'y', "0");
myRect.setAttributeNS(null, 'stroke', "black");
myRect.setAttributeNS(null, 'fill', "url(#hexes)");
document.getElementById('svgTest').appendChild(myRect);

let myTransform = `translate(200, 600) scale(20, 20)`;
let myHex1 = myHex.cloneNode(true);
let myHex2 = myHex.cloneNode(true);
myHex1.setAttributeNS(null, 'transform', myTransform);
myHex2.setAttributeNS(null, 'transform', `${myTransform} ${myTrasnformHex2} `);
document.getElementById('svgTest').appendChild(myHex1);
document.getElementById('svgTest').appendChild(myHex2);

// find center of center hex
let centerOfCenterHex = findCenterOfCenterHex();
console.log(centerOfCenterHex);

let myCric = document.createElementNS(svgns, 'circle');
myCric.setAttributeNS(null, 'cx', centerOfCenterHex.x);
myCric.setAttributeNS(null, 'cy', centerOfCenterHex.y);
myCric.setAttributeNS(null, 'r', 10);
myCric.setAttributeNS(null, 'fill', "red");

document.getElementById('svgTest').appendChild(myCric);


console.log(patt);




function findCenterOfCenterHex() {

    let midSizeX = sizeOfSVGinX / 2;
    let x = 0;
    let xminusOne = 0;
    //SIDE is offset from 0,0; 3*SIDE is the step in x direction
    for (x = SIDE + (3 * SIDE); x < midSizeX; x = x + (3 * SIDE)) xminusOne = x;
    //x is now the next possible center after center of svg, on the right side (because of the last increment in the for loop)
    //now lets find if the one before, on the left, was closer to the center
    console.log(x);
    console.log(xminusOne);
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
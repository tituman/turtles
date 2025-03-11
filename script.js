// adapted from http://stackoverflow.com/questions/12786797/how-to-draw-rectangles-dynamically-in-svg
var svgns = "http://www.w3.org/2000/svg";

/******  preparations and constants  *******/
let SIDE = 40;//96;
let x;
let y;
let sizeOfGrid = 11;
let sqrt3 = Math.sqrt(3);
let myScale = `scale(${SIDE}, ${SIDE})`; //scale the whole svg to SIDE
let stepsInXThirds = 1 / sqrt3; // from 1 hex to the next in X direction, but can be divided by 3
let stepsInY = 2; // from 1 hex to the next in Y direction
[x,y] = makeGridAndReturnMiddle();

//create the turtle
let turtPointsUnitary = '', turtPointsScaled = '';
createTurtle();

//general svg stuff like scales and transforms

let myTranslateCenter = `translate(${x}, ${y})`; //puts the turtle in the center of the grid snapped to a hexagon
//let myTransform = `translate(${x}, ${y+SIDE*2})`; //puts the turtle one lower than the center of the grid
let myTranslateArbitrary = ` translate(${(2*3)*stepsInXThirds}, ${-0*stepsInY})`; 
let myRotate = `rotate(${-1*60}, 0, 0)`;



/******  turtle creations  *******/

//create the turtle from unitary vector and scaled to SIDE, turtle is red and has been tested and rotated a lot
turtPolygon = document.createElementNS(svgns, 'polygon');
turtPolygon.setAttributeNS(null, 'fill', "pink");
turtPolygon.setAttributeNS(null, 'fill-opacity', "0.5");
turtPolygon.setAttributeNS(null, 'stroke', "black");
turtPolygon.setAttributeNS(null, 'stroke-width', "2");
turtPolygon.setAttributeNS(null, 'vector-effect', "non-scaling-stroke");
turtPolygon.setAttributeNS(null, 'points', turtPointsUnitary);
turtPolygon.setAttributeNS(null, 'transform', `${myScale} ${myTranslateCenter} ${myTranslateArbitrary} scale(1,1)  ${myRotate}`);  
document.getElementById('svgTurt').appendChild(turtPolygon);
console.log(turtPolygon);

//create turtle from ~scaled~ unitary vector, turtle is at middle and blue
turtPoly = document.createElementNS(svgns, 'polygon');
turtPoly.setAttributeNS(null, 'fill', "blue");
turtPoly.setAttributeNS(null, 'fill-opacity', "0.5");
turtPoly.setAttributeNS(null, 'stroke', "black");
turtPoly.setAttributeNS(null, 'stroke-width', "2");
turtPoly.setAttributeNS(null, 'vector-effect', "non-scaling-stroke");
turtPoly.setAttributeNS(null, 'transform', `${myScale} ${myTranslateCenter}`);
turtPoly.setAttributeNS(null, 'points', turtPointsUnitary);
document.getElementById('svgTurt').appendChild(turtPoly);
console.log(turtPoly);


/*
//mirror and move up 2*SIDE
turtPoly = turtPoly.cloneNode(true);
//turtPoly.setAttributeNS(null, 'transform', `scale(-1, 1) translate(-${x * 2}, -${SIDE * 2})`);
turtPoly.setAttributeNS(null, 'transform', `translate(0, -${SIDE * 2})`);
turtPoly.setAttributeNS(null, 'fill-opacity', "0.3");
document.getElementById('svgTurt').appendChild(turtPoly);
console.log(turtPoly);

//not mirror rotate and move up 2*SIDE
turtPoly = turtPoly.cloneNode(true);
turtPoly.setAttributeNS(null, 'fill-opacity', "0.5");
turtPoly.setAttributeNS(null, 'transform', `rotate(60, ${x}, ${y}) translate(0, -${SIDE * 2})`);
document.getElementById('svgTurt').appendChild(turtPoly);
console.log(turtPoly);
*/
/* original implementation of turtle based on hat
/* 1  turtPointsScaled = `${x},${y} `;
/* 2  turtPointsScaled += ` ${x + SIDE * sqrt3 / 2},${y + SIDE / 2}`;
/* 3  turtPointsScaled += ` ${x + SIDE * 2 / sqrt3},${y}`;
/* 4  turtPointsScaled += ` ${x + SIDE * sqrt3},${y}`;
/* 5  turtPointsScaled += ` ${x + SIDE * sqrt3},${y - SIDE}`;
/* 6  turtPointsScaled += ` ${x + SIDE * sqrt3 / 2},${y - 3 / 2 * SIDE}`;
/* 7  turtPointsScaled += ` ${x},${y - 2 * SIDE}`;
/* 8  turtPointsScaled += ` ${x - SIDE * sqrt3 / 2},${y - 3 / 2 * SIDE}`;
/* 9  turtPointsScaled += ` ${x - SIDE * 2 / sqrt3},${y - SIDE * 2}`;
/* 10 turtPointsScaled += ` ${x - SIDE * (3 / sqrt3)},${y - SIDE * 2}`;
/* 11 turtPointsScaled += ` ${x - SIDE * (3 / sqrt3)},${y - SIDE * 1}`;
/* 12 turtPointsScaled += ` ${x - SIDE * sqrt3 / 2},${y - SIDE / 2}`;
/* 13 turtPointsScaled += ` ${x - SIDE * 2 / sqrt3},${y}`;
/* 14 turtPointsScaled += ` ${x - SIDE * sqrt3 / 2},${y + SIDE / 2}`;

console.log(turtPointsScaled);
*/


function createTurtle() {
    // turtle vectors
    let turtVectors = [
    /* 1  */{x: 0, y: 0},
    /* 2  */{x: sqrt3 / 2, y: 1 / 2},
    /* 3  */{x: sqrt3 / 6, y: -1 / 2},
    /* 4  */{x: 1 / sqrt3, y: 0},
    /* 5  */{x: 0, y: -1},
    /* 6  */{x: -sqrt3 / 2, y: -1/2},
    /* 7  */{x: -sqrt3 / 2, y: -1/2},
    /* 8  */{x: -sqrt3 / 2, y: 1/2},
    /* 9  */{x: -sqrt3 / 6, y: -1 / 2},
    /* 10 */{x: -1 / sqrt3, y: 0},
    /* 11 */{x: 0, y: 1},
    /* 12 */{x: sqrt3 / 2, y: 1 / 2},
    /* 13 */{x: -sqrt3 / 6, y: 1 / 2},
    /* 14 */{x: sqrt3 / 6, y: 1 / 2}
    ];

    // add the turtle vectors to get the full path of the turtle
    let tempX = 0, tempY = 0, tempsX = 0, tempsY = 0;
    for (let i = 0; i < turtVectors.length; i++) {
        //multiply by SIDE to scale the vectors
        tempX += SIDE * turtVectors[i].x;
        tempY += SIDE * turtVectors[i].y;
        turtPointsScaled += ` ${tempX},${tempY}`;
        // dont multiply by SIDE, instead scale later on the svg
        tempsX += turtVectors[i].x;
        tempsY += turtVectors[i].y;
        turtPointsUnitary += ` ${tempsX},${tempsY}`;


    }
}

function makeGridAndReturnMiddle() {
    // make grid
    let cos30 = Math.cos(Math.PI / 6); // sqrt3/2
    let tan30 = Math.tan(Math.PI / 6); // 1/sqrt3
    let middlePoints = [0,0];

    for (let i = 0; i <= sizeOfGrid; i++) {
        for (let j = 0; j <= sizeOfGrid; j++) {
            let x =  i * 1 * sqrt3 -(1/sqrt3);    //-(SIDE/sqrt3): to make the first hexagon align to the 0 of the grid 
            let y = (2*j + i%2) * 1;                 // each hexagon is 2*SIDE tall, and alternatively shifted by i*SIDE or not
            if (x < 0 || x > 800 || y < 0 || y > 800) continue
            //make a "kite" shape: the basic shape of the turtle and hexagon. one sixth of a hexagon
            let myPoints = `\
${x},${y} \
${x + 1 * sqrt3 / 2},${y + 1 / 2} \
${x + 1 * 2 / sqrt3},\
${y} ${x + 1 * sqrt3 / 2},${y - 1 / 2}`;

            
            console.log(myPoints);

            //find the middle of the grid
            if (i == ~~(sizeOfGrid/2) && j == ~~(sizeOfGrid/2)) { //~~ means to make integer division (!)
                console.log(`MIDDLE pos from grid: ${x} ${y}`);
                middlePoints = [x, y];
            }
            // rotate 60 degrees 6 times
            for (let theta = 0; theta < 360; theta += 60) {

                let myRotate = `rotate(${theta}, ${x}, ${y})`;
                let myPoly = document.createElementNS(svgns, 'polygon');
                myPoly.setAttributeNS(null, 'fill', "gray");
                myPoly.setAttributeNS(null, 'stroke', "purple");
                myPoly.setAttributeNS(null, 'vector-effect', "non-scaling-stroke");
                myPoly.setAttributeNS(null, 'points', myPoints);
                myPoly.setAttributeNS(null, 'transform', ` ${myScale} ${myRotate}`);
                document.getElementById('svgTurt').appendChild(myPoly);
                console.log(myPoly);
            }

        }
    } 
    return middlePoints;   
}
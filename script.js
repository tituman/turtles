// adapted from http://stackoverflow.com/questions/12786797/how-to-draw-rectangles-dynamically-in-svg
var svgns = "http://www.w3.org/2000/svg";

let SIDE = 40;//96;
let x;
let y;
let sizeOfGrid = 10;
let sqrt3 = Math.sqrt(3);
makeGrid();

//define the center point of the grid. Quasi zero position
x = -(SIDE/sqrt3) + (sizeOfGrid/2) * SIDE * sqrt3;
y = (2*sizeOfGrid/2 + 1) * SIDE;

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
    
//create the turtle
let turtPointsScaled = '', turtPointsUnit = '';
createTurtle();

//general svg stuff like scales and transforms
let myScale = `scale(${SIDE}, ${SIDE})`;
myTranslateCenter = `translate(${x}, ${y})`; //puts the turtle in the center of the grid snapped to a hexagon
let myTransform = `translate(${x}, ${y+SIDE*2})`; //puts the turtle one lower than the center of the hexagon

turtPolygon = document.createElementNS(svgns, 'polygon');
turtPolygon.setAttributeNS(null, 'fill', "red");
turtPolygon.setAttributeNS(null, 'fill-opacity', "0.5");
turtPolygon.setAttributeNS(null, 'stroke', "black");
turtPolygon.setAttributeNS(null, 'stroke-width', "2");
turtPolygon.setAttributeNS(null, 'vector-effect', "non-scaling-stroke");
turtPolygon.setAttributeNS(null, 'transform', `${myTransform} ${myScale}`);  
turtPolygon.setAttributeNS(null, 'points', turtPointsUnit);
document.getElementById('svgTurt').appendChild(turtPolygon);
console.log(turtPolygon);


turtPoly = document.createElementNS(svgns, 'polygon');
turtPoly.setAttributeNS(null, 'fill', "blue");
turtPoly.setAttributeNS(null, 'fill-opacity', "0.5");
turtPoly.setAttributeNS(null, 'stroke', "black");
turtPoly.setAttributeNS(null, 'stroke-width', "2");
turtPoly.setAttributeNS(null, 'transform', myTranslateCenter);
turtPoly.setAttributeNS(null, 'points', turtPointsScaled);
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
        turtPointsUnit += ` ${tempsX},${tempsY}`;


    }
}

function makeGrid() {
    // make grid
    let cos30 = Math.cos(Math.PI / 6); // sqrt3/2
    let tan30 = Math.tan(Math.PI / 6); // 1/sqrt3

    for (let i = 0; i <= sizeOfGrid; i++) {
    for (let j = 0; j <= sizeOfGrid; j++) {
            x =  i * SIDE * sqrt3 -(SIDE/sqrt3);    //-(SIDE/sqrt3): to make the first hexagon align to the 0 of the grid 
            y = (2*j + i%2) * SIDE;                 // each hexagon is 2*SIDE tall, and alternatively shifted by i*SIDE or not
            if (x < 0 || x > 800 || y < 0 || y > 800) continue
            //make a "kite" shape: the basi shape of the turtle and hexagon. one sixth of a hexagon
            let myPoints = `${x},${y} ${x + SIDE * sqrt3 / 2},${y + SIDE / 2} ${x + SIDE * 2 / sqrt3},${y} ${x + SIDE * sqrt3 / 2},${y - SIDE / 2}`

            // rotate 60 degrees 6 times
            for (let theta = 0; theta < 360; theta += 60) {

                let myRotate = `rotate(${theta}, ${x}, ${y})`;
                let myPoly = document.createElementNS(svgns, 'polygon');
                myPoly.setAttributeNS(null, 'fill', "gray");
                myPoly.setAttributeNS(null, 'stroke', "purple");
                myPoly.setAttributeNS(null, 'points', myPoints);
                myPoly.setAttributeNS(null, 'transform', myRotate);
                document.getElementById('svgTurt').appendChild(myPoly);
            }

        }
    }    
}
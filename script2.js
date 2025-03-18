const svgns = "http://www.w3.org/2000/svg";

//put SVG in the document
const svg = createSvg();
debugControls();
let debugLines = [];
let lines = 0;

//for dragging
var TransformRequestObj;
var TransList;
var DragTarget = null;
var Dragging = false;
var OffsetX = 0;
var OffsetY = 0;
const delta = 0.05;
let lastPosGrid = { x: 0, y: 0 };
let wasDragging;

//create a circle
let circ = circleCreate();
circ.addEventListener('touchstart', function (e) {
    writeDebug('circle touchstart');
    wasDragging = false;  // Reset the flag on mousedown
    if (!Dragging) //---prevents dragging conflicts on other draggable elements---
    {
        DragTarget = e.target;
        if (DragTarget.id === "background") return;
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

        OffsetX = pnt.x-Pnt.x;
        OffsetY = pnt.y-Pnt.y;

        Dragging = true;
    }
});
circ.addEventListener('touchmove', function (e) {
    if (Dragging) {
        wasDragging = true;  // Set the flag when dragging occurs
        //var pnt = DragTarget.ownerSVGElement.createSVGPoint();
        // cursor pointer in screen
        const pntClient = svg.createSVGPoint();
        [pntClient.x, pntClient.y] = [e.touches[0].clientX , e.touches[0].clientY];
        //console.log(`client x and y: ${pntClient.x} , ${pntClient.y}`);

        //cusror pointer in svg coordinates
        const pntSVG = pntClient.matrixTransform(svg.getScreenCTM().inverse());
        let clientSVGOffset = { x: 0, y: 0 };

        // offset between client/screen and svg
        [clientSVGOffset.x, clientSVGOffset.y] = [pntClient.x - pntSVG.x, pntClient.y - pntSVG.y];


            //---elements in different(svg) viewports, and/or transformed ---
            //let pnt = pntSVG.matrixTransform(DragTarget.getScreenCTM().inverse());
            TransformRequestObj.setTranslate(clientSVGOffset.x, clientSVGOffset.y)
            TransList.appendItem(TransformRequestObj)
            TransList.consolidate()
            
        writeDebug('circle touchmove', e.touches[0].clientX );
        
    }
});
circ.addEventListener('touchend', function () {
    writeDebug('circle touchend');

    Dragging = false;
});



function circleCreate() {
    let circle = document.createElementNS(svgns, 'circle');
    circle.setAttributeNS(null, 'cx', 50);
    circle.setAttributeNS(null, 'cy', 150);
    circle.setAttributeNS(null, 'r', 50);
    circle.setAttributeNS(null, 'fill', 'red');
    svg.appendChild(circle);
    //writeDebug('circle created');
    return circle;
}

function createSvg() {
    let svg = document.createElementNS(svgns, 'svg');
    svg.style.left = '0';
    svg.style.top = '0';
    svg.style.width = 500;
    svg.style.height = 500;
    svg.style.backgroundColor = "#999999";
    //svg.setAttributeNS(null, 'id', 'svgTest');
    document.getElementById("theDrawing").appendChild(svg);
    return svg;
}


function debugControls() {
    // Create container for color buttons
    const controlButtonsContainer = document.createElement('div');
    controlButtonsContainer.style.position = 'fixed';
    controlButtonsContainer.style.top = '10px';
    controlButtonsContainer.style.left = '10px';
    controlButtonsContainer.style.display = 'flex';
    controlButtonsContainer.style.flexDirection = 'column';
    controlButtonsContainer.style.gap = '10px';
    controlButtonsContainer.style.padding = '10px';
    controlButtonsContainer.style.backgroundColor = 'rgba(255, 255, 255, 1)';
    controlButtonsContainer.style.borderRadius = '5px';
    controlButtonsContainer.style.zIndex = '1000';
    controlButtonsContainer.id = id = 'debug';
    document.body.appendChild(controlButtonsContainer);
}
function writeDebug(...t) {
    let d = document.getElementById('debug');
    debugLines.unshift(`${lines++}: ${t.join(' ')}`);
    debugLines.splice(10);
    d.innerHTML = debugLines.join('<br />');
}
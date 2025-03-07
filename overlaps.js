
// Helper function to project a polygon onto an axis
function projectPolygon(polygon, axis) {
    let min = Infinity;
    let max = -Infinity;
    for (let i = 0; i < polygon.length; i++) {
        let dotProduct = (polygon[i].x * axis.x) + (polygon[i].y * axis.y);
        if (dotProduct < min) {
            min = dotProduct;
        }
        if (dotProduct > max) {
            max = dotProduct;
        }
    }
    return { min, max };
}

// Helper function to check for overlap between two projections
function isOverlapping(proj1, proj2) {
    return !(proj1.max < proj2.min || proj2.max < proj1.min);
}

// Helper function to get the axes of a polygon
function getAxes(polygon) {
    let axes = [];
    for (let i = 0; i < polygon.length; i++) {
        let p1 = polygon[i];
        let p2 = polygon[(i + 1) % polygon.length];
        let edge = { x: p2.x - p1.x, y: p2.y - p1.y };
        let normal = { x: -edge.y, y: edge.x };
        axes.push(normal);
    }
    return axes;
}

// Main function to check for polygon overlap using SAT
function polygonsOverlap(polygon1, polygon2) {
    let axes1 = getAxes(polygon1);
    let axes2 = getAxes(polygon2);
    let axes = axes1.concat(axes2);

    for (let i = 0; i < axes.length; i++) {
        let axis = axes[i];
        let proj1 = projectPolygon(polygon1, axis);
        let proj2 = projectPolygon(polygon2, axis);
        if (!isOverlapping(proj1, proj2)) {
            return false; // No overlap found on this axis
        }
    }
    return true; // Overlap found on all axes
}

// Example usage:
let polygon1 = [
    { x: 0, y: 0 },
    { x: 2, y: 0 },
    { x: 2, y: 2 },
    { x: 0, y: 2 }
];

let polygon2 = [
    { x: 1, y: 1 },
    { x: 3, y: 1 },
    { x: 3, y: 3 },
    { x: 1, y: 3 }
];

console.log(polygonsOverlap(polygon1, polygon2)); // Output: true
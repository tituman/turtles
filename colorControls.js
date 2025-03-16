// Define 8 colors
const turtleColors = [
    '#FF0000', // Red
    '#00FF00', // Green
    '#0000FF', // Blue
    '#FFFF00', // Yellow
    '#FF00FF', // Magenta
    '#00FFFF', // Cyan
    '#FFA500', // Orange
    '#800080'  // Purple
];

let selectedColor = turtleColors[0]; // Default to first color

function setupColorControls() {
    // Create container for color buttons
    const colorContainer = document.createElement('div');
    colorContainer.style.position = 'fixed';
    colorContainer.style.bottom = '10px';
    colorContainer.style.left = '10px';
    colorContainer.style.display = 'flex';
    colorContainer.style.flexDirection = 'column';
    colorContainer.style.gap = '10px';
    colorContainer.style.padding = '10px';
    colorContainer.style.backgroundColor = 'rgba(255, 255, 255, 0.8)';
    colorContainer.style.borderRadius = '5px';
    colorContainer.style.zIndex = '1000';

    // Create color picker container
    const colorPicker = document.createElement('div');
    colorPicker.style.display = 'flex';
    colorPicker.style.gap = '5px';

    // Create color buttons
    turtleColors.forEach(color => {
        const colorButton = document.createElement('button');
        colorButton.style.width = '30px';
        colorButton.style.height = '30px';
        colorButton.style.backgroundColor = color;
        colorButton.style.border = '2px solid #ccc';
        colorButton.style.borderRadius = '5px';
        colorButton.style.cursor = 'pointer';

        // Add click handler
        colorButton.addEventListener('click', () => {
            // Update selected color
            selectedColor = color;
            // Update visual feedback
            document.querySelectorAll('#colorPicker button').forEach(btn => {
                btn.style.border = '2px solid #ccc';
            });
            colorButton.style.border = '2px solid black';
        });

        colorPicker.appendChild(colorButton);
    });
    colorPicker.id = 'colorPicker';
    colorContainer.appendChild(colorPicker);

    // Create turtle buttons container
    const turtleButtons = document.createElement('div');
    turtleButtons.style.display = 'flex';
    turtleButtons.style.gap = '5px';
    turtleButtons.style.justifyContent = 'center';

    // Create normal turtle button

    const normalTurtleBtn = document.createElement('button');
    normalTurtleBtn.textContent = '🐢';
    normalTurtleBtn.title = 'Create normal turtle';
    styleTurtleButton(normalTurtleBtn);
    normalTurtleBtn.addEventListener('click', () => {
        const turtle = createTurtle(selectedColor);
        svg.appendChild(turtle);
    });

    // Create inverted turtle button
    const invertedTurtleBtn = document.createElement('button');
    invertedTurtleBtn.textContent = '🐢⬌';
    invertedTurtleBtn.title = 'Create inverted turtle';
    styleTurtleButton(invertedTurtleBtn);
    invertedTurtleBtn.addEventListener('click', () => {
        const turtle = createTurtle(selectedColor, 0, 0, 0, true);
        svg.appendChild(turtle);
    });

    turtleButtons.appendChild(normalTurtleBtn);
    turtleButtons.appendChild(invertedTurtleBtn);
    turtleButtons.appendChild(saveButton);
    turtleButtons.appendChild(copyButton);
    colorContainer.appendChild(turtleButtons);

    colorContainer.id = 'colorContainer';
    document.body.appendChild(colorContainer);
}

function styleTurtleButton(button) {
    button.style.padding = '5px 15px';
    button.style.fontSize = '20px';
    button.style.borderRadius = '5px';
    button.style.border = '1px solid #ccc';
    button.style.backgroundColor = 'white';
    button.style.cursor = 'pointer';
    button.style.display = 'flex';
    button.style.alignItems = 'center';
    button.style.justifyContent = 'center';


    // Hover effect
    button.addEventListener('mouseenter', () => {
        button.style.backgroundColor = '#f0f0f0';
    });
    button.addEventListener('mouseleave', () => {
        button.style.backgroundColor = 'white';
    });
}

// Export the necessary functions and variables
window.colorControls = {
    setupColorControls,
    getSelectedColor: () => selectedColor
};

// Call this after SVG creation
const exportFunctions = setupExportFunctions();

// Example button setup
const saveButton = document.createElement('button');
saveButton.textContent = 'Save SVG';
saveButton.onclick = exportFunctions.downloadSVG;
styleTurtleButton(saveButton);
saveButton.style.fontSize = '12px';
//document.body.appendChild(saveButton);

const copyButton = document.createElement('button');
copyButton.textContent = 'Copy SVG';
copyButton.onclick = exportFunctions.copySVGToClipboard;
styleTurtleButton(copyButton);
copyButton.style.fontSize = '12px';
//document.body.appendChild(copyButton);

function setupExportFunctions() {
    // Function to get the SVG content as a string
    function getSVGString() {
        const serializer = new XMLSerializer();
        return serializer.serializeToString(svg);
    }

    // Function to download SVG as a file
    function downloadSVG() {
        const svgString = getSVGString();
        const blob = new Blob([svgString], { type: 'image/svg+xml' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'turtles.svg';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }

    // Function to copy SVG to clipboard
    async function copySVGToClipboard() {
        const svgString = getSVGString();
        try {
            await navigator.clipboard.writeText(svgString);
            console.log('SVG copied to clipboard!');
        } catch (err) {
            console.error('Failed to copy SVG:', err);
        }
    }

    // Add keyboard shortcuts
    document.addEventListener('keydown', function (e) {
        // Ctrl/Cmd + S to save
        if ((e.ctrlKey || e.metaKey) && e.key === 's') {
            e.preventDefault();
            downloadSVG();
        }
        // Ctrl/Cmd + C to copy (when nothing is selected)
        if ((e.ctrlKey || e.metaKey) && e.key === 'c' && !window.getSelection().toString()) {
            e.preventDefault();
            copySVGToClipboard();
        }
    });

    return { downloadSVG, copySVGToClipboard };
}
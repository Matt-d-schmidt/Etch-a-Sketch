const container = document.querySelector('.container');
const gridSize = 16; // Default grid size
const gridItems = gridSize * gridSize;

for (let i = 0; i < gridItems; i++) {
    const div = document.createElement('div');
    div.classList.add('grid-item');
    container.appendChild(div);
}

const gridItemStyle = `
    .grid-item {
        width: calc(50% / ${gridSize});
        height: calc(50% / ${gridSize});
        background-color: lightgray;
        border: 1px solid #ccc;
        box-sizing: border-box;
    }
`;

const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = gridItemStyle;
document.head.appendChild(styleSheet);
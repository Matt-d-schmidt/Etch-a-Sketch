const container = document.querySelector('.container');
const gridSize = 16; // Default grid size
const gridItems = gridSize * gridSize;

for (let i = 0; i < gridItems; i++) {
    const div = document.createElement('div');
    div.classList.add('grid-item');
    container.appendChild(div);
}
/* creates the default grid */
function createGrid(n) {
    for (let i = 0; i < n; i++) {
        const gridTile = document.createElement('div');
        gridTile.classList.add('grid-tile');

        gridTile.style.width = `${100 / n}%`;
        gridTile.style.height = `${100 / n}%`;
        gridTile.style['backgroundColor'] = 'white';
        gridTile.style['outline'] = '1px solid #F9F9F9';
        document.querySelector('.area-2').appendChild(gridTile);
    }
};

/* deletes old grid and creates a new one */
function resetGrid(n, backgroundColor) {
    while (grid.firstChild) {
        grid.removeChild(grid.firstChild);
    }
    for (let i = 0; i < n; i++) {
        const gridTile = document.createElement('div');
        gridTile.classList.add('grid-tile');

        gridTile.style.width = `${100 / n}%`;
        gridTile.style.height = `${100 / n}%`;
        gridTile.style['backgroundColor'] = backgroundColor;
        gridTile.style['outline'] = '1px solid #F9F9F9';
        document.querySelector('.area-2').appendChild(gridTile);
    }
};

/* ends the pen and removes the event listeners */
function endPen() {
    const gridlist = grid.children;
    for (let i = 0; i < gridlist.length; i++) {
        ridList[i].removeEventListener('mouseover', fillUnit);
        gridList[i].removeEventListener('click', fillUnit);
        gridList[i].removeEventListener('mouseover', eraseUnit);
        gridList[i].removeEventListener('click', eraseUnit);
        console.log('pen ended');
    }
};

/* changes pen color to the selected color */

function changePenColor() {
    endPen();

    function getMousePos(e) {
        console.log(document.elementFromPoint(e.clientX, e.clientY));
        const element = document.elementFromPoint(e.clientX, e.clientY);

        if (element && element.classList.contains('grid-tile')) {
            element.style['backgroundColor'] = penColorInput.value;
            element.classList.add('colored');
        }

        document.addEventListener('mousemove', getMousePos);
    }
    document.addEventListener('mousemove', getMousePos);

    const gridList = grid.children;
    for (let i = 0; i < gridList.length; i++) {
        gridList[i].addEventListener('click', fillUnit);
        gridList[i].addEventListener('mouseover', fillUnit);
    }
};

function fillUnit() {
    this.style['backgroundColor'] = penColorInput.value;
    this.classList.add('colored');
}

/* eraser function: chnages pen to the same color as the background and removes colored tags */

function setEraser() {
    endPen();
    const gridList = grid.children;
    function getMousePos(e) {
        console.log(document.elementFromPoint(e.clientX, e.clientY));
        const element = document.elementFromPoint(e.clientX, e.clientY);

        if (element && element.classList.contains('grid-tile')) {
            element.style['backgroundColor'] = 'white';
            element.classList.remove('colored');
        }

        document.addEventListener('mousemove', getMousePos);
    }
    document.addEventListener('mousemove', getMousePos);
};

function eraseUnit() {
    this.style['backgroundColor'] = 'white';
    this.classList.remove('colored');
}

/* changes the background color of the grid but keeps the divs with the colored tags */

function changeBGColor(bgColor) {
    const gridList = grid.children;
    for (let i = 0; i < gridList.length; i++) {
        if (!gridList[i].classList.contains('colored')) {
            gridList[i].style['backgroundColor'] = bgColor;
        }
    }
};

/* Resets the buttons if they are is active */

function resetToggle() {
    let toggle = document.querySelector('.toggle');
    let text = document.querySelector('.toggle-text');
    if (active) {
        active = false;
        toggle.classList.remove('active');
        grid.classList.remove('active-grid');
        reset.classList.remove('active-reset');
        text.textContent = 'off';
        endPen();
        if (erase) {
            erase = false;
            const eraseBtn = document.querySelector('#eraser');
            eraseBtn.classList.remove('eraserActive');
        }
    }
};

/* Global Variables */
const grid = document.querySelector('.grid');
const defaultGridSize = 16;
const reset = document.querySelector('#reset-grid');

createGrid(defaultGridSize);

let active = false;

function toggle() {
    let toggle = document.querySelector('.toggle');
    let text = document.querySelector('.toggle-text');
    active = !active;
    if (active) {
        toggle.classList.add('active');
        grid.classList.add('active-grid');
        reset.classList.add('active-reset');
        text.textContent = 'on';
        if (erase) {
            setEraser();
        } else {
            changePenColor();
        }
    } else {
        toggle.classList.remove('active');
        grid.classList.remove('active-grid');
        reset.classList.remove('active-reset');
        text.textContent = 'off';
        endPen();
    }
};

// spacebar toggle 

window.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
        e.preventDefault();
        toggle();
    }
});

// eraser toggle

let erase = false;
function toggleEraser() {
    const eraseBtn = document.querySelector('#eraser');
    erase = !erase;
    if (erase) {
        console.log('eraser on');
        eraseBtn.classList.add('eraserActive');
        if (active) {
            setEraser();
        }
    } else {
        console.log('eraser off');
        eraseBtn.classList.remove('eraserActive');
        if (active) {
            changePenColor();
        }
    }
};

// eraser toggle with 'e' or 'E' key
window.addEventListener('keydown', (e) => {
    if (e.key === 'e' || e.key === 'E') {
        e.preventDefault();
        toggleEraser();
    }
});

const defaultBGColor = '#FFFFFF';
const defaultPenColor = '#000000';

const bgColorInput = document.querySelector('#bg-color');
const penColorInput = document.querySelector('#pen-color');

const range = document.querySelector('#num-grid');
const rangeFeedback = document.querySelector('.num-grid-feedback');

range.value = defaultGridSize;
rangeFeedback.textContent = `${defaultGridSize} x ${defaultGridSize}`;

var inputSize = range.value;

range.addEventListener('input', (e) => {
    rangeFeedback.textContent = `${e.target.value} x ${e.target.value}`;
    inputSize = e.target.value;
});

const rangeApply = document.querySelector('#apply-size');
rangeApply.addEventListener('click', () => {
    resetToggle();
    resetGrid(inputSize, `${bgColorInput.value}`);
});

reset.addEventListener('click', (e) => {
    resetToggle();

    bgColorInput.value = defaultBGColor;
    penColorInput.value = defaultPenColor;

    resetGrid(inputSize, bgColorInput.value);
    range.value = defaultGridSize;
    rangeFeedback.textContent = `${defaultGridSize} x ${defaultGridSize}`;
});

penColorInput.addEventListener('input', (e) => {
    if (active) {
        changePenColor();
    }
});

bgColorInput.addEventListener('input', (e) => {
    changeBGColor(e.target.value);
});
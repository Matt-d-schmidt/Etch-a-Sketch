/* creates the default grid */
function createGrid(n) {
    for (let i = 0; i < n * n; i++) {
        const gridTile = document.createElement('div');
        gridTile.classList.add('grid-tile');

        gridTile.style.width = `${100 / n}%`;
        gridTile.style.height = `${100 / n}%`;
        gridTile.style.flex = 'auto';
        gridTile.style['backgroundColor'] = 'white';
        gridTile.style['outline'] = '1px solid #F9F9F9';

        grid.appendChild(gridTile);
    }
};

/* deletes old grid and creates a new one */
function resetGrid(n, backgroundColor) {
    while (grid.firstChild) {
        grid.removeChild(grid.firstChild);
    }
    for (let i = 0; i < n * n; i++) {
        const gridTile = document.createElement('div');
        gridTile.classList.add('grid-tile');

        gridTile.style.width = `${100 / n}%`;
        gridTile.style.height = `${100 / n}%`;
        gridTile.style.flex = 'auto';
        gridTile.style['background-color'] = backgroundColor;
        gridTile.style['outline'] = '1px solid #F9F9F9';

        grid.appendChild(gridTile);
    }
};

let penMouseMoveHandler = null;
let eraserMouseMoveHandler = null;

/* ends the pen and removes the event listeners */
function endPen() {
    const gridList = grid.children;
    for (let i = 0; i < gridList.length; i++) {
        gridList[i].removeEventListener('mouseover', fillUnit);
        gridList[i].removeEventListener('click', fillUnit);
        gridList[i].removeEventListener('mouseover', eraseUnit);
        gridList[i].removeEventListener('click', eraseUnit);
    }
    if (penMouseMoveHandler) {
        document.removeEventListener('mousemove', penMouseMoveHandler);
        penMouseMoveHandler = null;
    }
    if (eraserMouseMoveHandler) {
        document.removeEventListener('mousemove', eraserMouseMoveHandler);
        eraserMouseMoveHandler = null;
    }
}

/* changes pen color to the selected color */

function changePenColor() {
    endPen();

    penMouseMoveHandler = function getMousePos(e) {
        const initElement = document.elementFromPoint(e.clientX, e.clientY);
        if (initElement && initElement.classList.contains('grid-tile')) {
            initElement.style['background-color'] = penColorInput.value;
            initElement.classList.add('colored');
        }
    };

    const gridList = grid.children;
    if (active) {
        document.addEventListener('mousemove', penMouseMoveHandler);
        for (let i = 0; i < gridList.length; i++) {
            gridList[i].addEventListener('mouseover', fillUnit);
            gridList[i].addEventListener('click', fillUnit);
        }
    }
}

function fillUnit() {
    this.style['background-color'] = penColorInput.value;
    this.classList.add('colored');
}

/* eraser function: chnages pen to the same color as the background and removes colored tags */

function setEraser() {
    endPen();

    eraserMouseMoveHandler = function getMousePos(e) {
        const initElement = document.elementFromPoint(e.clientX, e.clientY);
        if (initElement && initElement.classList.contains("grid-tile") && initElement.classList.contains("colored")) {
            initElement.style['background-color'] = bgColorInput.value;
            initElement.classList.remove('colored');
        }
    };
    document.addEventListener('mousemove', eraserMouseMoveHandler);

    const gridList = grid.children;
    for (let i = 0; i < gridList.length; i++) {
        gridList[i].addEventListener('mouseover', eraseUnit);
        gridList[i].addEventListener('click', eraseUnit);
    }
}

function eraseUnit() {
    this.style['background-color'] = bgColorInput.value;
    this.classList.remove('colored');
}

/* changes the background color of the grid but keeps the divs with the colored tags */

function changeBGColor(bgColor) {
    const gridList = grid.children;
    for (let i = 0; i < gridList.length; i++) {
        if (!gridList[i].classList.contains('colored')) {
            gridList[i].style['background-color'] = bgColor;
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

window.addEventListener('keydown', function (e) {
    if (e.code === 'Space') {
        e.preventDefault();
        toggle();
    }
});

// eraser toggle

let erase = false;
function toggleEraser() {
    const eraseBtn = document.querySelector('.eraser-btn');
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
const rangeFeedback = document.querySelector('#num-grid-feedback');

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

reset.addEventListener('click', () => {
    resetToggle();

    bgColorInput.value = defaultBGColor;
    penColorInput.value = defaultPenColor;

    resetGrid(defaultGridSize, defaultBGColor);
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
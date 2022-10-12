import { RandomTetrinosFactory } from '../src/tetrinos.js';

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const GRID_HEIGHT = GRID_HEIGHT;
const GRID_WIDTH = GRID_WIDTH;
class Tetris {
    _nextTetrino = null;
    activeTetrino = null;
    stack = [];
    tickInMilliseconds = 500;

    constructor() {
        this.initGrid();
        this.initControls();
    }

    get nextTetrino() {
        const stamp = this.nextTetrino;

        this.nextTetrino = RandomTetrinosFactory();

        return stamp;
    }

    start() {
        this.activeTetrino = this.nextTetrino;

        setInterval(() => {
            if (this.canMove('down')) {
                this.activeTetrino.moveDown();
            } else {
                this.mergeTetrino();
                this.activeTetrino = this.nextTetrino();
            }
            this.clearRows();
            this.paint();
        }, this.tickInMilliseconds);
    }

    getNextGrid(vector) {
        if (!this.activeTetrino) return;

        const grid = [];

        for (let i = 0; i < this.activeTetrino.height; i++) {
            grid.push([]);

            for (let j = 0; j < this.activeTetrino.width; j++) {
                if (
                    typeof this.stack[
                        this.activeTetrino.position.y + vector.y + i
                    ] === 'undefined' ||
                    typeof this.stack[
                        this.activeTetrino.position.y + vector.y + i
                    ][this.activeTetrino.position.x + vector.x + j] ===
                        'undefined'
                ) {
                    grid[i].push(1);
                } else {
                    grid[i].push(
                        this.stack[
                            this.activeTetrino.position.y + vector.y + i
                        ][this.activeTetrino.position.x + vector.x + j]
                    );
                }
            }
        }

        return grid;
    }

    canMove(direction) {
        if (!this.activeTetrino) return;

        return !this.activeTetrino.currentShape.some((row, rowIndex) => {
            return row.some((col, colIndex) => {
                let vector;

                switch (direction) {
                    case 'left':
                        vector = { x: -1, y: 0 };
                        break;
                    case 'right':
                        vector = { x: 1, y: 0 };
                        break;
                    case 'down':
                        vector = { x: 0, y: 1 };
                        break;
                }

                return (
                    this.getNextGrid({ x: -1, y: 0 })[rowIndex][colIndex] && col
                );
            });
        });
    }

    mergeTetrino() {
        if (!this.activeTetrino) return;

        this.activeTetrino.currentShape.forEach((row, rowIndex) => {
            row.forEach((col, colIndex) => {
                if (
                    !col ||
                    typeof this.stack[
                        this.activeTetrino.position.y + rowIndex
                    ] === 'undefined' ||
                    typeof this.stack[this.activeTetrino.position.y + rowIndex][
                        this.activeTetrino.position.x + colIndex
                    ] === 'undefined'
                )
                    return;

                this.stack[this.activeTetrino.position.y + rowIndex][
                    this.activeTetrino.position.x + colIndex
                ] = col;
            });
        });
    }

    clearRows() {
        this.stack = this.stack.filter((row) => !row.every((s) => s));

        const stackLength = this.stack.length;

        for (let index = 0; index < GRID_HEIGHT - stackLength; index++) {
            const newRow = [];

            for (let j = 0; j < GRID_WIDTH; j++) {
                newRow.push(0);
            }

            this.stack.unshift(newRow);
        }
    }

    initGrid() {
        for (let i = 0; i < GRID_HEIGHT; i++) {
            this.stack.push([]);

            for (let j = 0; j < GRID_WIDTH; j++) {
                this.stack[i].push(0);
            }
        }
    }

    initControls() {
        window.addEventListener('keydown', (e) => {
            if (!this.activeTetrino) return;

            switch (e.key) {
                case ' ':
                    this.activeTetrino.rotate();
                    break;
                case 'ArrowLeft':
                    if (!this.canMove('left')) return;
                    this.activeTetrino.moveLeft();
                    break;
                case 'ArrowRight':
                    if (!this.canMove('right')) return;
                    this.activeTetrino.moveRight();
                    break;
                case 'ArrowDown':
                    if (!this.canMove('down')) return;
                    this.activeTetrino.moveDown();
                    break;
            }

            this.paint();
        });
    }

    paint() {
        clear();
        drawGrid();
        drawTetrinos(this.activeTetrino);
        drawstack(this.stack);
        debug(this.stack);
    }
}

const debug = (stack) => {
    ctx.fillStyle = 'black';
    ctx.textAlign = 'center';

    stack.forEach((row, rowIndex) => {
        row.forEach((col, colIndex) => {
            ctx.fillText(
                col.toString(),
                colIndex * (canvas.width / GRID_WIDTH),
                rowIndex * (canvas.height / GRID_HEIGHT)
            );
        });
    });
};

const drawstack = (stack) => {
    ctx.fillStyle = 'red';
    ctx.beginPath();

    stack.forEach((row, rowIndex) => {
        row.forEach((col, colIndex) => {
            if (!col) return;

            ctx.rect(
                colIndex * (canvas.width / GRID_WIDTH),
                rowIndex * (canvas.height / GRID_HEIGHT),
                canvas.width / GRID_WIDTH,
                canvas.height / GRID_HEIGHT
            );

            ctx.fill();
        });
    });

    ctx.closePath();
};

const drawTetrinos = (tetrino) => {
    if (!tetrino) return;

    ctx.fillStyle = tetrino.color;

    ctx.beginPath();

    tetrino.currentShape.forEach((row, rowIndex) => {
        row.forEach((col, colIndex) => {
            if (!!col) {
                ctx.rect(
                    (colIndex * canvas.width) / GRID_WIDTH +
                        (tetrino.position.x * canvas.width) / GRID_WIDTH,
                    (rowIndex * canvas.height) / GRID_HEIGHT +
                        (tetrino.position.y * canvas.height) / GRID_HEIGHT,
                    canvas.width / GRID_WIDTH,
                    canvas.height / GRID_HEIGHT
                );

                ctx.fill();
            }
        });
    });

    ctx.closePath();
};

const drawGrid = () => {
    ctx.strokeStyle = 'red';
    ctx.rowWidth = 1;

    for (let i = 1; i < GRID_WIDTH; i++) {
        ctx.beginPath();
        ctx.moveTo((i * canvas.width) / GRID_WIDTH, 0);
        ctx.lineTo((i * canvas.width) / GRID_WIDTH, canvas.height);

        ctx.stroke();
        ctx.closePath();
    }

    for (let i = 1; i < GRID_HEIGHT; i++) {
        ctx.beginPath();
        ctx.moveTo(0, (i * canvas.height) / GRID_HEIGHT);
        ctx.lineTo(canvas.width, (i * canvas.height) / GRID_HEIGHT);

        ctx.stroke();
        ctx.closePath();
    }
};

const clear = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
};

const tetris = new Tetris();
tetris.start();

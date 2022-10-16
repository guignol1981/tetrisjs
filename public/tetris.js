import { RandomTetrinoFactory } from './tetrino.js';
import { drawStack, drawTetrino, initSprites } from './drawing.js';

const backgroundCanvas = document.getElementById('backgroundCanvas');
const bricksCanvas = document.getElementById('bricksCanvas');
const stackCanvas = document.getElementById('stackCanvas');

const GRID_HEIGHT = 20;
const GRID_WIDTH = 10;

class Tetris {
    _nextTetrino = null;
    activeTetrino = null;
    stack = [];
    tickInMilliseconds = 500;
    interval = null;

    constructor() {
        this.initStack();
        this.initControls();
        this._nextTetrino = RandomTetrinoFactory();
    }

    get nextTetrino() {
        const stamp = this._nextTetrino;

        this._nextTetrino = RandomTetrinoFactory();

        return stamp;
    }

    start() {
        this.activeTetrino = this.nextTetrino;
        this.paintTetrino();

        this.interval = setInterval(() => {
            this.moveTetrino({ x: 0, y: 1 });
            // debug(this.stack);
        }, this.tickInMilliseconds);
    }

    reset() {
        if (this.interval) clearInterval(this.interval);
        this.initStack();
        this._nextTetrino = RandomTetrinoFactory();
        this.paintStack();
        this.paintTetrino();
        this.start();
    }

    getNextGrid(vector) {
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

    moveTetrino(vector) {
        if (
            this.activeTetrino.currentShape.some((row, rowIndex) =>
                row.some(
                    (col, colIndex) =>
                        this.getNextGrid(vector)[rowIndex][colIndex] && col
                )
            )
        ) {
            if (vector.y === 1) {
                this.mergeTetrinoToStack();
            }
            return -1;
        }

        this.activeTetrino.move(vector);
        this.paintTetrino();

        return 1;
    }

    rotateTetrino() {
        const rotationStamp = this.activeTetrino.rotation;
        this.activeTetrino.rotate();

        if (
            this.activeTetrino.currentShape.some((row, rowIndex) =>
                row.some(
                    (col, colIndex) =>
                        this.getNextGrid({ x: 0, y: 0 })[rowIndex][colIndex] &&
                        col
                )
            )
        ) {
            this.activeTetrino.rotation = rotationStamp;
        }

        this.paintTetrino();
    }

    mergeTetrinoToStack() {
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

        this.activeTetrino = this.nextTetrino;
        this.clearRows();
        this.paintStack();
        this.paintTetrino();
    }

    clearRows() {
        this.stack = this.stack.filter((row) => !row.every((s) => s === 1));

        const stackLength = this.stack.length;

        for (let i = 0; i < GRID_HEIGHT - stackLength; i++) {
            const newRow = [];

            for (let j = 0; j < GRID_WIDTH; j++) {
                newRow.push(0);
            }

            this.stack.unshift(newRow);
        }
    }

    initStack() {
        this.stack = [];

        for (let i = 0; i < GRID_HEIGHT; i++) {
            this.stack.push([]);

            for (let j = 0; j < GRID_WIDTH; j++) {
                this.stack[i].push(0);
            }
        }
    }

    initControls() {
        addEventListener('keydown', (e) => {
            if (!this.activeTetrino) return;
            e.preventDefault();

            switch (e.key) {
                case 'ArrowUp':
                    this.rotateTetrino();
                    break;
                case 'ArrowLeft':
                    this.moveTetrino({ x: -1, y: 0 });
                    break;
                case 'ArrowRight':
                    this.moveTetrino({ x: 1, y: 0 });
                    break;
                case 'ArrowDown':
                    this.moveTetrino({ x: 0, y: 1 });
                    break;
                case ' ':
                    const interval = setInterval(() => {
                        let fall = this.moveTetrino({ x: 0, y: 1 }) === 1;

                        if (!fall) clearInterval(interval);
                    }, 30);

                    break;
            }
        });
    }

    paintTetrino() {
        drawTetrino(bricksCanvas, this.activeTetrino, GRID_WIDTH, GRID_HEIGHT);
    }

    paintStack() {
        drawStack(stackCanvas, [...this.stack], GRID_WIDTH, GRID_HEIGHT);
    }
}

const debug = (stack) => {
    const ctx = stackCanvas.getContext('2d');

    ctx.fillStyle = 'black';
    ctx.textAlign = 'center';

    console.table(stack);

    stack.forEach((row, rowIndex) => {
        row.forEach((col, colIndex) => {
            ctx.fillText(
                col.toString(),
                colIndex * (stackCanvas.width / GRID_WIDTH),
                rowIndex * (stackCanvas.height / GRID_HEIGHT)
            );
        });
    });
};

await initSprites(backgroundCanvas, GRID_WIDTH, GRID_HEIGHT);

window.tetris = new Tetris();

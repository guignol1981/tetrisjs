import { RandomTetrinosFactory } from '../src/tetrinos.js';
import { clear, drawGrid, drawstack, drawTetrino } from './drawing.js';

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const GRID_HEIGHT = 20;
const GRID_WIDTH = 10;

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
        const stamp = this._nextTetrino;

        this._nextTetrino = RandomTetrinosFactory();

        return stamp;
    }

    start() {
        this.activeTetrino = this.nextTetrino;

        setInterval(() => {
            if (this.canMove({ x: 0, y: 1 })) {
                this.activeTetrino.moveDown();
            } else {
                this.mergeTetrinoToStack();
                this.activeTetrino = this.nextTetrino;
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

    canMove(vector) {
        if (!this.activeTetrino) return;

        return !this.activeTetrino.currentShape.some((row, rowIndex) =>
            row.some(
                (col, colIndex) =>
                    this.getNextGrid(vector)[rowIndex][colIndex] && col
            )
        );
    }

    mergeTetrinoToStack() {
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
                    if (!this.canMove({ x: -1, y: 0 })) return;
                    this.activeTetrino.moveLeft();
                    break;
                case 'ArrowRight':
                    if (!this.canMove({ x: 1, y: 0 })) return;
                    this.activeTetrino.moveRight();
                    break;
                case 'ArrowDown':
                    if (!this.canMove({ x: 0, y: 1 })) return;
                    this.activeTetrino.moveDown();
                    break;
            }

            this.paint();
        });
    }

    paint() {
        clear(canvas);
        drawGrid(canvas, GRID_WIDTH, GRID_HEIGHT);
        drawTetrino(canvas, this.activeTetrino, GRID_WIDTH, GRID_HEIGHT);
        drawstack(canvas, this.stack, GRID_WIDTH, GRID_HEIGHT);
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

const tetris = new Tetris();
tetris.start();

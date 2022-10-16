import { RandomTetrinoFactory } from './tetrino.js';
import {
    drawNextTetrino,
    drawStack,
    drawTetrino,
    initSprites,
} from './drawing.js';

const backgroundCanvas = document.getElementById('backgroundCanvas');
const bricksCanvas = document.getElementById('bricksCanvas');
const stackCanvas = document.getElementById('stackCanvas');

const GRID_HEIGHT = 20;
const GRID_WIDTH = 10;

class Tetris {
    nextTetrino = null;
    activeTetrino = null;
    stack = [];
    tickInMilliseconds = 500;
    interval = null;
    score = 0;

    constructor() {
        this.initStack();
        this.initControls();
        this.nextTetrino = RandomTetrinoFactory();
        document.getElementById('score').innerHTML = this.score;
    }

    get activeTetrinoShadowOffset() {
        let offset = 1;
        let canFall = true;
        const currentShape = [...this.activeTetrino.currentShape];

        while (canFall) {
            if (
                currentShape.some((row, rowIndex) =>
                    row.some(
                        (col, colIndex) =>
                            this.getNextGrid({ x: 0, y: 1 }, offset)[rowIndex][
                                colIndex
                            ] && col
                    )
                )
            ) {
                canFall = false;
            } else {
                offset++;
            }
        }

        return offset;
    }

    start() {
        this.activeTetrino = this.getNextTetrino();
        this.paintTetrino();

        this.interval = setInterval(() => {
            this.moveTetrino({ x: 0, y: 1 });
            // debug(this.stack);
        }, this.tickInMilliseconds);
    }

    reset() {
        if (this.interval) clearInterval(this.interval);
        this.initStack();
        this.nextTetrino = RandomTetrinoFactory();
        this.paintStack();
        this.paintTetrino();
        this.start();
    }

    getNextTetrino() {
        const stamp = this.nextTetrino;

        this.nextTetrino = RandomTetrinoFactory();

        drawNextTetrino(this.nextTetrino);

        return stamp;
    }

    getNextGrid(vector, offset = 0) {
        const grid = [];

        for (let i = 0; i < this.activeTetrino.height; i++) {
            grid.push([]);

            for (let j = 0; j < this.activeTetrino.width; j++) {
                if (
                    typeof this.stack[
                        this.activeTetrino.position.y + vector.y + offset + i
                    ] === 'undefined' ||
                    typeof this.stack[
                        this.activeTetrino.position.y + vector.y + offset + i
                    ][this.activeTetrino.position.x + vector.x + j] ===
                        'undefined'
                ) {
                    grid[i].push(1);
                } else {
                    grid[i].push(
                        this.stack[
                            this.activeTetrino.position.y +
                                vector.y +
                                offset +
                                i
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

        this.activeTetrino = this.getNextTetrino();
        this.clearRows();
        this.paintStack();
        this.paintTetrino();
    }

    clearRows() {
        this.stack = this.stack.filter((row) => !row.every((s) => s === 1));

        const stackLength = this.stack.length;

        this.score += GRID_HEIGHT - stackLength;
        document.getElementById('score').innerHTML = this.score;

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
                case ' ':
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
                case 'ArrowUp':
                    if (e.repeat) return;

                    const interval = setInterval(() => {
                        let fall = this.moveTetrino({ x: 0, y: 1 }) === 1;

                        if (!fall) clearInterval(interval);
                    }, 10);

                    break;
            }

            e.stopPropagation();
        });
    }

    paintTetrino() {
        drawTetrino(
            bricksCanvas,
            this.activeTetrino,
            this.activeTetrinoShadowOffset,
            GRID_WIDTH,
            GRID_HEIGHT
        );
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

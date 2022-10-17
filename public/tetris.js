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
const SCORE_LEVELS = [0, 5000, 10000, 20000, 35000, 50000, 100000, Infinity];
// const SCORE_LEVELS = [0, 500, 1000, 2000, 3500, 5000, 10000, Infinity];
const SPEED_LEVELS = [1000, 900, 800, 700, 600, 500, 400, 300, 200];
class Tetris {
    nextTetrino = null;
    activeTetrino = null;
    bricksCount = 0;
    stack = [];
    lines = 0;
    pause = true;

    constructor() {
        this.initStack();
        this.initControls();
        this.nextTetrino = RandomTetrinoFactory();
    }

    get level() {
        return (
            SCORE_LEVELS.findIndex(
                (s, i) => this.score >= s && SCORE_LEVELS[i + 1] > this.score
            ) + 1
        );
    }

    get tickInMilliseconds() {
        return SPEED_LEVELS[this.level - 1];
    }

    get score() {
        return this.bricksCount * 50 + this.lines * 100;
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
                            this.getNextGrid(
                                { x: 0, y: 1 },
                                this.activeTetrino,
                                offset
                            )[rowIndex][colIndex] && col
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
        this.pause = false;
        this.startClock();
    }

    startClock() {
        const routine = async () => {
            if (this.pause) return;

            this.moveTetrino({ x: 0, y: 1 });

            this.printScore();
            this.printLevel();
            setTimeout(() => routine(), this.tickInMilliseconds);
        };
        routine();
    }

    reset() {
        this.stop();
        this.start();
    }

    stop() {
        this.pause = true;
        this.bricksCount = 0;
        this.lines = 0;
        this.initStack();
        this.paintStack();
        this.paintTetrino();
    }

    printScore() {
        document.getElementById('score').innerHTML = this.score;
    }

    printLevel() {
        document.getElementById('level').innerHTML = this.level;
    }

    getNextTetrino() {
        const stamp = this.nextTetrino;

        if (this.checkEndGame(stamp)) {
            if (confirm(`Game over, try again? Your score: ${this.score}`)) {
                this.reset();
            } else {
                this.stop();
            }
        }

        this.nextTetrino = RandomTetrinoFactory();

        drawNextTetrino(this.nextTetrino);

        return stamp;
    }

    checkEndGame(newTetrino) {
        return newTetrino.currentShape.some((row, rowIndex) =>
            row.some(
                (col, colIndex) =>
                    this.getNextGrid({ x: 0, y: 0 }, newTetrino)[rowIndex][
                        colIndex
                    ] && col
            )
        );
    }

    getNextGrid(vector, tetrino, offset = 0) {
        const grid = [];

        for (let i = 0; i < tetrino.height; i++) {
            grid.push([]);

            for (let j = 0; j < tetrino.width; j++) {
                if (
                    typeof this.stack[
                        tetrino.position.y + vector.y + offset + i
                    ] === 'undefined' ||
                    typeof this.stack[
                        tetrino.position.y + vector.y + offset + i
                    ][tetrino.position.x + vector.x + j] === 'undefined'
                ) {
                    grid[i].push(1);
                } else {
                    grid[i].push(
                        this.stack[tetrino.position.y + vector.y + offset + i][
                            tetrino.position.x + vector.x + j
                        ]
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
                        this.getNextGrid(vector, this.activeTetrino)[rowIndex][
                            colIndex
                        ] && col
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
                        this.getNextGrid({ x: 0, y: 0 }, this.activeTetrino)[
                            rowIndex
                        ][colIndex] && col
                )
            )
        ) {
            this.activeTetrino.rotation = rotationStamp;
        }

        this.paintTetrino();
    }

    mergeTetrinoToStack() {
        this.bricksCount += this.activeTetrino.currentShape
            .flat()
            .reduce((a, c) => (a += c), 0);

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

        this.lines += GRID_HEIGHT - stackLength;

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
                    this.forceDown();
                    break;
            }

            e.stopPropagation();
        });
    }

    forceDown() {
        const copy = this.activeTetrino;

        const interval = setInterval(() => {
            let fall = this.moveTetrino({ x: 0, y: 1 }) === 1;

            if (!fall || this.activeTetrino !== copy) clearInterval(interval);
        }, 10);
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

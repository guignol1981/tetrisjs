import { RandomTetrinosFactory } from './src/tetrinos.js';

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

class Tetris {
    activeTetrino = null;
    bricks = [];

    constructor() {
        for (let i = 0; i < 20; i++) {
            this.bricks.push([]);
            for (let j = 0; j < 10; j++) {
                this.bricks[i].push(0);
            }
        }

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

    get activeTetrinoLeftGrid() {
        if (!this.activeTetrino) return;

        const grid = [];

        for (let i = 0; i < this.activeTetrino.height; i++) {
            grid.push([]);

            for (let j = 0; j < this.activeTetrino.width; j++) {
                if (
                    typeof this.bricks[this.activeTetrino.position.y + i] ===
                        'undefined' ||
                    typeof this.bricks[this.activeTetrino.position.y + i][
                        this.activeTetrino.position.x - 1 + j
                    ] === 'undefined'
                ) {
                    grid[i].push(1);
                } else {
                    grid[i].push(
                        this.bricks[this.activeTetrino.position.y + i][
                            this.activeTetrino.position.x - 1 + j
                        ]
                    );
                }
            }
        }

        return grid;
    }

    get activeTetrinoRightGrid() {
        if (!this.activeTetrino) return;

        const grid = [];

        for (let i = 0; i < this.activeTetrino.height; i++) {
            grid.push([]);

            for (let j = 0; j < this.activeTetrino.width; j++) {
                if (
                    typeof this.bricks[this.activeTetrino.position.y + i] ===
                        'undefined' ||
                    typeof this.bricks[this.activeTetrino.position.y + i][
                        this.activeTetrino.position.x + 1 + j
                    ] === 'undefined'
                ) {
                    grid[i].push(1);
                } else {
                    grid[i].push(
                        this.bricks[this.activeTetrino.position.y + i][
                            this.activeTetrino.position.x + 1 + j
                        ]
                    );
                }
            }
        }

        return grid;
    }

    get activeTetrinoDownGrid() {
        if (!this.activeTetrino) return;

        const grid = [];

        for (let i = 0; i < this.activeTetrino.height; i++) {
            grid.push([]);

            for (let j = 0; j < this.activeTetrino.width; j++) {
                if (
                    typeof this.bricks[
                        this.activeTetrino.position.y + 1 + i
                    ] === 'undefined' ||
                    typeof this.bricks[this.activeTetrino.position.y + 1 + i][
                        this.activeTetrino.position.x + j
                    ] === 'undefined'
                ) {
                    grid[i].push(1);
                } else {
                    grid[i].push(
                        this.bricks[this.activeTetrino.position.y + 1 + i][
                            this.activeTetrino.position.x + j
                        ]
                    );
                }
            }
        }

        console.table(this.bricks);

        return grid;
    }

    start() {
        this.activeTetrino = RandomTetrinosFactory();

        setInterval(() => {
            if (this.canMove('down')) {
                this.activeTetrino.moveDown();
            } else {
                this.mergeTetrino();
                this.activeTetrino = RandomTetrinosFactory();
            }

            this.paint();
        }, 1000);
    }

    canMove(direction) {
        if (!this.activeTetrino) return;

        return !this.activeTetrino.currentShape.some((row, rowIndex) => {
            return row.some((col, colIndex) => {
                switch (direction) {
                    case 'left':
                        return (
                            this.activeTetrinoLeftGrid[rowIndex][colIndex] &&
                            col
                        );
                    case 'right':
                        return (
                            this.activeTetrinoRightGrid[rowIndex][colIndex] &&
                            col
                        );
                    case 'down':
                        return (
                            this.activeTetrinoDownGrid[rowIndex][colIndex] &&
                            col
                        );
                }
            });
        });
    }

    mergeTetrino() {
        if (!this.activeTetrino) return;

        this.activeTetrino.currentShape.forEach((row, rowIndex) => {
            row.forEach((square, squareIndex) => {
                if (
                    !square ||
                    typeof this.bricks[
                        this.activeTetrino.position.y + rowIndex
                    ] === 'undefined' ||
                    typeof this.bricks[
                        this.activeTetrino.position.y + rowIndex
                    ][this.activeTetrino.position.x + squareIndex] ===
                        'undefined'
                )
                    return;

                this.bricks[this.activeTetrino.position.y + rowIndex][
                    this.activeTetrino.position.x + squareIndex
                ] = square;
            });
        });
    }

    paint() {
        clear();
        drawGrid();
        drawTetrinos(this.activeTetrino);
        drawBricks(this.bricks);
        debug(this.bricks);
    }
}

const debug = (bricks) => {
    ctx.fillStyle = 'black';
    ctx.textAlign = 'center';

    bricks.forEach((row, rowIndex) => {
        row.forEach((square, squareIndex) => {
            ctx.fillText(
                square.toString(),
                squareIndex * (canvas.width / 10),
                rowIndex * (canvas.height / 20)
            );
        });
    });
};

const drawBricks = (bricks) => {
    ctx.fillStyle = 'red';
    ctx.beginPath();

    bricks.forEach((row, rowIndex) => {
        row.forEach((square, squareIndex) => {
            if (!square) return;

            ctx.rect(
                squareIndex * (canvas.width / 10),
                rowIndex * (canvas.height / 20),
                canvas.width / 10,
                canvas.height / 20
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
        row.forEach((square, squareIndex) => {
            if (!!square) {
                ctx.rect(
                    (squareIndex * canvas.width) / 10 +
                        (tetrino.position.x * canvas.width) / 10,
                    (rowIndex * canvas.height) / 20 +
                        (tetrino.position.y * canvas.height) / 20,
                    canvas.width / 10,
                    canvas.height / 20
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

    for (let i = 1; i < 10; i++) {
        ctx.beginPath();
        ctx.moveTo((i * canvas.width) / 10, 0);
        ctx.lineTo((i * canvas.width) / 10, canvas.height);

        ctx.stroke();
        ctx.closePath();
    }

    for (let i = 1; i < 20; i++) {
        ctx.beginPath();
        ctx.moveTo(0, (i * canvas.height) / 20);
        ctx.lineTo(canvas.width, (i * canvas.height) / 20);

        ctx.stroke();
        ctx.closePath();
    }
};

const clear = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
};

const tetris = new Tetris();
tetris.start();

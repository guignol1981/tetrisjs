class Tetrino {
    constructor(shapes, rotation, color) {
        this.shapes = shapes;
        this.rotation = rotation;
        this.color = color;
        this.position = { x: 0, y: 0 };
    }

    get currentShape() {
        return this.shapes[this.rotation];
    }

    get width() {
        return this.shapes[0][0].length;
    }

    get height() {
        return this.shapes[0].length;
    }

    rotate() {
        this.rotation = (this.rotation + 1) % 4;
    }

    moveLeft() {
        this.position.x--;
    }

    moveRight() {
        this.position.x++;
    }

    moveDown() {
        this.position.y++;
    }
}

const RandomTetrinoFactory = () => {
    const params = [
        {
            shapes: {
                0: [
                    [0, 0, 0, 0],
                    [0, 0, 0, 0],
                    [1, 1, 1, 1],
                    [0, 0, 0, 0],
                ],
                1: [
                    [0, 0, 1, 0],
                    [0, 0, 1, 0],
                    [0, 0, 1, 0],
                    [0, 0, 1, 0],
                ],
                2: [
                    [0, 0, 0, 0],
                    [0, 0, 0, 0],
                    [1, 1, 1, 1],
                    [0, 0, 0, 0],
                ],
                3: [
                    [0, 0, 1, 0],
                    [0, 0, 1, 0],
                    [0, 0, 1, 0],
                    [0, 0, 1, 0],
                ],
            },
            rotation: 1,
            color: 'blue',
        },
        {
            shapes: {
                0: [
                    [0, 0, 0, 0],
                    [0, 1, 1, 0],
                    [0, 1, 1, 0],
                    [0, 0, 0, 0],
                ],
                1: [
                    [0, 0, 0, 0],
                    [0, 1, 1, 0],
                    [0, 1, 1, 0],
                    [0, 0, 0, 0],
                ],
                2: [
                    [0, 0, 0, 0],
                    [0, 1, 1, 0],
                    [0, 1, 1, 0],
                    [0, 0, 0, 0],
                ],
                3: [
                    [0, 0, 0, 0],
                    [0, 1, 1, 0],
                    [0, 1, 1, 0],
                    [0, 0, 0, 0],
                ],
            },
            rotation: 0,
            color: 'purple',
        },
        {
            shapes: {
                0: [
                    [0, 0, 0],
                    [1, 1, 1],
                    [0, 0, 1],
                ],
                1: [
                    [0, 1, 0],
                    [0, 1, 0],
                    [1, 1, 0],
                ],
                2: [
                    [1, 0, 0],
                    [1, 1, 1],
                    [0, 0, 0],
                ],
                3: [
                    [0, 1, 1],
                    [0, 1, 0],
                    [0, 1, 0],
                ],
            },
            rotation: 0,
            color: 'red',
        },
        {
            shapes: {
                0: [
                    [0, 0, 0],
                    [1, 1, 1],
                    [1, 0, 0],
                ],
                1: [
                    [1, 1, 0],
                    [0, 1, 0],
                    [0, 1, 0],
                ],
                2: [
                    [0, 0, 1],
                    [1, 1, 1],
                    [0, 0, 0],
                ],
                3: [
                    [0, 1, 0],
                    [0, 1, 0],
                    [0, 1, 1],
                ],
            },
            rotation: 0,
            color: 'green',
        },
        {
            shapes: {
                0: [
                    [0, 0, 0],
                    [0, 1, 1],
                    [1, 1, 0],
                ],
                1: [
                    [0, 1, 0],
                    [0, 1, 1],
                    [0, 0, 1],
                ],
                2: [
                    [0, 0, 0],
                    [0, 1, 1],
                    [1, 1, 0],
                ],
                3: [
                    [0, 1, 0],
                    [0, 1, 1],
                    [0, 0, 1],
                ],
            },
            rotation: 0,
            color: 'yellow',
        },
        {
            shapes: {
                0: [
                    [0, 0, 0],
                    [1, 1, 1],
                    [0, 1, 0],
                ],
                1: [
                    [0, 1, 0],
                    [1, 1, 0],
                    [0, 1, 0],
                ],
                2: [
                    [0, 1, 0],
                    [1, 1, 1],
                    [0, 0, 0],
                ],
                3: [
                    [0, 1, 0],
                    [0, 1, 1],
                    [0, 1, 0],
                ],
            },
            rotation: 0,
            color: 'cyan',
        },
        {
            shapes: {
                0: [
                    [0, 0, 0],
                    [1, 1, 0],
                    [0, 1, 1],
                ],
                1: [
                    [0, 0, 1],
                    [0, 1, 1],
                    [0, 1, 0],
                ],
                2: [
                    [0, 0, 0],
                    [1, 1, 0],
                    [0, 1, 1],
                ],
                3: [
                    [0, 0, 1],
                    [0, 1, 1],
                    [0, 1, 0],
                ],
            },
            rotation: 0,
            color: 'orange',
        },
    ];

    const param = params[Math.floor(Math.random() * params.length) + 0];

    return new Tetrino(param.shapes, param.rotation, param.color);
};

export { RandomTetrinoFactory };

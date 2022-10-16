class Tetrino {
    constructor(shapes, rotation, sprite) {
        this.shapes = shapes;
        this.rotation = rotation;
        this.sprite = sprite;
        this.position = { x: 3, y: 0 };
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

    move(vector) {
        this.position.x += vector.x;
        this.position.y += vector.y;
    }
}

const RandomTetrinoFactory = () => {
    const params = [
        // {
        //     shapes: {
        //         0: [
        //             [0, 1],
        //             [0, 1],
        //         ],
        //         1: [
        //             [0, 1],
        //             [0, 1],
        //         ],
        //         2: [
        //             [0, 1],
        //             [0, 1],
        //         ],
        //         3: [
        //             [0, 1],
        //             [0, 1],
        //         ],
        //     },
        //     rotation: 1,
        //     sprite: 'yellowBricks',
        // },
        // {
        //     shapes: {
        //         0: [
        //             [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        //             [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        //             [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        //             [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        //             [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        //             [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        //             [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        //             [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        //             [1, 0, 1, 1, 1, 1, 1, 1, 1, 1],
        //             [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        //         ],
        //         1: [
        //             [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        //             [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        //             [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        //             [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        //             [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        //             [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        //             [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        //             [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        //             [1, 0, 1, 1, 1, 1, 1, 1, 1, 1],
        //             [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        //         ],
        //         2: [
        //             [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        //             [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        //             [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        //             [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        //             [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        //             [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        //             [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        //             [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        //             [1, 0, 1, 1, 1, 1, 1, 1, 1, 1],
        //             [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        //         ],
        //         3: [
        //             [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        //             [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        //             [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        //             [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        //             [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        //             [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        //             [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        //             [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        //             [1, 0, 1, 1, 1, 1, 1, 1, 1, 1],
        //             [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        //         ],
        //     },
        //     rotation: 1,
        //     sprite: 'yellowBricks',
        // },
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
            sprite: 'yellowBricks',
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
            sprite: 'yellowBricks',
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
            sprite: 'yellowBricks',
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
            sprite: 'blueBricks',
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
            sprite: 'purpleBricks',
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
            sprite: 'redBricks',
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
            sprite: 'greenBricks',
        },
    ];

    const param = params[Math.floor(Math.random() * params.length) + 0];

    return new Tetrino(param.shapes, param.rotation, param.sprite);
};

export { RandomTetrinoFactory };

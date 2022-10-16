const sprites = {
    wallBricks: {
        spriteName: 'wall_bricks.png',
        image: new Image(),
    },
    stackBricks: {
        spriteName: 'stack_bricks.png',
        image: new Image(),
    },
    yellowBricks: {
        spriteName: 'yellow_bricks.png',
        image: new Image(),
    },
    blueBricks: {
        spriteName: 'blue_bricks.png',
        image: new Image(),
    },
    redBricks: {
        spriteName: 'red_bricks.png',
        image: new Image(),
    },
    purpleBricks: {
        spriteName: 'purple_bricks.png',
        image: new Image(),
    },
    greenBricks: {
        spriteName: 'green_bricks.png',
        image: new Image(),
    },
};

let backgroundImage = new Image();

const initSprites = async (backgroundCanvas, gridWidth, gridHeight) => {
    backgroundCanvas.height;
    backgroundCanvas.width;
    const ctx = backgroundCanvas.getContext('2d');

    await Promise.all(
        Object.values(sprites).map(
            (s) =>
                new Promise((res) => {
                    s.image.onload = () => {
                        res();
                    };

                    s.image.src = `./${s.spriteName}`;
                })
        )
    );

    for (let i = 0; i < gridWidth; i++) {
        for (let j = 0; j < gridHeight; j++) {
            ctx.drawImage(
                sprites.wallBricks.image,
                (i * backgroundCanvas.width) / gridWidth,
                (j * backgroundCanvas.height) / gridHeight,
                backgroundCanvas.width / gridWidth,
                backgroundCanvas.height / gridHeight
            );
        }
    }

    backgroundImage.src = backgroundCanvas.toDataURL();

    return new Promise((res) => {
        backgroundImage.onload = () => res();
    });
};

const drawStack = (canvas, stack, gridWidth, gridHeight) => {
    const ctx = canvas.getContext('2d');

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = 'red';

    stack.forEach((row, rowIndex) => {
        row.forEach((col, colIndex) => {
            if (col === 0) return;

            ctx.drawImage(
                sprites.stackBricks.image,
                (colIndex * backgroundCanvas.width) / gridWidth,
                (rowIndex * backgroundCanvas.height) / gridHeight,
                backgroundCanvas.width / gridWidth,
                backgroundCanvas.height / gridHeight
            );

            ctx.fill();
        });
    });
};

const drawTetrino = (canvas, tetrino, gridWidth, gridHeight) => {
    if (!tetrino) return;

    const ctx = canvas.getContext('2d');

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = tetrino.color;

    tetrino.currentShape.forEach((row, rowIndex) => {
        row.forEach((col, colIndex) => {
            if (!!col) {
                ctx.drawImage(
                    sprites[tetrino.sprite].image,
                    (colIndex * canvas.width) / gridWidth +
                        (tetrino.position.x * canvas.width) / gridWidth,
                    (rowIndex * canvas.height) / gridHeight +
                        (tetrino.position.y * canvas.height) / gridHeight,
                    canvas.width / gridWidth,
                    canvas.height / gridHeight
                );
            }
        });
    });
};

const drawGrid = (canvas) => {
    const ctx = canvas.getContext('2d');
    ctx.drawImage(backgroundImage, 0, 0);
};

const clear = (canvas) => {
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
};

export { drawGrid, drawStack, drawTetrino, clear, initSprites, sprites };

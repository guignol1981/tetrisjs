const sprites = {};
const initSprites = async () => {};
const drawstack = (canvas, stack, gridWidth, gridHeight) => {
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = 'red';

    stack.forEach((row, rowIndex) => {
        row.forEach((col, colIndex) => {
            if (!col) return;

            ctx.rect(
                colIndex * (canvas.width / gridWidth),
                rowIndex * (canvas.height / gridHeight),
                canvas.width / gridWidth,
                canvas.height / gridHeight
            );

            ctx.fill();
        });
    });
};

const drawTetrino = (canvas, tetrino, gridWidth, gridHeight, image) => {
    if (!tetrino) return;

    const ctx = canvas.getContext('2d');

    ctx.fillStyle = tetrino.color;

    tetrino.currentShape.forEach((row, rowIndex) => {
        row.forEach((col, colIndex) => {
            if (!!col) {
                ctx.drawImage(
                    image,
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

const drawGrid = (canvas, gridWidth, gridHeight) => {
    const ctx = canvas.getContext('2d');

    ctx.strokeStyle = 'red';
    ctx.rowWidth = 1;

    for (let i = 1; i < gridWidth; i++) {
        ctx.beginPath();
        ctx.moveTo((i * canvas.width) / gridWidth, 0);
        ctx.lineTo((i * canvas.width) / gridWidth, canvas.height);

        ctx.stroke();
        ctx.closePath();
    }

    for (let i = 1; i < gridHeight; i++) {
        ctx.beginPath();
        ctx.moveTo(0, (i * canvas.height) / gridHeight);
        ctx.lineTo(canvas.width, (i * canvas.height) / gridHeight);

        ctx.stroke();
        ctx.closePath();
    }
};

const clear = (canvas) => {
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
};

export { drawGrid, drawstack, drawTetrino, clear };

export const colors = ['red', 'blue', '#d7ff4c', 'black'];

export const generateGrids = () => {
    const gridSize = 10; // 10x10 grid size
    const grids = [];

    for (let i = 0; i < gridSize * gridSize; i++) {
        const randomColorIndex = Math.floor(Math.random() * colors.length);
        grids.push(colors[randomColorIndex]);
    }

    return grids;
};
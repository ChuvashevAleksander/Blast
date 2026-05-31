const row: number = Math.floor(Math.random() * (12 - 6 + 1)) + 6;
const col: number = Math.floor(Math.random() * (12 - 6 + 1)) + 6;
const spacing: number = 4;

export const gameConfig = {
    row,
    col,
    spacing,
};

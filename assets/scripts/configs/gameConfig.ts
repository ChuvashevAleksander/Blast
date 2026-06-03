const row: number = Math.floor(Math.random() * (12 - 6 + 1)) + 6;
const col: number = Math.floor(Math.random() * (12 - 6 + 1)) + 6;
const spacing: number = 4;

export const gameConfig = {
    row,
    col,
    spacing,
};

const scoreForTile: number = 5;
const numbersOfMoves: number = 10;
const winScore: number = 200;

export const ruleConfig = {
    scoreForTile,
    numbersOfMoves,
    winScore,
};

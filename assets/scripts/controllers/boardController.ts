import { gameConfig } from "../configs/gameConfig";
import { ICellData } from "../models/cellData";
import TileView, { TileColor } from "../view/tileView";

const { ccclass, property } = cc._decorator;

@ccclass
export default class BoardController extends cc.Component {
    @property(cc.Node)
    cellContainer: cc.Node = null;

    @property(cc.Node)
    tileContainer: cc.Node = null;

    @property(cc.Prefab)
    cellView: cc.Prefab = null;

    @property(cc.Prefab)
    tileView: cc.Prefab = null;

    private _cells: (ICellData | null)[][] = [];

    start() {
        this._createBoard();
    }

    private _createBoard() {
        const row = gameConfig.row;
        const col = gameConfig.col;
        const spacing = gameConfig.spacing;

        const cellSize = Math.min(
            (this.cellContainer.width - (col - 1) * spacing) / col,

            (this.cellContainer.height - (row - 1) * spacing) / row,
        );

        const boardWidth = col * cellSize + (col - 1) * spacing;

        const boardHeight = row * cellSize + (row - 1) * spacing;

        const startX = -boardWidth / 2 + cellSize / 2;
        const startY = boardHeight / 2 - cellSize / 2;

        for (let r = 0; r < row; r++) {
            this._cells[r] = [];
            for (let c = 0; c < col; c++) {
                const tile = cc.instantiate(this.tileView);
                const cell = cc.instantiate(this.cellView);

                cell.width = cellSize;
                cell.height = cellSize;
                cell.parent = this.cellContainer;

                const x = startX + c * (cellSize + spacing);
                const y = startY - r * (cellSize + spacing);

                cell.setPosition(x, y);

                tile.parent = this.tileContainer;
                tile.setPosition(x, y);
                tile.width = cellSize;
                tile.height = cellSize;

                const tileView = tile.getComponent(TileView);
                const color = Math.floor(Math.random() * 5);

                tileView.setColor(color);

                tileView.row = r;
                tileView.col = c;

                tileView.onClick = (row, col) => {
                    this._onTileClicked(row, col);
                };

                this._cells[r][c] = {
                    row: r,
                    col: c,
                    color: color,

                    cellNode: cell,
                    tileNode: tile,
                };
            }
        }
    }

    private _onTileClicked(row: number, col: number) {
        const group = this._findGroup(row, col);

        if (group.length < 2) {
            return;
        }

        this._removeGroup(group);
    }

    private _findGroup(row: number, col: number): ICellData[] {
        const targetColor = this._cells[row][col].color;

        const result: ICellData[] = [];
        const visited = new Set<string>();

        const dfs = (r: number, c: number) => {
            if (r < 0 || r >= gameConfig.row || c < 0 || c >= gameConfig.col) {
                return;
            }

            const key = `${r}_${c}`;

            if (visited.has(key)) {
                return;
            }

            const cell = this._cells[r][c];

            if (!cell) {
                return;
            }

            if (cell.color !== targetColor) {
                return;
            }

            visited.add(key);
            result.push(cell);

            dfs(r - 1, c);
            dfs(r + 1, c);
            dfs(r, c - 1);
            dfs(r, c + 1);
        };

        dfs(row, col);

        return result;
    }

    private _removeGroup(group: ICellData[]) {
        group.forEach((cell) => {
            this._cells[cell.row][cell.col] = null;

            cc.Tween.stopAllByTarget(cell.tileNode);

            cc.tween(cell.tileNode)
                .parallel(
                    cc.tween().to(0.15, {
                        scale: 0,
                    }),
                    cc.tween().to(0.15, {
                        opacity: 0,
                    }),
                )
                .call(() => {
                    cell.tileNode.destroy();
                })
                .start();
        });
    }
}

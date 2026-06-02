import { gameConfig } from "../configs/gameConfig";
import TileFactory from "../factory/tileFactory";
import { ICellData } from "../models/cellData";
import TileView from "../view/tileView";

const { ccclass, property } = cc._decorator;

@ccclass
export default class BoardController extends cc.Component {
    @property(cc.Node)
    cellContainer: cc.Node = null;

    @property(cc.Node)
    tileContainer: cc.Node = null;

    @property(cc.Prefab)
    cellView: cc.Prefab = null;

    private _tileFactory: TileFactory;
    private _cells: (ICellData | null)[][] = [];
    private _spacing: number = 0;
    private _cellSize: number = 0;
    private _startX: number = 0;
    private _startY: number = 0;
    private _isUpdating: boolean = false;

    start() {
        this._spacing = gameConfig.spacing;
        this._createBoard();
    }

    public init(tileFactory: TileFactory) {
        this._tileFactory = tileFactory;
    }

    private _createBoard() {
        const row = gameConfig.row;
        const col = gameConfig.col;

        this._cellSize = Math.min(
            (this.cellContainer.width - (col - 1) * this._spacing) / col,
            (this.cellContainer.height - (row - 1) * this._spacing) / row,
        );

        const boardWidth = col * this._cellSize + (col - 1) * this._spacing;
        const boardHeight = row * this._cellSize + (row - 1) * this._spacing;

        this._startX = -boardWidth / 2 + this._cellSize / 2;
        this._startY = boardHeight / 2 - this._cellSize / 2;

        for (let r = 0; r < row; r++) {
            this._cells[r] = [];
            for (let c = 0; c < col; c++) {
                const cell = cc.instantiate(this.cellView);
                const tile = this._tileFactory.createTile();

                cell.width = this._cellSize;
                cell.height = this._cellSize;
                cell.parent = this.cellContainer;

                const x = this._startX + c * (this._cellSize + this._spacing);
                const y = this._startY - r * (this._cellSize + this._spacing);

                cell.setPosition(x, y);

                tile.parent = this.tileContainer;
                tile.setPosition(x, y);
                tile.width = this._cellSize;
                tile.height = this._cellSize;

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
        if (this._isUpdating) return;
        const group = this._findGroup(row, col);

        if (group.length < 2) {
            return;
        }

        this._isUpdating = true;

        this._removeGroup(group);
        this._collapseColumns();
        this._spawnNewTiles();
        this._updateTilePositions();

        this.scheduleOnce(() => {
            this._isUpdating = false;
        }, 0.3);
    }

    private _findGroup(row: number, col: number): ICellData[] {
        const startCell = this._cells[row][col];

        if (!startCell) {
            return [];
        }

        const targetColor = startCell.color;

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

            this._tileFactory.releaseTile(cell.tileNode);
        });
    }

    private _collapseColumns() {
        for (let col = 0; col < gameConfig.col; col++) {
            const tiles: ICellData[] = [];

            for (let row = 0; row < gameConfig.row; row++) {
                const cell = this._cells[row][col];

                if (cell) {
                    tiles.push(cell);
                }
            }

            for (let row = 0; row < gameConfig.row; row++) {
                this._cells[row][col] = null;
            }

            let targetRow = gameConfig.row - 1;

            for (let i = tiles.length - 1; i >= 0; i--) {
                const cell = tiles[i];

                this._cells[targetRow][col] = cell;

                cell.row = targetRow;
                cell.col = col;

                const tileView = cell.tileNode.getComponent(TileView);

                tileView.row = targetRow;
                tileView.col = col;

                targetRow--;
            }
        }
    }

    private _getCellPosition(row: number, col: number): cc.Vec3 {
        return cc.v3(
            this._startX + col * (this._cellSize + this._spacing),
            this._startY - row * (this._cellSize + this._spacing),
            0,
        );
    }

    private _updateTilePositions() {
        for (let row = 0; row < gameConfig.row; row++) {
            for (let col = 0; col < gameConfig.col; col++) {
                const cell = this._cells[row][col];

                if (!cell) {
                    continue;
                }

                const targetPos = this._getCellPosition(row, col);

                cc.Tween.stopAllByTarget(cell.tileNode);

                cc.tween(cell.tileNode)
                    .to(
                        0.25,
                        {
                            x: targetPos.x,
                            y: targetPos.y,
                        },
                        {
                            easing: "quadOut",
                        },
                    )
                    .start();
            }
        }
    }

    private _spawnNewTiles() {
        for (let col = 0; col < gameConfig.col; col++) {
            for (let row = 0; row < gameConfig.row; row++) {
                if (this._cells[row][col]) {
                    continue;
                }

                const tile = this._tileFactory.createTile();

                const color = Math.floor(Math.random() * 5);

                const tileView = tile.getComponent(TileView);

                tileView.setColor(color);

                tileView.row = row;
                tileView.col = col;

                tileView.onClick = (r, c) => {
                    this._onTileClicked(r, c);
                };

                tile.parent = this.tileContainer;

                const spawnPos = this._getCellPosition(-1, col);

                tile.setPosition(spawnPos);

                this._cells[row][col] = {
                    row,
                    col,
                    color,

                    cellNode: null,
                    tileNode: tile,
                };
            }
        }
    }
}

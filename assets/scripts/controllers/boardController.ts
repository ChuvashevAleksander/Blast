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

    private _row: number = 6;
    private _col: number = 8;
    private _cells: CellData[][] = [];
    private _spacing = 4;

    start() {
        this._createBoard();
    }

    private _createBoard() {
        const cellSize = Math.min(
            (this.cellContainer.width - (this._col - 1) * this._spacing) /
                this._col,

            (this.cellContainer.height - (this._row - 1) * this._spacing) /
                this._row,
        );

        const boardWidth =
            this._col * cellSize + (this._col - 1) * this._spacing;

        const boardHeight =
            this._row * cellSize + (this._row - 1) * this._spacing;

        const startX = -boardWidth / 2 + cellSize / 2;
        const startY = boardHeight / 2 - cellSize / 2;
        // const cellSize = Math.min(
        //     this.cellContainer.width / this._col,
        //     this.cellContainer.height / this._row,
        // );

        for (let r = 0; r < this._row; r++) {
            this._cells[r] = [];
            for (let c = 0; c < this._col; c++) {
                const tile = cc.instantiate(this.tileView);
                const cell = cc.instantiate(this.cellView);

                cell.width = cellSize;
                cell.height = cellSize;
                cell.parent = this.cellContainer;

                const x = startX + c * (cellSize + this._spacing);
                const y = startY - r * (cellSize + this._spacing);

                cell.setPosition(x, y);

                tile.parent = this.tileContainer;
                tile.setPosition(x, y);
                tile.width = cellSize;
                tile.height = cellSize;

                const tileView = tile.getComponent(TileView);
                const color = Math.floor(Math.random() * 5);

                tileView.setColor(color);

                this._cells[r][c] = {
                    row: r,
                    col: c,

                    cellNode: cell,
                    tileNode: tile,
                };
            }
        }
    }
}

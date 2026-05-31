import { gameConfig } from "../configs/gameConfig";
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

    private _cells: ICellData[][] = [];

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

                    cellNode: cell,
                    tileNode: tile,
                };
            }
        }
    }

    private _onTileClicked(row: number, col: number) {
        const tile = this._cells[row][col].tileNode;

        cc.tween(tile)
            .to(0.08, { scale: 1.2 })
            .to(
                0.12,
                { scale: 1.0 },
                {
                    easing: "backOut",
                },
            )
            .start();
    }
}

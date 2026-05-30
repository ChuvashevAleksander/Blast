const { ccclass, property } = cc._decorator;

@ccclass
export default class BoardController extends cc.Component {
    @property(cc.Node)
    container: cc.Node;

    @property(cc.Prefab)
    cellView: cc.Prefab = null;

    private _row: number = 6;
    private _col: number = 6;
    private _cells: cc.Node[][] = [];

    start() {
        this._createBoard();
    }

    private _createBoard() {
        const cellSize = Math.min(
            this.container.width / this._col,
            this.container.height / this._row,
        );

        for (let r = 0; r < this._row; r++) {
            for (let c = 0; c < this._col; c++) {
                const cell = cc.instantiate(this.cellView);

                cell.width = cellSize;
                cell.height = cellSize;

                cell.parent = this.container;

                cell.setPosition(
                    -this.container.width / 2 + cellSize / 2 + c * cellSize,
                    this.container.height / 2 - cellSize / 2 - r * cellSize,
                );
            }
        }
    }
}

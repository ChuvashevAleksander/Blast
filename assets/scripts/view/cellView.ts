const { ccclass, property } = cc._decorator;

@ccclass
export default class CellView extends cc.Component {
    public row: number;
    public col: number;

    init(row: number, col: number) {
        this.row = row;
        this.col = col;
    }
}

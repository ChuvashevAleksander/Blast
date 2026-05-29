const {ccclass, property} = cc._decorator;

@ccclass
export default class CellView extends cc.Component {
    public x: number;
    public y: number;

    init(x: number, y: number) {
        this.x = x;
        this.y = y;
    }
}


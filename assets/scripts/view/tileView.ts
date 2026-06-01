const { ccclass, property } = cc._decorator;

export enum TileColor {
    Red,
    Blue,
    Green,
    Yellow,
    Purple,
}

@ccclass
export default class TileView extends cc.Component {
    @property([cc.SpriteFrame])
    sprites: cc.SpriteFrame[] = [];

    public row: number = 0;
    public col: number = 0;
    public color: TileColor = TileColor.Red;

    public onClick: (row: number, col: number) => void = null;

    private _sprite: cc.Sprite = null;

    onLoad() {
        this._sprite = this.getComponent(cc.Sprite);

        this.node.on(cc.Node.EventType.TOUCH_END, this._onClick, this);
    }

    onDestroy() {
        this.node.off(cc.Node.EventType.TOUCH_END, this._onClick, this);
    }

    public setColor(color: TileColor) {
        this.color = color;
        this._sprite.spriteFrame = this.sprites[color];
    }

    private _onClick() {
        this.onClick?.(this.row, this.col);
    }
}

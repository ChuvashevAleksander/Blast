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

    private _sprite: cc.Sprite = null;

    onLoad() {
        this._sprite = this.getComponent(cc.Sprite);
    }

    public setColor(color: TileColor) {
        this._sprite.spriteFrame = this.sprites[color];
    }
}

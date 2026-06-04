const { ccclass, property } = cc._decorator;

@ccclass
export default class UiBridge extends cc.Component {
    @property(cc.Sprite)
    overlay: cc.Sprite = null;

    @property(cc.Label)
    messageLabel: cc.Label = null;

    protected onLoad(): void {
        this.overlay.node.active = false;
    }

    public showWinLabel() {
        this.messageLabel.string = "Победа!";
        this.showOverlay();
    }

    public showLoseLabel() {
        this.messageLabel.string = "Проигрыш!";
        this.showOverlay();
    }

    public showOverlay() {
        this.overlay.node.active = true;
        cc.tween(this.overlay.node)
            .to(0.3, { opacity: 255 * 0.8 })
            .start();
        this.overlay.node.opacity = 255 * 0.8;
    }
}

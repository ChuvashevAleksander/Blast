import { ruleConfig } from "../configs/gameConfig";
import ScoreController from "./scoreController";
import UiBridge from "./uiBridge";

const { ccclass, property } = cc._decorator;

@ccclass
export default class GameResultController extends cc.Component {
    private _scoreController: ScoreController = null;
    private _uiBridge: UiBridge = null;

    constructor(scoreController: ScoreController, uiBridge: UiBridge) {
        super();
        this._scoreController = scoreController;
        this._uiBridge = uiBridge;
    }

    public checkGameOver() {
        if (this._scoreController.currentScore >= ruleConfig.winScore) {
            this._uiBridge.showWinLabel();
            this._restartGame();
        } else if (this._scoreController.currentRemainderMoves <= 0) {
            this._uiBridge.showLoseLabel();
            this._restartGame();
        }
    }

    public setLose() {
        this._uiBridge.showLoseLabel();
        this._restartGame();
    }

    private _restartGame() {
        cc.tween(this)
            .delay(5)
            .call(() => cc.director.loadScene(cc.director.getScene().name))
            .start();
    }
}

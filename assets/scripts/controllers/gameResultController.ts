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
        console.warn(this._scoreController.currentScore);
        console.warn(this._scoreController.currentRemainderMoves);
        if (this._scoreController.currentScore >= ruleConfig.winScore) {
            this._uiBridge.showWinLabel();
        } else if (this._scoreController.currentRemainderMoves <= 0) {
            this._uiBridge.showLoseLabel();
        }
    }
}

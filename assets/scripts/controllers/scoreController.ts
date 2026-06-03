import { ruleConfig } from "../configs/gameConfig";

const { ccclass, property } = cc._decorator;

@ccclass
export default class ScoreController extends cc.Component {
    @property(cc.Label)
    scoreLabel: cc.Label = null;

    @property(cc.Label)
    moveLabel: cc.Label = null;

    private _currentScore: number = 0;
    private _currentRemainderMoves: number = 0;

    protected onLoad(): void {
        this._currentRemainderMoves = ruleConfig.numbersOfMoves;
        this.moveLabel.string = this._currentRemainderMoves.toFixed();
        this.addScore(this._currentScore);
    }

    public addScore(score: number) {
        this._currentScore += score;
        const updatedLabel: string =
            this._currentScore + "/" + ruleConfig.winScore;
        this.scoreLabel.string = updatedLabel;
    }

    public reduceRemainderMoves() {
        this._currentRemainderMoves--;
        this.moveLabel.string = this._currentRemainderMoves.toFixed();
    }
}

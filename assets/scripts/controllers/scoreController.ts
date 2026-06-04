import { ruleConfig } from "../configs/gameConfig";

const { ccclass, property } = cc._decorator;

@ccclass
export default class ScoreController extends cc.Component {
    @property(cc.Label)
    scoreLabel: cc.Label = null;

    @property(cc.Label)
    moveLabel: cc.Label = null;

    public currentScore: number = 0;
    public currentRemainderMoves: number = 0;

    protected onLoad(): void {
        this.currentRemainderMoves = ruleConfig.numbersOfMoves;
        this.moveLabel.string = this.currentRemainderMoves.toFixed();
        this.addScore(this.currentScore);
    }

    public addScore(score: number) {
        this.currentScore += score;
        const updatedLabel: string =
            this.currentScore + "/" + ruleConfig.winScore;
        this.scoreLabel.string = updatedLabel;
    }

    public reduceRemainderMoves() {
        this.currentRemainderMoves--;
        this.moveLabel.string = this.currentRemainderMoves.toFixed();
    }
}

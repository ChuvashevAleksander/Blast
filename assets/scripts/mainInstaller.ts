import { gameConfig } from "./configs/gameConfig";
import BoardController from "./controllers/boardController";
import GameResultController from "./controllers/gameResultController";
import ScoreController from "./controllers/scoreController";
import UiBridge from "./controllers/uiBridge";
import { DI_KEYS } from "./diKeys";
import TileFactory from "./factory/tileFactory";

const { ccclass, property } = cc._decorator;

@ccclass
export default class MainInstaller extends cc.Component {
    public static instance: MainInstaller = null;
    private _container: Map<string, any> = new Map();
    private _registered = false;

    @property(BoardController)
    boardController: BoardController = null;

    @property(ScoreController)
    scoreController: ScoreController = null;

    @property(GameResultController)
    gameResultController: GameResultController = null;

    @property(UiBridge)
    uiBridge: UiBridge = null;

    @property(cc.Prefab)
    tileView: cc.Prefab = null;

    onLoad() {
        MainInstaller.instance = this;
        this._registerAll();
    }

    public resolve<T>(key: string): T {
        return this._container.get(key) as T;
    }

    private _registerAll() {
        if (this._registered) return;
        this._registered = true;

        if (!this.boardController) {
            this.boardController = this.getComponentInChildren(BoardController);
        }

        if (this.boardController) {
            this._container.set(DI_KEYS.BoardController, this.boardController);
        }

        if (this.uiBridge) {
            this._container.set(DI_KEYS.UiBridge, this.uiBridge);
        }

        if (this.scoreController) {
            this._container.set(DI_KEYS.ScoreController, this.scoreController);
        }

        const gameResultController = new GameResultController(
            this.scoreController,
            this.uiBridge,
        );
        if (this.gameResultController) {
            this._container.set(
                DI_KEYS.GameResultController,
                gameResultController,
            );
        }

        const tileFactory = new TileFactory(
            this.tileView,
            gameConfig.row * gameConfig.col + 20,
        );
        this._container.set(DI_KEYS.TileFactory, tileFactory);
        this.boardController.init(
            tileFactory,
            this.scoreController,
            gameResultController,
        );
    }
}

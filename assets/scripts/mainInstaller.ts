import BoardController from "./controllers/boardController";
import UiBridge from "./controllers/uiBridge";

const { ccclass, property } = cc._decorator;

@ccclass
export default class MainInstaller extends cc.Component {
    public static instance: MainInstaller = null;
    private _container: Map<string, any> = new Map();

    @property(BoardController)
    boardController: BoardController = null;

    @property(UiBridge)
    uiBridge: UiBridge = null;

    onLoad() {
        MainInstaller.instance = this;
        this.registerAll();
    }

    private registerAll() {
        if (this.boardController) {
            this._container.set("BoardController", this.boardController);
        }

        if (this.uiBridge) {
            this._container.set("UiBridge", this.uiBridge);
        }
    }

    public resolve<T>(key: string): T {
        return this._container.get(key) as T;
    }
}
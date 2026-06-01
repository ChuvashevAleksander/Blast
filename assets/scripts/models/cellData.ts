import { TileColor } from "../view/tileView";

export interface ICellData {
    row: number;
    col: number;

    color: TileColor;

    cellNode: cc.Node;
    tileNode: cc.Node;
}

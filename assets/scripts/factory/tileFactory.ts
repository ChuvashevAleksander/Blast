export default class TileFactory {
    private _pool = new cc.NodePool();
    private _prefab: cc.Prefab;

    constructor(prefab: cc.Prefab, preloadCount: number = 100) {
        this._prefab = prefab;

        for (let i = 0; i < preloadCount; i++) {
            this._pool.put(cc.instantiate(prefab));
        }
    }

    public createTile(): cc.Node {
        let tile: cc.Node;

        if (this._pool.size() > 0) {
            tile = this._pool.get();
        } else {
            tile = cc.instantiate(this._prefab);
        }

        tile.scale = 1;
        tile.opacity = 255;

        cc.Tween.stopAllByTarget(tile);

        return tile;
    }

    public releaseTile(node: cc.Node) {
        node.scale = 1;
        node.opacity = 255;

        cc.Tween.stopAllByTarget(node);

        this._pool.put(node);
    }
}

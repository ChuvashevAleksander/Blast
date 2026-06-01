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
        if (this._pool.size() > 0) {
            return this._pool.get();
        }

        return cc.instantiate(this._prefab);
    }

    public releaseTile(node: cc.Node) {
        node.scale = 1;
        node.opacity = 255;

        cc.Tween.stopAllByTarget(node);

        this._pool.put(node);
    }
}

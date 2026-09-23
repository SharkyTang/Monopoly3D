import { _decorator, Component, Node } from 'cc';

const { ccclass, property } = _decorator;

@ccclass('BoardManager')
export class BoardManager extends Component {

    @property([Node])
    tiles: Node[] = [];

    start() {
        console.log(`[BoardManager] Loaded ${this.tiles.length} tiles.`);

        for (let i = 0; i < this.tiles.length; i++) {
            console.log(`[BoardManager] Tile ${i}: ${this.tiles[i].name}`);
        }
    }

    public getTile(index: number): Node | null {
        if (index < 0 || index >= this.tiles.length) {
            console.warn(`[BoardManager] Invalid tile index: ${index}`);
            return null;
        }

        return this.tiles[index];
    }
}

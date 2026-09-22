# Monopoly3D v0.1 — TurnManager 阶段交接存档

> 项目：微信小游戏 3D 大富翁  
> 引擎：Cocos Creator 3.8.8  
> 当前阶段：v0.1 Core Prototype  
> 用途：作为新对话 / 后续开发的阶段基线，避免上下文过长后丢失当前正确状态。

## 1. 当前项目状态

当前已经完成一个可操作的四人回合制灰盒原型。

已验证核心流程：

```text
玩家点击 ROLL DICE
↓
DiceSystem 随机生成两颗 D6
↓
GameManager 获取当前玩家
↓
PlayerController 按骰子点数逐格 Tween 移动
↓
BoardManager 提供 Tile 顺序和位置
↓
移动完成
↓
TurnManager.nextTurn()
↓
UI 更新为下一玩家
↓
下一名玩家继续点击 ROLL DICE
```

四个玩家已经完整跑通：

```text
Player_1 → Player_2 → Player_3 → Player_4 → Player_1
```

TurnManager 基础版验收通过。

## 2. 当前项目名称与场景

```text
Monopoly3D_v0.1_Core_Prototype
```

当前主场景：

```text
assets/scenes/Main.scene
```

## 3. 当前 Assets 目录结构

```text
assets/
├── materials/
│   ├── Mat_Player_Blue
│   ├── Mat_Player_Green
│   ├── Mat_Player_Red
│   └── Mat_Player_Yellow
├── prefabs/
├── scenes/
│   └── Main.scene
└── scripts/
    ├── board/
    │   └── BoardManager.ts
    ├── core/
    │   ├── GameManager.ts
    │   └── TurnManager.ts
    ├── dice/
    │   └── DiceSystem.ts
    └── player/
        └── PlayerController.ts
```

## 4. 当前 Hierarchy 结构

```text
scene
├── Main Light
├── Main Camera
├── Board
│   ├── Tile_00
│   ├── Tile_01
│   ├── Tile_02
│   ├── Tile_03
│   ├── Tile_04
│   ├── Tile_05
│   └── Tile_06
├── Players
│   ├── Player_1
│   ├── Player_2
│   ├── Player_3
│   └── Player_4
├── Managers
│   ├── GameManager
│   ├── BoardManager
│   ├── DiceSystem
│   └── TurnManager
└── Canvas
    ├── Camera
    ├── RollDiceButton
    │   └── Label
    ├── DiceResultLabel
    └── TurnLabel
```

## 5. 棋盘灰盒

当前只有 7 个测试 Tile：

```text
Tile_00 ~ Tile_06
```

主要位置：

```text
Tile_00 = (0, 0, 0)
Tile_01 = (2.2, 0, 0)
Tile_02 = (4.4, 0, 0)
Tile_03 = (6.6, 0, 0)
Tile_04 = (6.6, 0, 2.2)
Tile_05 = (6.6, 0, 4.4)
Tile_06 = (6.6, 0, 6.6)
```

每个 Tile 大致：

```text
Scale = (2, 0.2, 2)
```

当前为 L 型灰盒测试棋盘。后续会扩展到正式约 32 格。

## 6. 四名玩家

四个玩家均使用 Capsule 占位，初始 `currentTileIndex = 0`。

```text
Player_1 → 红色 → Mat_Player_Red
Player_2 → 蓝色 → Mat_Player_Blue
Player_3 → 黄色 → Mat_Player_Yellow
Player_4 → 绿色 → Mat_Player_Green
```

每个玩家都有：

```text
PlayerController
Board Manager → Managers/BoardManager
Current Tile Index → 0
```

Scale 大约：

```text
(0.3, 0.5, 0.3)
```

## 7. BoardManager.ts

```ts
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
```

Inspector：

```text
Tiles Size = 7

Element 0 → Tile_00
Element 1 → Tile_01
Element 2 → Tile_02
Element 3 → Tile_03
Element 4 → Tile_04
Element 5 → Tile_05
Element 6 → Tile_06
```

## 8. DiceSystem.ts

```ts
import { _decorator, Component } from 'cc';

const { ccclass } = _decorator;

export interface DiceResult {
    die1: number;
    die2: number;
    total: number;
}

@ccclass('DiceSystem')
export class DiceSystem extends Component {

    public roll(): DiceResult {
        const die1 = Math.floor(Math.random() * 6) + 1;
        const die2 = Math.floor(Math.random() * 6) + 1;

        const total = die1 + die2;

        console.log(
            `[DiceSystem] Rolled ${die1} + ${die2} = ${total}`
        );

        return {
            die1,
            die2,
            total
        };
    }
}
```

已验证两颗 D6 正常，范围 1~6，total 范围 2~12。

## 9. PlayerController.ts

当前逻辑重点：

- 每名玩家维护 `currentTileIndex`
- 使用 BoardManager 获取目标格
- 支持棋盘循环
- 按一格一格 Tween 移动
- 每格约 0.25 秒
- 使用 `isMoving` 防止重复移动
- 移动完成支持 `onComplete`
- 使用世界坐标并转换为本地坐标

当前代码：

```ts
import { _decorator, Component, Vec3, tween } from 'cc';
import { BoardManager } from '../board/BoardManager';

const { ccclass, property } = _decorator;

@ccclass('PlayerController')
export class PlayerController extends Component {

    @property(BoardManager)
    boardManager: BoardManager | null = null;

    @property
    currentTileIndex: number = 0;

    private isMoving: boolean = false;

    start() {
        console.log(
            `[PlayerController] ${this.node.name} starts at tile ${this.currentTileIndex}`
        );
    }

    public moveBySteps(
        steps: number,
        onComplete?: () => void
    ) {
        if (!this.boardManager) {
            console.error('[PlayerController] BoardManager is not assigned.');
            return;
        }

        if (this.isMoving) {
            console.warn(
                `[PlayerController] ${this.node.name} is already moving.`
            );
            return;
        }

        const tileCount = this.boardManager.tiles.length;

        if (tileCount === 0) {
            console.error('[PlayerController] Board has no tiles.');
            return;
        }

        if (steps <= 0) {
            console.warn(
                `[PlayerController] Invalid step count: ${steps}`
            );
            return;
        }

        this.isMoving = true;

        let nextIndex = this.currentTileIndex;
        let movementTween = tween(this.node);

        for (let step = 0; step < steps; step++) {
            nextIndex = (nextIndex + 1) % tileCount;

            const stepIndex = nextIndex;
            const tile = this.boardManager.getTile(stepIndex);

            if (!tile) {
                console.error(
                    `[PlayerController] Tile ${stepIndex} does not exist.`
                );

                this.isMoving = false;
                return;
            }

            const worldTarget = new Vec3();
            tile.getWorldPosition(worldTarget);
            worldTarget.y += 0.6;

            const localTarget = new Vec3();

            if (this.node.parent) {
                this.node.parent.inverseTransformPoint(
                    localTarget,
                    worldTarget
                );
            } else {
                localTarget.set(worldTarget);
            }

            movementTween = movementTween
                .to(
                    0.25,
                    { position: localTarget },
                    { easing: 'quadInOut' }
                )
                .call(() => {
                    this.currentTileIndex = stepIndex;

                    console.log(
                        `[PlayerController] ${this.node.name} reached Tile_${stepIndex
                            .toString()
                            .padStart(2, '0')}`
                    );
                });
        }

        movementTween
            .call(() => {
                this.isMoving = false;

                console.log(
                    `[PlayerController] ${this.node.name} movement finished at tile ${this.currentTileIndex}`
                );

                if (onComplete) {
                    onComplete();
                }
            })
            .start();
    }
}
```

已验证逐格 Tween 与 `Tile_06 → Tile_00` 循环正常。

## 10. TurnManager.ts

```ts
import { _decorator, Component } from 'cc';
import { PlayerController } from '../player/PlayerController';

const { ccclass, property } = _decorator;

@ccclass('TurnManager')
export class TurnManager extends Component {

    @property([PlayerController])
    players: PlayerController[] = [];

    private currentPlayerIndex: number = 0;

    start() {
        if (this.players.length === 0) {
            console.error('[TurnManager] No players assigned.');
            return;
        }

        console.log(
            `[TurnManager] Game starts. Current player: ${this.getCurrentPlayer().node.name}`
        );
    }

    public getCurrentPlayer(): PlayerController {
        return this.players[this.currentPlayerIndex];
    }

    public getCurrentPlayerIndex(): number {
        return this.currentPlayerIndex;
    }

    public nextTurn(): void {
        if (this.players.length === 0) {
            return;
        }

        this.currentPlayerIndex =
            (this.currentPlayerIndex + 1) % this.players.length;

        console.log(
            `[TurnManager] Next turn: ${this.getCurrentPlayer().node.name}`
        );
    }
}
```

Inspector：

```text
Players Size = 4

Element 0 → Player_1
Element 1 → Player_2
Element 2 → Player_3
Element 3 → Player_4
```

已验证顺序：

```text
Player_1 → Player_2 → Player_3 → Player_4 → Player_1
```

## 11. GameManager.ts

当前职责：

- 接收 ROLL DICE 点击
- 调用 DiceSystem
- 从 TurnManager 获取当前玩家
- 更新 DiceResultLabel
- 禁用 Roll 按钮
- 命令当前玩家移动
- 移动完成后 nextTurn()
- 更新 TurnLabel
- 恢复 Roll 按钮

```ts
import {
    _decorator,
    Component,
    Button,
    Label
} from 'cc';

import {
    DiceSystem
} from '../dice/DiceSystem';

import {
    TurnManager
} from './TurnManager';

const { ccclass, property } = _decorator;

@ccclass('GameManager')
export class GameManager extends Component {

    @property(DiceSystem)
    diceSystem: DiceSystem | null = null;

    @property(TurnManager)
    turnManager: TurnManager | null = null;

    @property(Button)
    rollDiceButton: Button | null = null;

    @property(Label)
    diceResultLabel: Label | null = null;

    @property(Label)
    turnLabel: Label | null = null;

    start() {
        console.log('[GameManager] Monopoly3D started!');

        if (this.diceResultLabel) {
            this.diceResultLabel.string = 'READY';
        }

        this.updateTurnUI();
    }

    public rollDiceAndMove(): void {

        if (!this.diceSystem) {
            console.error(
                '[GameManager] DiceSystem is not assigned.'
            );
            return;
        }

        if (!this.turnManager) {
            console.error(
                '[GameManager] TurnManager is not assigned.'
            );
            return;
        }

        const currentPlayer =
            this.turnManager.getCurrentPlayer();

        if (!currentPlayer) {
            console.error(
                '[GameManager] Current player does not exist.'
            );
            return;
        }

        if (this.rollDiceButton) {
            this.rollDiceButton.interactable = false;
        }

        const result = this.diceSystem.roll();

        if (this.diceResultLabel) {
            this.diceResultLabel.string =
                `${result.die1} + ${result.die2} = ${result.total}`;
        }

        console.log(
            `[GameManager] ${currentPlayer.node.name} rolled ${result.total}`
        );

        currentPlayer.moveBySteps(
            result.total,
            () => {
                console.log(
                    `[GameManager] ${currentPlayer.node.name} movement completed.`
                );

                this.turnManager?.nextTurn();

                this.updateTurnUI();

                if (this.rollDiceButton) {
                    this.rollDiceButton.interactable = true;
                }
            }
        );
    }

    private updateTurnUI(): void {

        if (!this.turnManager) {
            return;
        }

        const index =
            this.turnManager.getCurrentPlayerIndex();

        if (this.turnLabel) {
            this.turnLabel.string =
                `PLAYER ${index + 1} TURN`;
        }

        if (this.diceResultLabel) {
            this.diceResultLabel.string = 'READY';
        }
    }
}
```

## 12. GameManager Inspector 当前绑定

```text
Dice System
→ Managers/DiceSystem

Turn Manager
→ Managers/TurnManager

Roll Dice Button
→ Canvas/RollDiceButton

Dice Result Label
→ Canvas/DiceResultLabel

Turn Label
→ Canvas/TurnLabel
```

## 13. UI 当前结构与功能

```text
Canvas
├── Camera
├── RollDiceButton
│   └── Label
├── DiceResultLabel
└── TurnLabel
```

重要：

```text
DiceResultLabel
TurnLabel
```

必须是 Canvas 的直接子节点，不要放进 RollDiceButton。

RollDiceButton：

```text
文字：ROLL DICE
```

Click Event：

```text
Target → Managers/GameManager
Component → GameManager
Handler → rollDiceAndMove
```

功能：

```text
移动开始 → interactable = false
移动结束 → interactable = true
```

DiceResultLabel：

```text
游戏开始：READY
掷骰子后：3 + 5 = 8
下一回合：READY
```

TurnLabel：

```text
PLAYER 1 TURN
PLAYER 2 TURN
PLAYER 3 TURN
PLAYER 4 TURN
```

## 14. 已实际验证的一整轮回合

实际测试：

```text
Player_1
Rolled 8
movement finished at Tile_01
→ Player_2

Player_2
Rolled 6
movement finished at Tile_06
→ Player_3

Player_3
Rolled 9
movement finished at Tile_02
→ Player_4

Player_4
Rolled 7
movement finished at Tile_00
→ Player_1
```

最终画面、`currentTileIndex` 与 TurnManager 状态一致。

# TurnManager 基础版验收通过。

## 15. 当前已经完成的 v0.1 功能

```text
✅ Cocos Creator 项目
✅ Main Scene
✅ 3D Camera
✅ Directional Light
✅ 灰盒 Board
✅ 7 个测试 Tile
✅ 4 名玩家
✅ 玩家颜色材质

✅ GameManager
✅ BoardManager
✅ DiceSystem
✅ PlayerController
✅ TurnManager

✅ 两颗 D6
✅ 随机骰子
✅ currentTileIndex
✅ 棋盘循环
✅ 逐格 Tween
✅ 移动结束 callback

✅ Roll Dice Button
✅ Dice Result UI
✅ Turn UI
✅ 移动期间禁用按钮
✅ 四人完整回合循环
```

## 16. 当前已知但暂时不处理的问题

### 同格玩家重叠
多个玩家停在同一 Tile 时会重叠。后续做 Same-Tile Player Offset System。

### 当前只有 7 个 Tile
这是测试棋盘，正式目标约 32 格。TileSystem / 数据层完成前不急着扩。

### UI 很粗糙
当前只是功能 UI，正式 UI 放到后期。

### 玩家还是 Capsule
正式角色属于后期。

### 暂时没有正式骰子模型
当前只有逻辑，后期再接 3D Dice / Animation / Sound。

## 17. 下一阶段：TileSystem + 数据层

新对话从这里继续。

建议先设计：

```ts
export enum TileType {
    START,
    PROPERTY,
    CHANCE,
    DESTINY,
    TAX,
    JAIL,
    SPECIAL
}
```

以及：

```ts
export interface TileData {
    id: number;
    name: string;
    type: TileType;

    price?: number;
    baseRent?: number;
    ownerId?: number | null;
}
```

示例：

```ts
{
    id: 1,
    name: 'Paris',
    type: TileType.PROPERTY,
    price: 1600,
    baseRent: 200,
    ownerId: null
}
```

推荐顺序：

```text
v0.1-K TileType + TileData
↓
v0.1-L TileSystem / Tile Resolver
↓
v0.1-M Player Economy Data
↓
v0.1-N EconomySystem
↓
v0.1-O Property Purchase
↓
v0.1-P Rent
↓
v0.1-Q START Reward
↓
v0.1-R Chance / Destiny
↓
v0.1-S Bankruptcy
↓
v0.1-T Victory Condition
```

## 18. 下一阶段第一个验收目标

第一小阶段不要马上做买地。

先做到：

```text
当前玩家
↓
掷骰子
↓
逐格移动
↓
停止在某个 Tile
↓
系统读取 Tile 数据
↓
Console：
Player_X landed on PROPERTY: Paris
```

也就是先完成：

# “落地格子类型识别”

## 19. 架构原则

- 不把 Paris / London / Shanghai 写死进 3D 模型脚本。
- Tile 逻辑与 3D 外观分离。
- EconomySystem 后续统一管理资金变化。
- 不要推翻已验证的 Dice / Movement / TurnManager。
- 继续使用当前稳定基线增量开发。

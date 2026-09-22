# Monopoly3D v0.1 — Property Purchase Interaction 完成交接存档

> 项目：微信小游戏 3D 大富翁  
> 引擎：Cocos Creator 3.8.8  
> 当前阶段：v0.1 Core Prototype  
> 本文用途：作为进入 **Rent System** 新对话的唯一真实基线。  
> 最新验收点：**Property Purchase Interaction 已完整完成并通过 BUY / SKIP / 已购地产回归测试。**

---

# 1. 当前总体状态

目前已经实际运行并验收通过：

```text
Core Movement / Turn Loop             ✅
DiceSystem                            ✅
PlayerController                      ✅
BoardManager                          ✅
TurnManager                           ✅

TileType / TileData / TileDatabase    ✅
TileSystem Landing Recognition        ✅

PlayerEconomyData                     ✅
EconomySystem Base                    ✅
getPlayerById()                       ✅
addMoney()                            ✅
removeMoney()                         ✅

PROPERTY Data Read                    ✅
Affordability Check                   ✅
TileSystem → EconomySystem            ✅

Property Purchase Decision            ✅
Turn Pause / Resume                    ✅
Property Purchase UI                  ✅
SKIP Path                             ✅
BUY Path                              ✅
Pending Property State                ✅
Purchased Property Regression         ✅
```

Property Purchase Interaction 已形成完整闭环：

```text
玩家移动完成
↓
TileSystem.resolveLanding(currentPlayer)
↓
普通格子 / 不需要购买决策
    → GameManager 正常 nextTurn()

无人 PROPERTY + 玩家买得起
    → TileSystem 保存 pendingProperty
    → resolveLanding() 返回 true
    → GameManager 暂停当前回合
    → Roll Dice 保持禁用
    → PropertyPurchaseUI 显示地产名 / 价格 / BUY / SKIP

SKIP
    → 不扣钱
    → ownerId 保持 null
    → 清空 pendingProperty
    → 隐藏购买 UI
    → nextTurn()
    → READY
    → Roll Dice 恢复

BUY
    → EconomySystem.removeMoney()
    → 设置 tileData.ownerId
    → 清空 pendingProperty
    → 隐藏购买 UI
    → nextTurn()
    → READY
    → Roll Dice 恢复
```

---

# 2. 已验证稳定、不要重写的系统

以下内容均已经实际运行验收通过，不要为了“更优雅”而重构：

- DiceSystem
- PlayerController 的移动与棋盘循环
- BoardManager
- TurnManager
- GameManager 原有骰子 / 移动流程
- TileType
- TileData
- TileDatabase
- TileSystem 的落地识别逻辑
- PlayerEconomyData
- EconomySystem 基础资金操作
- PropertyPurchaseUI 当前显示 / 隐藏机制
- Property Purchase 的暂停 / 恢复回合机制
- BUY / SKIP 当前流程

下一阶段只允许围绕 **Rent System** 做最小增量开发。

---

# 3. 当前测试棋盘

当前仍是 7 格灰盒棋盘：

```text
Tile_00 → Start
Tile_01 → Paris / PROPERTY
Tile_02 → Chance
Tile_03 → Destiny
Tile_04 → Tax
Tile_05 → Jail
Tile_06 → Special
```

当前用于测试的 Paris：

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

注意：

- `ownerId` 是运行时状态。
- 每次重新启动 Preview，TileDatabase 会重新初始化，因此 Paris 的 `ownerId` 会重新变回 `null`。
- 同一局内购买后，`ownerId` 会正确保留。

---

# 4. 当前玩家经济数据

```text
Player_1 → playerId 0 → money 15000
Player_2 → playerId 1 → money 15000
Player_3 → playerId 2 → money 15000
Player_4 → playerId 3 → money 15000
```

当前 `EconomySystem` 已稳定提供：

```ts
getPlayerById()
addMoney()
removeMoney()
```

资金变化必须继续统一走 EconomySystem。

不要在 TileSystem / GameManager 中直接：

```ts
player.money -= amount;
player.money += amount;
```

---

# 5. Property Purchase UI 当前结构

Hierarchy 当前包含：

```text
Canvas
├── Camera
├── RollDiceButton
│   └── Label
├── DiceResultLabel
├── TurnLabel
└── PropertyPurchasePanel
    ├── PropertyNameLabel
    ├── PriceLabel
    ├── BuyButton
    │   └── Label
    └── SkipButton
        └── Label
```

`PropertyPurchasePanel`：

```text
Position:
X = 260
Y = 120
Z = 0

UITransform:
Width  = 560
Height = 320

Anchor Point:
X = 0.5
Y = 0.5
```

注意：

- UI 位置调整使用 **Node → Position**
- Anchor Point 保持默认 `0.5 / 0.5`
- 不要把 Position 和 Anchor Point 混淆

---

# 6. PropertyPurchaseUI.ts 当前正式代码

路径：

```text
assets/scripts/ui/PropertyPurchaseUI.ts
```

```ts
import {
    _decorator,
    Component,
    Node,
    Label
} from 'cc';

const { ccclass, property } = _decorator;

@ccclass('PropertyPurchaseUI')
export class PropertyPurchaseUI extends Component {

    @property(Node)
    panel: Node | null = null;

    @property(Label)
    propertyNameLabel: Label | null = null;

    @property(Label)
    priceLabel: Label | null = null;

    protected start(): void {

        this.hide();

        console.log(
            '[PropertyPurchaseUI] Ready. Purchase panel hidden.'
        );
    }

    public show(
        propertyName: string,
        price: number
    ): void {

        if (this.propertyNameLabel) {
            this.propertyNameLabel.string =
                propertyName;
        }

        if (this.priceLabel) {
            this.priceLabel.string =
                `Price: ${price}`;
        }

        if (this.panel) {
            this.panel.active = true;
        }

        console.log(
            `[PropertyPurchaseUI] Showing purchase panel: ${propertyName}, price=${price}`
        );
    }

    public hide(): void {

        if (this.panel) {
            this.panel.active = false;
        }
    }
}
```

Inspector：

```text
PropertyPurchasePanel
└── PropertyPurchaseUI
    ├── Panel                → PropertyPurchasePanel
    ├── Property Name Label  → PropertyNameLabel
    └── Price Label          → PriceLabel
```

---

# 7. TileSystem.ts 当前正式版本

路径：

```text
assets/scripts/tile/TileSystem.ts
```

```ts
import { _decorator, Component } from 'cc';

import { PlayerController } from '../player/PlayerController';
import { PlayerEconomyData } from '../player/PlayerEconomyData';
import { EconomySystem } from '../economy/EconomySystem';

import { TILE_DATABASE } from './TileDatabase';
import { TileType } from './TileType';
import { TileData } from './TileData';

const { ccclass, property } = _decorator;

@ccclass('TileSystem')
export class TileSystem extends Component {

    @property(EconomySystem)
    economySystem: EconomySystem | null = null;

    private pendingProperty: TileData | null = null;

    public resolveLanding(
        player: PlayerController
    ): boolean {

        this.pendingProperty = null;

        const tileIndex =
            player.currentTileIndex;

        const tileData =
            TILE_DATABASE[tileIndex];

        if (!tileData) {

            console.error(
                `[TileSystem] No TileData found for tile index ${tileIndex}.`
            );

            return false;
        }

        console.log(
            `[TileSystem] ${player.node.name} landed on ${tileData.type}: ${tileData.name}`
        );

        if (tileData.type !== TileType.PROPERTY) {
            return false;
        }

        console.log(
            `[TileSystem] Property info: ${tileData.name}, price=${tileData.price}, ownerId=${tileData.ownerId}`
        );

        if (tileData.ownerId !== null) {

            console.log(
                `[TileSystem] ${tileData.name} is owned by playerId=${tileData.ownerId}.`
            );

            return false;
        }

        console.log(
            `[TileSystem] ${tileData.name} is available for purchase.`
        );

        if (tileData.price === undefined) {

            console.error(
                `[TileSystem] ${tileData.name} does not have a valid price.`
            );

            return false;
        }

        const playerEconomyData =
            player.getComponent(PlayerEconomyData);

        if (!playerEconomyData) {

            console.error(
                `[TileSystem] ${player.node.name} has no PlayerEconomyData component.`
            );

            return false;
        }

        if (!this.economySystem) {

            console.error(
                '[TileSystem] EconomySystem is not assigned.'
            );

            return false;
        }

        const registeredPlayer =
            this.economySystem.getPlayerById(
                playerEconomyData.playerId
            );

        if (!registeredPlayer) {
            return false;
        }

        console.log(
            `[TileSystem] Economy lookup: ${player.node.name} -> playerId=${registeredPlayer.playerId}, money=${registeredPlayer.money}`
        );

        console.log(
            `[TileSystem] Affordability check: ${player.node.name} money=${registeredPlayer.money}, ${tileData.name} price=${tileData.price}`
        );

        if (
            registeredPlayer.money >=
            tileData.price
        ) {

            console.log(
                `[TileSystem] ${player.node.name} can afford ${tileData.name}.`
            );

            this.pendingProperty =
                tileData;

            console.log(
                `[TileSystem] Property purchase decision required for ${player.node.name} on ${tileData.name}.`
            );

            console.log(
                `[TileSystem] Pending property stored: ${tileData.name}, price=${tileData.price}.`
            );

            return true;
        }

        console.log(
            `[TileSystem] ${player.node.name} cannot afford ${tileData.name}.`
        );

        return false;
    }

    public getPendingProperty(): TileData | null {

        return this.pendingProperty;
    }

    public clearPendingProperty(): void {

        this.pendingProperty = null;

        console.log(
            '[TileSystem] Pending property cleared.'
        );
    }

    public purchasePendingProperty(
        player: PlayerController
    ): boolean {

        const tileData =
            this.pendingProperty;

        if (!tileData) {

            console.error(
                '[TileSystem] Cannot purchase because no pending property exists.'
            );

            return false;
        }

        if (tileData.type !== TileType.PROPERTY) {

            console.error(
                `[TileSystem] Cannot purchase ${tileData.name} because it is not a PROPERTY tile.`
            );

            return false;
        }

        if (tileData.ownerId !== null) {

            console.error(
                `[TileSystem] Cannot purchase ${tileData.name} because it is already owned by playerId=${tileData.ownerId}.`
            );

            return false;
        }

        if (tileData.price === undefined) {

            console.error(
                `[TileSystem] Cannot purchase ${tileData.name} because it has no valid price.`
            );

            return false;
        }

        const playerEconomyData =
            player.getComponent(PlayerEconomyData);

        if (!playerEconomyData) {

            console.error(
                `[TileSystem] ${player.node.name} has no PlayerEconomyData component.`
            );

            return false;
        }

        if (!this.economySystem) {

            console.error(
                '[TileSystem] EconomySystem is not assigned.'
            );

            return false;
        }

        const registeredPlayer =
            this.economySystem.getPlayerById(
                playerEconomyData.playerId
            );

        if (!registeredPlayer) {
            return false;
        }

        if (
            registeredPlayer.money <
            tileData.price
        ) {

            console.error(
                `[TileSystem] ${player.node.name} no longer has enough money to purchase ${tileData.name}.`
            );

            return false;
        }

        const propertyName =
            tileData.name;

        const purchasePrice =
            tileData.price;

        const buyerPlayerId =
            registeredPlayer.playerId;

        this.economySystem.removeMoney(
            buyerPlayerId,
            purchasePrice
        );

        tileData.ownerId =
            buyerPlayerId;

        console.log(
            `[TileSystem] PURCHASED: ${player.node.name} bought ${propertyName} for ${purchasePrice}.`
        );

        console.log(
            `[TileSystem] Purchase result: ${propertyName} ownerId=${tileData.ownerId}, ${player.node.name} money=${registeredPlayer.money}.`
        );

        this.clearPendingProperty();

        return true;
    }
}
```

---

# 8. GameManager.ts 当前正式版本

路径：

```text
assets/scripts/core/GameManager.ts
```

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

import {
    TileSystem
} from '../tile/TileSystem';

import {
    PropertyPurchaseUI
} from '../ui/PropertyPurchaseUI';

const { ccclass, property } = _decorator;

@ccclass('GameManager')
export class GameManager extends Component {

    @property(DiceSystem)
    diceSystem: DiceSystem | null = null;

    @property(TurnManager)
    turnManager: TurnManager | null = null;

    @property(TileSystem)
    tileSystem: TileSystem | null = null;

    @property(PropertyPurchaseUI)
    propertyPurchaseUI: PropertyPurchaseUI | null = null;

    @property(Button)
    rollDiceButton: Button | null = null;

    @property(Label)
    diceResultLabel: Label | null = null;

    @property(Label)
    turnLabel: Label | null = null;

    start(): void {

        console.log(
            '[GameManager] Monopoly3D started!'
        );

        if (this.diceResultLabel) {
            this.diceResultLabel.string =
                'READY';
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

            this.rollDiceButton.interactable =
                false;
        }

        const result =
            this.diceSystem.roll();

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

                let needsPropertyDecision =
                    false;

                if (this.tileSystem) {

                    needsPropertyDecision =
                        this.tileSystem.resolveLanding(
                            currentPlayer
                        );

                } else {

                    console.error(
                        '[GameManager] TileSystem is not assigned.'
                    );
                }

                if (needsPropertyDecision) {

                    console.log(
                        `[GameManager] Turn paused. Waiting for property purchase decision from ${currentPlayer.node.name}.`
                    );

                    const pendingProperty =
                        this.tileSystem
                            ?.getPendingProperty();

                    if (!pendingProperty) {

                        console.error(
                            '[GameManager] Property decision required, but no pending property was found.'
                        );

                        return;
                    }

                    if (
                        pendingProperty.price ===
                        undefined
                    ) {

                        console.error(
                            `[GameManager] Pending property ${pendingProperty.name} has no valid price.`
                        );

                        return;
                    }

                    if (!this.propertyPurchaseUI) {

                        console.error(
                            '[GameManager] PropertyPurchaseUI is not assigned.'
                        );

                        return;
                    }

                    this.propertyPurchaseUI.show(
                        pendingProperty.name,
                        pendingProperty.price
                    );

                    console.log(
                        `[GameManager] Property purchase UI opened for ${pendingProperty.name}.`
                    );

                    return;
                }

                this.turnManager.nextTurn();

                this.updateTurnUI();

                if (this.rollDiceButton) {

                    this.rollDiceButton.interactable =
                        true;
                }
            }
        );
    }

    public onSkipPropertyPurchase(): void {

        if (!this.turnManager) {

            console.error(
                '[GameManager] Cannot skip purchase because TurnManager is not assigned.'
            );

            return;
        }

        const currentPlayer =
            this.turnManager.getCurrentPlayer();

        if (!currentPlayer) {

            console.error(
                '[GameManager] Cannot skip purchase because current player does not exist.'
            );

            return;
        }

        const pendingProperty =
            this.tileSystem
                ?.getPendingProperty();

        if (!pendingProperty) {

            console.error(
                '[GameManager] Cannot skip purchase because no pending property exists.'
            );

            return;
        }

        console.log(
            `[GameManager] ${currentPlayer.node.name} skipped purchasing ${pendingProperty.name}.`
        );

        if (this.propertyPurchaseUI) {

            this.propertyPurchaseUI.hide();
        }

        this.tileSystem
            ?.clearPendingProperty();

        this.turnManager.nextTurn();

        this.updateTurnUI();

        if (this.rollDiceButton) {

            this.rollDiceButton.interactable =
                true;
        }

        console.log(
            '[GameManager] Property purchase skip completed. Turn resumed.'
        );
    }

    public onBuyProperty(): void {

        if (!this.turnManager) {

            console.error(
                '[GameManager] Cannot buy property because TurnManager is not assigned.'
            );

            return;
        }

        if (!this.tileSystem) {

            console.error(
                '[GameManager] Cannot buy property because TileSystem is not assigned.'
            );

            return;
        }

        const currentPlayer =
            this.turnManager.getCurrentPlayer();

        if (!currentPlayer) {

            console.error(
                '[GameManager] Cannot buy property because current player does not exist.'
            );

            return;
        }

        const purchaseSucceeded =
            this.tileSystem.purchasePendingProperty(
                currentPlayer
            );

        if (!purchaseSucceeded) {

            console.error(
                `[GameManager] Property purchase failed for ${currentPlayer.node.name}.`
            );

            return;
        }

        if (this.propertyPurchaseUI) {

            this.propertyPurchaseUI.hide();
        }

        this.turnManager.nextTurn();

        this.updateTurnUI();

        if (this.rollDiceButton) {

            this.rollDiceButton.interactable =
                true;
        }

        console.log(
            `[GameManager] Property purchase completed for ${currentPlayer.node.name}. Turn resumed.`
        );
    }

    private updateTurnUI(): void {

        if (!this.turnManager) {
            return;
        }

        const index =
            this.turnManager
                .getCurrentPlayerIndex();

        if (this.turnLabel) {

            this.turnLabel.string =
                `PLAYER ${index + 1} TURN`;
        }

        if (this.diceResultLabel) {

            this.diceResultLabel.string =
                'READY';
        }
    }
}
```

---

# 9. Button Click Events 当前正式配置

## SKIP

```text
Canvas/PropertyPurchasePanel/SkipButton
Button → Click Events = 1

Target:
Managers/GameManager

Component:
GameManager

Handler:
onSkipPropertyPurchase
```

## BUY

```text
Canvas/PropertyPurchasePanel/BuyButton
Button → Click Events = 1

Target:
Managers/GameManager

Component:
GameManager

Handler:
onBuyProperty
```

---

# 10. 已实际验收的 SKIP 路径

示例：

```text
Player_2
↓
落到无人 Paris
↓
Property Purchase UI 显示
↓
点击 SKIP
```

Console 已验证：

```text
[GameManager] Player_2 skipped purchasing Paris.
[TileSystem] Pending property cleared.
[TurnManager] Next turn: Player_3
[GameManager] Property purchase skip completed. Turn resumed.
```

游戏画面已验证：

```text
PLAYER 2 TURN
↓ SKIP
PLAYER 3 TURN
READY
ROLL DICE 可用
```

并确认：

```text
✅ 无 removeMoney
✅ 无 PURCHASED
✅ ownerId 保持 null
```

---

# 11. 已实际验收的 BUY 路径

实际验收案例：

```text
Player_4
playerId = 3
money = 15000

Paris
price = 1600
ownerId = null
```

点击 BUY 后 Console：

```text
[EconomySystem] removeMoney: Player_4 15000 - 1600 = 13400

[TileSystem] PURCHASED: Player_4 bought Paris for 1600.

[TileSystem] Purchase result:
Paris ownerId=3,
Player_4 money=13400.

[TileSystem] Pending property cleared.

[TurnManager] Next turn: Player_1

[GameManager] Property purchase completed for Player_4. Turn resumed.
```

已经确认：

```text
✅ money 15000 → 13400
✅ ownerId null → 3
✅ UI 隐藏
✅ nextTurn()
✅ READY
✅ Roll Dice 恢复
```

---

# 12. 已购地产回归测试

同一局中：

```text
Paris ownerId = 3
```

随后 Player_1 落到 Paris。

实际 Console：

```text
[TileSystem] Player_1 landed on PROPERTY: Paris
[TileSystem] Property info: Paris, price=1600, ownerId=3
[TileSystem] Paris is owned by playerId=3.
[TurnManager] Next turn: Player_2
```

已经确认：

```text
✅ 正确识别 ownerId=3
✅ 不再次显示 BUY / SKIP
✅ 不创建 pendingProperty
✅ 不再次扣购买款
✅ 直接 nextTurn()
```

当前此路径 **尚未收租**，这是下一阶段要实现的 Rent System。

---

# 13. 浏览器 Console 非项目报错

测试过程中曾出现：

```text
Uncaught (in promise) Error:
A listener indicated an asynchronous response by returning true,
but the message channel closed before a response was received
```

该报错指向：

```text
(index):1
```

而不是项目 TypeScript 文件。

同时 SKIP / BUY 游戏流程继续正确执行。

因此当前判断为浏览器扩展 / 浏览器预览消息通道相关噪声，不属于已发现的 Monopoly3D 游戏逻辑错误。

进入 Rent System 时不要为了该信息重构当前稳定代码。

---

# 14. 当前尚未实现

```text
❌ Rent System
❌ Owner 落在自己地产时的明确分支日志（可在 Rent 阶段处理）
❌ START Reward
❌ TAX 扣款
❌ Chance
❌ Destiny
❌ Jail
❌ Bankruptcy
❌ Victory Condition
❌ Save / Load
❌ 正式视觉 / 地产模型 / 完整棋盘
```

---

# 15. 下一阶段：Rent System

下一阶段核心目标：

```text
玩家 A 已购买 Paris
ownerId = A.playerId

玩家 B 落到 Paris
↓
TileSystem 识别 PROPERTY
↓
发现 ownerId !== null
↓
如果 ownerId === 当前玩家 playerId
    → 自己的地产
    → 不收租
    → 正常 nextTurn()

如果 ownerId !== 当前玩家 playerId
    → 读取 baseRent
    → 找到 Owner
    → 当前玩家支付 rent
    → Owner 收到 rent
    → Console 验证
    → 正常 nextTurn()
```

当前 Paris：

```text
baseRent = 200
```

最简单验收案例可使用：

```text
Player_4 owns Paris
Player_1 lands on Paris

Player_1:
15000 → 14800

Player_4:
13400 → 13600
```

但实际测试时以当局真实余额为准。

---

# 16. Rent System 第一阶段建议

不要一上来做复杂 Rent UI。

继续小步：

```text
Step 1
TileSystem 在已购 PROPERTY 上区分：
- 自己的地产
- 别人的地产

只 Console 验证
暂不扣钱

Step 2
TileSystem / EconomySystem 完成实际 rent transfer：
payer - baseRent
owner + baseRent

Console 验证

Step 3
回归测试：
- Owner 落自己地产 → 不扣钱
- Other Player 落别人地产 → 正确转账
- 购买 UI 不出现

Step 4
如需要，再增加简单 Rent 提示 UI
```

---

# 17. Rent System 架构原则

必须继续遵守：

- 不重写 DiceSystem
- 不重写 PlayerController
- 不重写 BoardManager
- 不重写 TurnManager
- 不破坏 Property Purchase Interaction
- 不把 Paris 写死进逻辑
- 使用 `TileData.baseRent`
- 使用 `TileData.ownerId`
- 资金变化继续统一走 EconomySystem
- 不直接修改 `money`
- 不提前做 Bankruptcy
- 不提前做 START / TAX / Chance / Destiny
- 每次只做一个可运行验收的小阶段
- 用户是 Cocos Creator 完全新手
- TypeScript 修改优先提供“完整文件替换版”，避免让用户手动寻找多个局部代码段

---

# 18. 当前对话切换点

Property Purchase Interaction 已完整完成：

```text
Decision Detection        ✅
Turn Pause                ✅
UI Show / Hide            ✅
SKIP                       ✅
BUY                        ✅
Money Deduction            ✅
ownerId Assignment         ✅
Pending State Cleanup      ✅
Purchased Property Check   ✅
Regression Test            ✅
```

现在进入新的核心流程：

```text
Rent System
```

因此此处是正确的新对话切换点。


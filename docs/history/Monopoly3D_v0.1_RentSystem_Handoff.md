# Monopoly3D v0.1 — Rent System 完成交接存档

> 项目：微信小游戏 3D 大富翁  
> 引擎：Cocos Creator 3.8.8  
> 当前阶段：v0.1 Core Prototype  
> 本文用途：作为进入 **START Reward / TAX** 新对话的唯一真实基线。  
> 最新验收点：**Property Purchase + Rent System 已完整完成并通过回归测试。**

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

Rent System Owner Detection           ✅
Own Property No-Rent Branch           ✅
Other Player Rent Branch              ✅
baseRent Read                         ✅
Rent Payer Deduction                  ✅
Rent Owner Income                     ✅
Rent Transfer Regression              ✅
```

---

# 2. 当前测试棋盘

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

说明：

- `ownerId` 是运行时状态。
- 每次重新启动 Preview，TileDatabase 会重新初始化，因此 Paris 的 `ownerId` 会重新变回 `null`。
- 同一局内购买后，`ownerId` 会正确保留。
- Rent System 使用 `TileData.baseRent`，没有把 Paris 或 200 写死进系统逻辑。

---

# 3. 当前玩家经济数据

```text
Player_1 → playerId 0 → money 15000
Player_2 → playerId 1 → money 15000
Player_3 → playerId 2 → money 15000
Player_4 → playerId 3 → money 15000
```

`EconomySystem` 当前已稳定提供：

```ts
getPlayerById()
addMoney()
removeMoney()
```

资金变化必须继续统一走 `EconomySystem`。

禁止在 `TileSystem` / `GameManager` 中直接：

```ts
player.money -= amount;
player.money += amount;
```

---

# 4. Property Purchase 当前稳定流程

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
    → Roll Dice 禁用
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

# 5. Rent System 当前稳定流程

当前已购 PROPERTY 的完整落地逻辑：

```text
玩家落到 PROPERTY
↓
ownerId === null
    → 进入原 Property Purchase 流程

ownerId !== null
↓
读取当前玩家的 PlayerEconomyData.playerId
↓
ownerId === 当前 playerId
    → 自己的地产
    → 不收租
    → 正常 nextTurn()

ownerId !== 当前 playerId
    → 读取 TileData.baseRent
    → EconomySystem.getPlayerById() 找 payer
    → EconomySystem.getPlayerById() 找 owner
    → payer 通过 EconomySystem.removeMoney() 支付 rent
    → owner 通过 EconomySystem.addMoney() 收到 rent
    → Console 输出双方资金变化
    → 正常 nextTurn()
```

目前 **没有 Rent UI**，所有 Rent 验证通过 Console 完成。

---

# 6. Rent System 已实际验收

## 6.1 Owner 落自己地产

实际验收案例：

```text
Paris ownerId = 0
Player_1 playerId = 0
```

Console：

```text
[TileSystem] Player_1 landed on PROPERTY: Paris
[TileSystem] Property info: Paris, price=1600, ownerId=0
[TileSystem] Paris is owned by playerId=0.
[RentSystem] Player_1 landed on their own property Paris. No rent required.
[TurnManager] Next turn: Player_2
```

确认：

```text
✅ 不显示 BUY / SKIP
✅ 不 removeMoney
✅ 不 addMoney
✅ Owner 余额不变
✅ 正常 nextTurn()
```

---

## 6.2 Other Player 落别人地产

实际验收案例之一：

```text
Paris ownerId = 0

Player_4 money:
15000 → 14800

Player_1 money:
13400 → 13600
```

Console：

```text
[TileSystem] Player_4 landed on PROPERTY: Paris
[TileSystem] Property info: Paris, price=1600, ownerId=0
[TileSystem] Paris is owned by playerId=0.
[RentSystem] Player_4 landed on Paris, which belongs to playerId=0.

[EconomySystem] removeMoney: Player_4 15000 - 200 = 14800
[EconomySystem] addMoney: Player_1 13400 + 200 = 13600

[RentSystem] RENT PAID: Player_4 paid 200 rent for Paris to playerId=0.
[RentSystem] Payer money: 15000 -> 14800
[RentSystem] Owner money: 13400 -> 13600

[TurnManager] Next turn: Player_1
```

之后还连续验证过：

```text
Player_4:
14800 → 14600
Owner:
13600 → 13800

Player_2:
15000 → 14800
Owner:
13800 → 14000

Player_3:
15000 → 14800
Owner:
14000 → 14200
```

因此已确认：

```text
✅ Rent 重复触发稳定
✅ payer 每次正确 -200
✅ owner 每次正确 +200
✅ 总资金守恒
✅ 不触发购买 UI
✅ 正常 nextTurn()
```

---

# 7. TileSystem.ts 当前正式版本

路径：

```text
assets/scripts/tile/TileSystem.ts
```

当前正式代码：

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

        const playerEconomyData =
            player.getComponent(PlayerEconomyData);

        if (!playerEconomyData) {

            console.error(
                `[TileSystem] ${player.node.name} has no PlayerEconomyData component.`
            );

            return false;
        }

        if (tileData.ownerId !== null) {

            console.log(
                `[TileSystem] ${tileData.name} is owned by playerId=${tileData.ownerId}.`
            );

            if (
                tileData.ownerId ===
                playerEconomyData.playerId
            ) {

                console.log(
                    `[RentSystem] ${player.node.name} landed on their own property ${tileData.name}. No rent required.`
                );

                return false;
            }

            console.log(
                `[RentSystem] ${player.node.name} landed on ${tileData.name}, which belongs to playerId=${tileData.ownerId}.`
            );

            if (tileData.baseRent === undefined) {

                console.error(
                    `[RentSystem] ${tileData.name} does not have a valid baseRent.`
                );

                return false;
            }

            if (!this.economySystem) {

                console.error(
                    '[RentSystem] EconomySystem is not assigned.'
                );

                return false;
            }

            const payer =
                this.economySystem.getPlayerById(
                    playerEconomyData.playerId
                );

            if (!payer) {

                console.error(
                    `[RentSystem] Could not find payer playerId=${playerEconomyData.playerId}.`
                );

                return false;
            }

            const owner =
                this.economySystem.getPlayerById(
                    tileData.ownerId
                );

            if (!owner) {

                console.error(
                    `[RentSystem] Could not find property owner playerId=${tileData.ownerId}.`
                );

                return false;
            }

            const rent =
                tileData.baseRent;

            const payerMoneyBefore =
                payer.money;

            const ownerMoneyBefore =
                owner.money;

            this.economySystem.removeMoney(
                payer.playerId,
                rent
            );

            this.economySystem.addMoney(
                owner.playerId,
                rent
            );

            console.log(
                `[RentSystem] RENT PAID: ${player.node.name} paid ${rent} rent for ${tileData.name} to playerId=${owner.playerId}.`
            );

            console.log(
                `[RentSystem] Payer money: ${payerMoneyBefore} -> ${payer.money}`
            );

            console.log(
                `[RentSystem] Owner money: ${ownerMoneyBefore} -> ${owner.money}`
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

# 8. GameManager 当前关键行为

`GameManager` 当前已经稳定实现：

```text
rollDiceAndMove()
→ 禁用 Roll Dice
→ DiceSystem.roll()
→ PlayerController.moveBySteps()
→ 移动完成后调用 TileSystem.resolveLanding(currentPlayer)

如果 resolveLanding() 返回 true：
→ 暂停回合
→ 显示 PropertyPurchaseUI
→ 等待 BUY / SKIP

如果返回 false：
→ TurnManager.nextTurn()
→ updateTurnUI()
→ Roll Dice 恢复
```

Property Purchase 两个按钮仍然由：

```text
onSkipPropertyPurchase()
onBuyProperty()
```

处理。

**不要为了 START/TAX 重写这套稳定流程。**

---

# 9. PropertyPurchaseUI 当前结构

Hierarchy：

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

# 10. 已验证稳定、不要重写的系统

以下内容已经实际运行验收通过：

- DiceSystem
- PlayerController 的移动与棋盘循环
- BoardManager
- TurnManager
- GameManager 原有骰子 / 移动 / Property Purchase 流程
- TileType
- TileData
- TileDatabase
- TileSystem 当前 PROPERTY / Rent 逻辑
- PlayerEconomyData
- EconomySystem 基础资金操作
- PropertyPurchaseUI
- Property Purchase 的暂停 / 恢复回合机制
- BUY / SKIP
- Rent System

下一阶段只允许围绕 **START Reward / TAX** 做最小增量开发。

---

# 11. 当前尚未实现

```text
❌ START Reward
❌ TAX 扣款
❌ Chance
❌ Destiny
❌ Jail
❌ Bankruptcy
❌ Victory Condition
❌ Save / Load
❌ Rent UI
❌ 正式视觉 / 地产模型 / 完整棋盘
```

---

# 12. 下一阶段建议顺序

下一阶段进入：

```text
START Reward
↓
TAX
```

不要同时实现。

---

# 13. START Reward 推荐第一阶段

首先只做：

```text
Step 1
识别玩家是否“经过 START”
↓
Console 输出
↓
暂时不加钱
```

通过后再做：

```text
Step 2
经过 START
↓
EconomySystem.addMoney()
↓
Console 验证
```

需要特别先确认规则：

```text
“经过 START”是否获得奖励
“刚好停在 START”是否也获得奖励
初始开局是否奖励
```

不要在规则未确认前擅自写死。

---

# 14. TAX 推荐阶段

START Reward 完成后再实现 TAX。

建议继续拆小：

```text
Step 1
玩家落到 TileType.TAX
↓
Console 正确识别
↓
暂不扣钱

Step 2
读取 Tax 金额
↓
EconomySystem.removeMoney()
↓
Console 验证

Step 3
回归测试
↓
不影响 PROPERTY / Rent / START
```

不要提前实现 Bankruptcy。

---

# 15. 架构原则

必须继续遵守：

- 不重写 DiceSystem
- 不重写 PlayerController
- 不重写 BoardManager
- 不重写 TurnManager
- 不破坏 Property Purchase Interaction
- 不破坏 Rent System
- 不把 Paris 写死进逻辑
- 不直接修改 `money`
- 所有资金变化继续统一走 EconomySystem
- 不提前做 Chance / Destiny / Jail / Bankruptcy
- 每次只做一个可运行验收的小阶段
- 用户是 Cocos Creator 完全新手
- TypeScript 修改优先提供“完整文件可复制替换版”
- 每一步都明确告诉用户：
  - Cocos Creator 里点哪里
  - 修改哪个 TypeScript
  - Inspector 是否需要设置
  - 正确结果应该看到什么
- 用户发送截图后，先检查截图，再进入下一步
- 当 START + TAX 完整稳定完成、下一阶段要进入 Chance / Destiny 时，主动提醒制作新的 handoff 并切换新对话，不要等用户主动询问

---

# 16. 当前正确切换点

当前已经完成：

```text
Property Purchase                 ✅
Rent System                       ✅
Rent Regression                   ✅
```

现在进入新的核心流程：

```text
START Reward
↓
TAX
```

因此此处是正确的新对话切换点。

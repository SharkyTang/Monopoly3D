# Monopoly3D v0.1 — Economy + Property 阶段交接存档

> 项目：微信小游戏 3D 大富翁  
> 引擎：Cocos Creator 3.8.8  
> 当前阶段：v0.1 Core Prototype  
> 本文用途：作为新对话继续开发的**唯一真实基线**。  
> 当前最新验收点：**Player Economy Data + EconomySystem 基础层 + Property affordability 已完成并通过运行验证；自动购买测试已验证后清理。**

---

# 1. 当前项目总体状态

当前已经完成一个可运行的四人回合制灰盒原型，并在原有稳定系统上继续完成：

```text
DiceSystem / Player movement / Turn loop
            ✅
Tile 数据层 + TileSystem
            ✅
PlayerEconomyData
            ✅
EconomySystem 基础层
            ✅
PROPERTY 数据读取
            ✅
PROPERTY affordability 判断
            ✅
TileSystem → EconomySystem 连接
            ✅
Property purchase 底层交易测试
            ✅ 已验证
            ↓
临时自动购买测试代码
            ✅ 已清理
```

当前正式版本不会自动购买地产。

---

# 2. 当前稳定主流程

当前正式运行流程：

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
PlayerController 更新 currentTileIndex
↓
移动完成
↓
GameManager 调用 TileSystem.resolveLanding(currentPlayer)
↓
TileSystem 根据 currentTileIndex 读取 TileDatabase
↓
若为 PROPERTY：
    读取 price / ownerId
    若 ownerId === null：
        通过 EconomySystem 找到当前玩家经济数据
        判断 money 是否足够
↓
GameManager 当前仍然立即执行 TurnManager.nextTurn()
↓
UI 更新为下一玩家
```

**重要：当前还没有“等待 BUY / SKIP 决策”的暂停回合机制。**

---

# 3. 已验证稳定、不要重写的系统

以下系统已经多轮实际运行验收通过：

```text
DiceSystem
PlayerController
BoardManager
TurnManager
GameManager 原有骰子 / 移动 / 回合流程
TileSystem 的落地识别基础流程
PlayerEconomyData
EconomySystem 基础层
```

不要为了“更优雅”而重构这些已经跑通的部分。

---

# 4. 当前 Assets 目录结构

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
    ├── economy/
    │   └── EconomySystem.ts
    ├── player/
    │   ├── PlayerController.ts
    │   └── PlayerEconomyData.ts
    └── tile/
        ├── TileData.ts
        ├── TileDatabase.ts
        ├── TileSystem.ts
        └── TileType.ts
```

---

# 5. 当前 Hierarchy

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
│   ├── TurnManager
│   ├── TileSystem
│   └── EconomySystem
└── Canvas
    ├── Camera
    ├── RollDiceButton
    │   └── Label
    ├── DiceResultLabel
    └── TurnLabel
```

---

# 6. PlayerEconomyData.ts

路径：

```text
assets/scripts/player/PlayerEconomyData.ts
```

当前正式代码：

```ts
import { _decorator, Component } from 'cc';

const { ccclass, property } = _decorator;

@ccclass('PlayerEconomyData')
export class PlayerEconomyData extends Component {

    @property({
        tooltip: 'Unique ID for this player.'
    })
    playerId: number = 0;

    @property({
        tooltip: 'Current money owned by this player.'
    })
    money: number = 15000;

    protected start(): void {
        console.log(
            `[PlayerEconomyData] ${this.node.name} -> playerId = ${this.playerId}, money = ${this.money}`
        );
    }
}
```

当前 Inspector 配置：

```text
Player_1 → playerId = 0 → money = 15000
Player_2 → playerId = 1 → money = 15000
Player_3 → playerId = 2 → money = 15000
Player_4 → playerId = 3 → money = 15000
```

已实际通过 Console 验证。

---

# 7. EconomySystem.ts

路径：

```text
assets/scripts/economy/EconomySystem.ts
```

当前正式代码：

```ts
import { _decorator, Component } from 'cc';
import { PlayerEconomyData } from '../player/PlayerEconomyData';

const { ccclass, property } = _decorator;

@ccclass('EconomySystem')
export class EconomySystem extends Component {

    @property([PlayerEconomyData])
    players: PlayerEconomyData[] = [];

    protected start(): void {

        console.log(
            `[EconomySystem] Ready. Registered players: ${this.players.length}`
        );

        for (let playerId = 0; playerId < this.players.length; playerId++) {

            const player = this.getPlayerById(playerId);

            if (!player) {
                continue;
            }

            console.log(
                `[EconomySystem] Lookup playerId=${playerId} -> ${player.node.name}, money=${player.money}`
            );
        }
    }

    public getPlayerById(
        playerId: number
    ): PlayerEconomyData | null {

        const player = this.players.find(
            (playerData) =>
                playerData !== null &&
                playerData.playerId === playerId
        );

        if (!player) {

            console.error(
                `[EconomySystem] No player found with playerId=${playerId}.`
            );

            return null;
        }

        return player;
    }

    public addMoney(
        playerId: number,
        amount: number
    ): void {

        if (amount <= 0) {

            console.error(
                `[EconomySystem] addMoney amount must be greater than 0. Received: ${amount}`
            );

            return;
        }

        const player = this.getPlayerById(playerId);

        if (!player) {
            return;
        }

        const moneyBefore = player.money;

        player.money += amount;

        console.log(
            `[EconomySystem] addMoney: ${player.node.name} ${moneyBefore} + ${amount} = ${player.money}`
        );
    }

    public removeMoney(
        playerId: number,
        amount: number
    ): void {

        if (amount <= 0) {

            console.error(
                `[EconomySystem] removeMoney amount must be greater than 0. Received: ${amount}`
            );

            return;
        }

        const player = this.getPlayerById(playerId);

        if (!player) {
            return;
        }

        const moneyBefore = player.money;

        player.money -= amount;

        console.log(
            `[EconomySystem] removeMoney: ${player.node.name} ${moneyBefore} - ${amount} = ${player.money}`
        );
    }
}
```

当前已经验证：

```text
getPlayerById() ✅
addMoney()      ✅
removeMoney()   ✅
```

临时 `Run Add Money Test` / `Run Remove Money Test` 已经删除。

---

# 8. EconomySystem Inspector 当前绑定

节点：

```text
Managers/EconomySystem
```

当前：

```text
EconomySystem
├── Script
│   └── EconomySystem.ts
└── Players = 4
    ├── [0] Player_1
    ├── [1] Player_2
    ├── [2] Player_3
    └── [3] Player_4
```

不要改变顺序：

```text
[0] → Player_1 → playerId 0
[1] → Player_2 → playerId 1
[2] → Player_3 → playerId 2
[3] → Player_4 → playerId 3
```

---

# 9. Tile 数据层当前关键状态

## TileType.ts

```ts
export enum TileType {
    START = 'START',
    PROPERTY = 'PROPERTY',
    CHANCE = 'CHANCE',
    DESTINY = 'DESTINY',
    TAX = 'TAX',
    JAIL = 'JAIL',
    SPECIAL = 'SPECIAL'
}
```

## TileData.ts

```ts
import { TileType } from './TileType';

export interface TileData {
    id: number;
    name: string;
    type: TileType;

    price?: number;
    baseRent?: number;
    ownerId?: number | null;
}
```

## 当前测试地产 Paris

`TileDatabase.ts` 中：

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

当前测试棋盘仍是 7 格：

```text
Tile_00 → Start
Tile_01 → Paris / PROPERTY
Tile_02 → Chance
Tile_03 → Destiny
Tile_04 → Tax
Tile_05 → Jail
Tile_06 → Special
```

---

# 10. TileSystem.ts 当前正式版本

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

const { ccclass, property } = _decorator;

@ccclass('TileSystem')
export class TileSystem extends Component {

    @property(EconomySystem)
    economySystem: EconomySystem | null = null;

    public resolveLanding(player: PlayerController): void {

        const tileIndex = player.currentTileIndex;

        const tileData = TILE_DATABASE[tileIndex];

        if (!tileData) {
            console.error(
                `[TileSystem] No TileData found for tile index ${tileIndex}.`
            );

            return;
        }

        console.log(
            `[TileSystem] ${player.node.name} landed on ${tileData.type}: ${tileData.name}`
        );

        if (tileData.type !== TileType.PROPERTY) {
            return;
        }

        console.log(
            `[TileSystem] Property info: ${tileData.name}, price=${tileData.price}, ownerId=${tileData.ownerId}`
        );

        if (tileData.ownerId !== null) {
            console.log(
                `[TileSystem] ${tileData.name} is owned by playerId=${tileData.ownerId}.`
            );

            return;
        }

        console.log(
            `[TileSystem] ${tileData.name} is available for purchase.`
        );

        if (tileData.price === undefined) {
            console.error(
                `[TileSystem] ${tileData.name} does not have a valid price.`
            );

            return;
        }

        const playerEconomyData =
            player.getComponent(PlayerEconomyData);

        if (!playerEconomyData) {
            console.error(
                `[TileSystem] ${player.node.name} has no PlayerEconomyData component.`
            );

            return;
        }

        if (!this.economySystem) {
            console.error(
                '[TileSystem] EconomySystem is not assigned.'
            );

            return;
        }

        const registeredPlayer =
            this.economySystem.getPlayerById(
                playerEconomyData.playerId
            );

        if (!registeredPlayer) {
            return;
        }

        console.log(
            `[TileSystem] Economy lookup: ${player.node.name} -> playerId=${registeredPlayer.playerId}, money=${registeredPlayer.money}`
        );

        console.log(
            `[TileSystem] Affordability check: ${player.node.name} money=${registeredPlayer.money}, ${tileData.name} price=${tileData.price}`
        );

        if (registeredPlayer.money >= tileData.price) {
            console.log(
                `[TileSystem] ${player.node.name} can afford ${tileData.name}.`
            );

        } else {
            console.log(
                `[TileSystem] ${player.node.name} cannot afford ${tileData.name}.`
            );
        }
    }
}
```

---

# 11. TileSystem Inspector 当前绑定

节点：

```text
Managers/TileSystem
```

当前：

```text
TileSystem
├── Script
│   └── TileSystem.ts
└── Economy System
    └── Managers/EconomySystem
```

临时：

```text
Run Property Purchase Test
```

已经彻底删除。

---

# 12. GameManager 当前关键顺序

当前原有稳定顺序仍然是：

```text
movement completed
↓
TileSystem.resolveLanding(currentPlayer)
↓
TurnManager.nextTurn()
↓
updateTurnUI()
↓
Roll Dice Button 恢复 interactable
```

**不要把 nextTurn() 提前到 TileSystem 前面。**

但下一阶段必须解决：

```text
PROPERTY 需要玩家 BUY / SKIP 决策时
不能立即 nextTurn()
```

因此下一阶段会对 GameManager / TileSystem 的“是否立即结束回合”机制做**最小增量修改**。

不要重写整个 GameManager。

---

# 13. 已完成的 Property Purchase 底层交易测试

临时自动购买测试曾经成功验证：

示例：

```text
Player_2
playerId = 1
money = 15000

Paris
price = 1600
ownerId = null
```

测试结果：

```text
[EconomySystem] removeMoney: Player_2 15000 - 1600 = 13400

[TileSystem] PURCHASED: Player_2 bought Paris for 1600.
ownerId=1, money=13400
```

并且同一局后续 Player_4 再落到 Paris：

```text
[TileSystem] Property info: Paris, price=1600, ownerId=1
[TileSystem] Paris is owned by playerId=1.
```

因此已经证明：

```text
✅ EconomySystem.removeMoney() 可用于地产购买
✅ money 15000 → 13400 正确
✅ ownerId null → 1 正确
✅ 已购地产不会被别人再次购买
✅ ownerId 在当前运行期间保留
```

**但这只是临时测试。**

测试开关和自动购买代码已经从正式 TileSystem 中删除。

---

# 14. 当前最新实际验收结果

最新正式版本再次运行：

```text
Player_4
↓
landed on PROPERTY: Paris
↓
price=1600
ownerId=null
↓
Economy lookup:
playerId=3
money=15000
↓
Affordability check:
15000 >= 1600
↓
Player_4 can afford Paris.
```

并确认：

```text
✅ 没有自动 removeMoney
✅ 没有 PURCHASED
✅ money 仍为 15000
✅ ownerId 仍为 null
```

这就是当前最新稳定基线。

---

# 15. 当前明确没有实现的内容

当前正式版本尚未实现：

```text
❌ BUY / SKIP 购买 UI
❌ Property purchase decision state
❌ 落地后暂停回合等待玩家选择
❌ 正式购买按钮触发 removeMoney
❌ 正式购买按钮设置 ownerId
❌ Skip 后结束当前回合
❌ Rent
❌ START Reward
❌ TAX 扣款
❌ Chance / Destiny 效果
❌ Jail 逻辑
❌ Bankruptcy
❌ Victory Condition
❌ Save / Load
```

---

# 16. 下一阶段目标：Property Purchase Interaction

下一阶段核心目标：

```text
玩家移动完成
↓
TileSystem.resolveLanding()
↓
如果普通格子
    → 正常结束回合
    → nextTurn()

如果无人 PROPERTY 且玩家买得起
    → 暂停当前回合
    → 显示 BUY / SKIP
    → 等玩家选择

BUY
→ EconomySystem.removeMoney()
→ 设置 tileData.ownerId
→ 隐藏购买 UI
→ nextTurn()

SKIP
→ 不扣钱
→ ownerId 保持 null
→ 隐藏购买 UI
→ nextTurn()
```

---

# 17. 下一阶段第一原则

## 不要一上来直接做完整 UI

当前最危险的问题不是按钮美术，而是：

```text
GameManager 现在会在 TileSystem.resolveLanding() 后立即 nextTurn()
```

因此下一阶段应先解决：

> **TileSystem 如何告诉 GameManager：“这个落地事件还没处理完，现在不要 nextTurn。”**

建议先做一个最小的 pending / needsDecision 机制并用 Console 验证，再创建 BUY / SKIP UI。

---

# 18. 下一阶段建议拆分顺序

必须继续“小步验收”：

```text
Step 1
让 TileSystem 对落地结果返回：
普通格子 / 不需要决策
vs
需要 Property Purchase Decision

Step 2
GameManager 收到“需要决策”时不执行 nextTurn()
Console 验证当前玩家保持不变

Step 3
建立最简单 Property Purchase UI
只显示：
Paris
Price: 1600
BUY
SKIP

Step 4
SKIP 路径
点击 SKIP
→ 不扣钱
→ nextTurn()

Step 5
BUY 路径
点击 BUY
→ EconomySystem.removeMoney()
→ ownerId = 当前 playerId
→ nextTurn()

Step 6
回归测试
另一个玩家落到已购 Paris
→ 不显示购买 UI
→ 为之后 Rent System 留接口
```

每一步通过截图后再进入下一步。

---

# 19. 架构原则

继续遵守：

- Tile 数据和 3D 外观分离。
- 不把 Paris / London / Shanghai 写死进 3D 模型脚本。
- EconomySystem 统一负责资金变化。
- 不在 TileSystem 里直接 `money -= price`。
- 不重写 DiceSystem。
- 不重写 PlayerController 的移动逻辑。
- 不重写 BoardManager。
- 不重写 TurnManager。
- GameManager 只允许为“暂停 / 恢复回合”做最小增量修改。
- TileSystem 保留当前落地识别行为。
- 不提前做 Rent。
- 不提前做 Bankruptcy。
- 不提前做复杂 UI / 动画 / 美术。
- 当前仍以 v0.1 Core Prototype 稳定可验证为目标。

---

# 20. 教学方式

用户是 Cocos Creator 完全新手。

后续必须继续：

1. 每次只做一个小阶段。
2. 明确告诉用户在 Cocos Creator 里点哪里。
3. 明确告诉用户新建 / 修改哪个 TypeScript。
4. 给完整可复制代码。
5. 明确说明 Inspector 每个字段怎么设置。
6. 每一步都说明“正确完成后应该看到什么”。
7. 用户发截图后先检查截图，再继续下一步。
8. 不重做已经验收通过的系统。
9. 出问题先定位，不进行大规模重构。
10. 不一次实现多个游戏规则。

---

# 21. 对话切换规则

后续开发中，不要等用户主动询问是否需要新开对话框。

当满足以下条件时，助手应主动建议创建新的 handoff 并切换对话：

```text
一个可独立验收的子系统已经稳定完成
+
下一阶段将进入新的核心流程 / 新架构边界
```

典型切换点：

```text
Property Purchase Interaction 完成
→ 进入 Rent System 前建议切换

Rent System 完成
→ 进入 START / TAX 前建议切换

START / TAX 完成
→ 进入 Chance / Destiny 前建议切换

Chance / Destiny 完成
→ 进入 Jail / Bankruptcy / Victory 前建议切换
```

不需要因为普通的 2~3 个小步骤就频繁切换。

---

# 22. 新对话启动提示词

把本 Markdown 上传到新对话后，发送下面这段：

```text
请先完整阅读我上传的 `Monopoly3D_v0.1_Economy_Property_Handoff.md`，并把它作为当前项目唯一真实基线。

我正在用 Cocos Creator 3.8.8 从零制作一个准备发布到微信小游戏的 3D 大富翁游戏。

目前已经实际运行验收通过：

- DiceSystem 稳定
- PlayerController 移动与棋盘循环稳定
- BoardManager 稳定
- TurnManager 四人回合稳定
- TileType / TileData / TileDatabase / TileSystem 稳定
- PlayerEconomyData 已完成
  - Player_1 → playerId 0 → money 15000
  - Player_2 → playerId 1 → money 15000
  - Player_3 → playerId 2 → money 15000
  - Player_4 → playerId 3 → money 15000
- EconomySystem 已完成基础层
  - getPlayerById()
  - addMoney()
  - removeMoney()
- TileSystem 已接入 EconomySystem
- 玩家落到 PROPERTY 时能读取：
  - price
  - ownerId
  - 当前玩家 money
- 能正确判断玩家是否买得起 Paris
- Property purchase 底层交易已经用临时测试实际验证：
  - 15000 - 1600 = 13400
  - ownerId null → 当前 playerId
  - 已购地产不会再次被其他玩家购买
- 上述自动购买只是临时测试，测试开关和自动购买代码已经删除
- 当前正式版本不会自动扣钱，也不会自动修改 ownerId

不要重写或推翻已经验证通过的：

- DiceSystem
- PlayerController
- BoardManager
- TurnManager
- GameManager 原有骰子 / 移动流程
- 当前 TileSystem 落地识别流程
- PlayerEconomyData
- EconomySystem 基础资金操作

现在继续下一阶段：

# Property Purchase Interaction

当前最关键的问题是：

GameManager 在 `TileSystem.resolveLanding(currentPlayer)` 之后会立即执行 `TurnManager.nextTurn()`。

所以不能直接上 BUY / SKIP UI，否则购买框出现时回合已经切给下一玩家。

请严格增量开发。

第一小阶段先只实现：

- TileSystem 能告诉 GameManager：这次落地是否需要等待 Property Purchase Decision
- 如果不需要决策，保持现有 nextTurn 流程
- 如果需要决策，暂时不要 nextTurn
- 先只用 Console 验证“回合被暂停”
- 暂时不要创建 BUY / SKIP UI
- 暂时不要真正购买
- 暂时不要实现 Rent

我还是 Cocos Creator 完全新手，请继续一步一步带我做。

要求：

1. 每次只教一个小阶段。
2. 明确告诉我在 Cocos Creator 里点哪里。
3. 明确告诉我新建或修改哪个 TypeScript。
4. 给我完整可复制代码。
5. 明确告诉我 Inspector 要怎么设置。
6. 告诉我正确完成后应该看到什么。
7. 我发截图后先检查截图，再进入下一步。
8. 严格基于当前稳定架构增量开发，不要为了“更优雅”而重构已经跑通的系统。
9. 当一个稳定子系统完成、下一阶段将进入新的核心流程时，请主动提醒我是否该生成新的 handoff 并切换新对话框，不要等我主动问。

请现在从 Property Purchase Interaction 的第一步开始教我。
```

---

# 23. 当前最新存档结论

```text
Monopoly3D v0.1

Core Movement / Turn Loop          ✅
Tile Data Layer                    ✅
Landing Tile Recognition           ✅
Player Economy Data                ✅
EconomySystem Base                 ✅
PROPERTY Data Read                 ✅
Affordability Check                ✅
TileSystem → EconomySystem         ✅
Purchase Transaction Test          ✅
Temporary Auto-Purchase Cleanup    ✅

当前正式状态：
无人 PROPERTY
→ 能识别
→ 能读取价格 / ownerId
→ 能读取当前玩家 money
→ 能判断是否买得起
→ 不会自动购买
→ GameManager 仍然立即 nextTurn

下一阶段：
Property Purchase Interaction
→ 暂停当前回合
→ BUY / SKIP
→ 选择后再 nextTurn
```

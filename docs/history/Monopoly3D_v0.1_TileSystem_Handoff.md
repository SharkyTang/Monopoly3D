# Monopoly3D v0.1 — TileSystem 阶段交接存档

> 项目：微信小游戏 3D 大富翁  
> 引擎：Cocos Creator 3.8.8  
> 当前阶段：v0.1 Core Prototype  
> 本文用途：作为新对话继续开发的真实基线。  
> 当前最新验收点：**TileSystem + Tile 数据层第一阶段已完成并通过运行验证。**

---

## 1. 当前项目总体状态

当前已经完成一个可运行的四人回合制灰盒原型，并在原有稳定基线上新增了 Tile 数据层与落地格子识别。

当前完整主流程：

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
TileSystem 根据 currentTileIndex 读取 TileDatabase
↓
Console 输出落地格子类型与名称
↓
TurnManager.nextTurn()
↓
UI 更新为下一玩家
↓
下一名玩家继续点击 ROLL DICE
```

四人回合仍然正常：

```text
Player_1 → Player_2 → Player_3 → Player_4 → Player_1
```

---

## 2. 当前项目与场景

项目：

```text
Monopoly3D_v0.1_Core_Prototype
```

主场景：

```text
assets/scenes/Main.scene
```

---

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
    ├── player/
    │   └── PlayerController.ts
    └── tile/
        ├── TileData.ts
        ├── TileDatabase.ts
        ├── TileSystem.ts
        └── TileType.ts
```

---

## 4. 当前 Hierarchy

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
│   └── TileSystem
└── Canvas
    ├── Camera
    ├── RollDiceButton
    │   └── Label
    ├── DiceResultLabel
    └── TurnLabel
```

---

## 5. 原有稳定系统

以下系统已经在前一阶段验收通过，本阶段没有推翻：

```text
DiceSystem
PlayerController
BoardManager
TurnManager
```

核心稳定行为：

```text
✅ 两颗 D6
✅ currentTileIndex
✅ 棋盘循环
✅ 逐格 Tween
✅ 移动完成 callback
✅ 四人 TurnManager 循环
✅ 移动期间 Roll 按钮禁用
✅ DiceResultLabel
✅ TurnLabel
```

后续开发必须继续增量修改，不要重写这些已经验证通过的系统。

---

# 6. TileType.ts

路径：

```text
assets/scripts/tile/TileType.ts
```

当前代码：

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

当前支持 7 种 Tile 类型：

```text
START
PROPERTY
CHANCE
DESTINY
TAX
JAIL
SPECIAL
```

---

# 7. TileData.ts

路径：

```text
assets/scripts/tile/TileData.ts
```

当前代码：

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

当前含义：

```text
id
→ Tile 编号

name
→ 格子游戏名称

type
→ TileType

price?
→ 房产价格，当前仅保存数据

baseRent?
→ 基础租金，当前仅保存数据

ownerId?
→ 所有者，当前仅预留
```

注意：

```text
当前没有实现买地
当前没有实现扣钱
当前没有实现租金
当前没有实现 EconomySystem
```

---

# 8. TileDatabase.ts

路径：

```text
assets/scripts/tile/TileDatabase.ts
```

当前代码：

```ts
import { TileData } from './TileData';
import { TileType } from './TileType';

export const TILE_DATABASE: TileData[] = [
    {
        id: 0,
        name: 'Start',
        type: TileType.START
    },

    {
        id: 1,
        name: 'Paris',
        type: TileType.PROPERTY,
        price: 1600,
        baseRent: 200,
        ownerId: null
    },

    {
        id: 2,
        name: 'Chance',
        type: TileType.CHANCE
    },

    {
        id: 3,
        name: 'Destiny',
        type: TileType.DESTINY
    },

    {
        id: 4,
        name: 'Tax',
        type: TileType.TAX
    },

    {
        id: 5,
        name: 'Jail',
        type: TileType.JAIL
    },

    {
        id: 6,
        name: 'Special',
        type: TileType.SPECIAL
    }
];
```

当前 7 格测试映射：

| Scene Node | id | name | type |
|---|---:|---|---|
| Tile_00 | 0 | Start | START |
| Tile_01 | 1 | Paris | PROPERTY |
| Tile_02 | 2 | Chance | CHANCE |
| Tile_03 | 3 | Destiny | DESTINY |
| Tile_04 | 4 | Tax | TAX |
| Tile_05 | 5 | Jail | JAIL |
| Tile_06 | 6 | Special | SPECIAL |

---

# 9. TileSystem.ts

路径：

```text
assets/scripts/tile/TileSystem.ts
```

当前代码：

```ts
import { _decorator, Component } from 'cc';

import { PlayerController } from '../player/PlayerController';
import { TILE_DATABASE } from './TileDatabase';

const { ccclass } = _decorator;

@ccclass('TileSystem')
export class TileSystem extends Component {

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
    }
}
```

职责：

```text
接收 PlayerController
↓
读取 player.currentTileIndex
↓
TILE_DATABASE[tileIndex]
↓
找到 TileData
↓
Console 输出落地格子
```

例如：

```text
[TileSystem] Player_2 landed on PROPERTY: Paris
```

---

# 10. TileSystem 场景节点

Hierarchy：

```text
Managers
└── TileSystem
```

`Managers/TileSystem` 上已经挂载：

```text
TileSystem Component
→ Script: TileSystem.ts
```

当前 TileSystem Component 没有额外 Inspector 字段，这是正常状态。

---

# 11. GameManager.ts 当前接入状态

`GameManager.ts` 没有重写原有骰子 / 回合 / 移动逻辑，只新增 TileSystem 引用与落地调用。

新增 import：

```ts
import {
    TileSystem
} from '../tile/TileSystem';
```

新增 Inspector Property：

```ts
@property(TileSystem)
tileSystem: TileSystem | null = null;
```

移动完成 callback 当前关键顺序：

```ts
console.log(
    `[GameManager] ${currentPlayer.node.name} movement completed.`
);

if (this.tileSystem) {
    this.tileSystem.resolveLanding(currentPlayer);
} else {
    console.error(
        '[GameManager] TileSystem is not assigned.'
    );
}

this.turnManager?.nextTurn();

this.updateTurnUI();

if (this.rollDiceButton) {
    this.rollDiceButton.interactable = true;
}
```

重要顺序：

```text
movement completed
↓
TileSystem.resolveLanding(currentPlayer)
↓
TurnManager.nextTurn()
```

不要把 `nextTurn()` 提前到 `resolveLanding()` 前面。

---

# 12. GameManager Inspector 当前绑定

当前已有绑定继续保留：

```text
Dice System
→ Managers/DiceSystem

Turn Manager
→ Managers/TurnManager

Tile System
→ Managers/TileSystem

Roll Dice Button
→ Canvas/RollDiceButton

Dice Result Label
→ Canvas/DiceResultLabel

Turn Label
→ Canvas/TurnLabel
```

---

# 13. TileSystem 第一阶段实际运行验证

本阶段已经实际运行验证。

其中一次测试结果：

```text
Player_1
Rolled 6
→ Tile_06
→ [TileSystem] Player_1 landed on SPECIAL: Special
→ Player_2
```

```text
Player_2
Rolled 8
→ Tile_01
→ [TileSystem] Player_2 landed on PROPERTY: Paris
→ Player_3
```

Player_2 掷出 8 时，当前测试棋盘只有 7 格，实际移动成功经过：

```text
Tile_01
Tile_02
Tile_03
Tile_04
Tile_05
Tile_06
Tile_00
Tile_01
```

因此也再次确认：

```text
✅ Tile_06 → Tile_00 棋盘循环仍然正常
```

继续测试：

```text
Player_3
Rolled 8
→ Tile_01
→ [TileSystem] Player_3 landed on PROPERTY: Paris
→ Player_4
```

```text
Player_4
Rolled 4
→ Tile_04
→ [TileSystem] Player_4 landed on TAX: Tax
→ Player_1
```

---

# 14. 本阶段验收结果

## TileSystem + Tile 数据层第一阶段：验收通过

已经完成：

```text
✅ TileType.ts
✅ TileData.ts
✅ TileDatabase.ts
✅ TileSystem.ts
✅ Managers/TileSystem
✅ GameManager 引用 TileSystem
✅ GameManager Inspector 绑定 TileSystem
✅ 玩家落地后读取 TileData
✅ Console 输出 TileType + Tile name
✅ 四人回合保持正常
✅ 棋盘循环保持正常
✅ 原有 Dice / Movement / TurnManager 没有被推翻
```

验收目标：

```text
Player_X landed on PROPERTY: Paris
```

已经实际跑通。

---

# 15. 当前明确没有实现的内容

以下内容还没有开始：

```text
❌ Player Money
❌ EconomySystem
❌ Property Purchase
❌ Rent
❌ START Reward
❌ Chance / Destiny 效果
❌ Tax 扣款
❌ Jail 逻辑
❌ Bankruptcy
❌ Victory Condition
```

不要在新对话一上来一次性把这些全部实现。

---

# 16. 下一阶段开发目标

下一阶段：

# Player Economy Data

第一小阶段建议只建立：

```text
playerId
money
```

目标是：

```text
每一个 PlayerController
↓
拥有稳定的 playerId
↓
拥有初始 money
↓
游戏启动时可以在 Console 验证四名玩家的数据
```

示例目标：

```text
Player_1 → playerId = 0 → money = 15000
Player_2 → playerId = 1 → money = 15000
Player_3 → playerId = 2 → money = 15000
Player_4 → playerId = 3 → money = 15000
```

> 注意：初始金额的最终数值可以在新对话开始时再确认。  
> 不要因为这里的示例数值就直接进入买地或租金逻辑。

第一阶段暂时不要实现：

```text
❌ EconomySystem
❌ addMoney()
❌ removeMoney()
❌ Property Purchase
❌ Rent
❌ TAX 扣款
❌ START 奖励
❌ Bankruptcy
```

先把玩家经济数据本身建立稳定。

---

# 17. 后续建议顺序

```text
TileType + TileData             ✅
↓
TileSystem / Tile Resolver      ✅
↓
Player Economy Data             ← 下一阶段
↓
EconomySystem
↓
Property Purchase
↓
Rent
↓
START Reward
↓
Chance / Destiny
↓
Bankruptcy
↓
Victory Condition
```

---

# 18. 架构原则

后续必须继续遵守：

- 不把 Paris / London / Shanghai 写死进 3D 模型脚本。
- Tile 数据与 3D 外观分离。
- 不推翻已经验证通过的 DiceSystem。
- 不推翻已经验证通过的 PlayerController 移动逻辑。
- 不推翻已经验证通过的 BoardManager。
- 不推翻已经验证通过的 TurnManager。
- 不要为了后续功能提前做复杂 UI。
- 不要为了美术提前引入 Blender / Lux3D / Tripo / Meshy。
- EconomySystem 后续统一负责资金变化，不要把扣钱逻辑散落到 TileSystem 中。
- 当前继续以稳定的 v0.1 Core Prototype 为目标。

---

# 19. 新对话工作方式

用户是 Cocos Creator 新手。

新对话必须继续使用以下方式教学：

1. 每次只做一个小阶段。
2. 明确告诉用户在 Cocos Creator 里点哪里。
3. 明确告诉用户新建哪个 Folder / Node / TypeScript。
4. 给完整可复制代码。
5. 明确说明 Inspector 每个引用拖哪个 Node。
6. 每一步都说明“正确完成后应该看到什么”。
7. 不要一次实现太多功能。
8. 用户发截图后，优先检查截图，再继续下一步。
9. 不要重做已经验收通过的系统。
10. 发现问题时先定位当前错误，不要大规模重构。

---

# 20. 新对话启动提示词

把本 Markdown 文件上传到新对话后，发送下面这段：

```text
请先完整阅读我上传的 `Monopoly3D_v0.1_TileSystem_Handoff.md`，并把它作为当前项目唯一真实基线。

我正在用 Cocos Creator 3.8.8 从零制作一个准备发布到微信小游戏的 3D 大富翁游戏。

目前 TileSystem + Tile 数据层第一阶段已经实际运行验收通过：
- TileType 已完成
- TileData 已完成
- TileDatabase 已完成
- TileSystem 已完成
- GameManager 已接入 TileSystem
- 玩家移动结束后能正确读取 currentTileIndex
- Console 能输出 `Player_X landed on PROPERTY: Paris`
- 四人回合循环正常
- 棋盘循环正常

不要重写或推翻已经验证通过的：
- DiceSystem
- PlayerController
- BoardManager
- TurnManager
- 当前 TileSystem 落地识别流程

现在继续下一阶段：

# Player Economy Data

我还是 Cocos Creator 完全新手，请继续一步一步带我做。

第一小阶段只建立每个玩家自己的经济数据，例如：
- playerId
- money

先让 4 个玩家拥有正确的 playerId 和初始 money，并能够通过 Inspector / Console 验证。

这一阶段暂时不要实现：
- EconomySystem
- 买地
- 租金
- TAX 扣款
- START 奖励
- 破产
- 胜利条件

要求：
1. 每次只教一个小阶段。
2. 明确告诉我在 Cocos Creator 里点哪里。
3. 明确告诉我新建或修改哪个 TypeScript。
4. 给我完整可复制代码。
5. 明确告诉我 Inspector 要怎么设置。
6. 告诉我正确完成后应该看到什么。
7. 我发截图后先检查截图，再进入下一步。
8. 严格基于当前稳定架构增量开发，不要为了“更优雅”而重构已经跑通的系统。

请现在从 Player Economy Data 的第一步开始教我。
```

---

# 21. 当前最新存档结论

```text
Monopoly3D v0.1

Core Movement / Turn Loop       ✅
TileType                        ✅
TileData                        ✅
TileDatabase                    ✅
TileSystem                      ✅
Landing Tile Recognition        ✅

下一阶段：
Player Economy Data
```

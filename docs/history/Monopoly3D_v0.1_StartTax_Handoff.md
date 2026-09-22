# Monopoly3D v0.1 — START Reward + TAX 阶段交接存档

> 项目：微信小游戏 3D 大富翁  
> 引擎：Cocos Creator 3.8.8  
> 当前阶段：v0.1 Core Prototype  
> 本文用途：作为下一阶段 **Chance → Destiny** 新对话的唯一真实基线。  
> 最新已验收范围：Property Purchase、Rent、START Reward、TAX，以及相关回归测试。  

---

# 1. 当前已完成并实际验收

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

Property Affordability                ✅
Property Purchase Decision            ✅
Turn Pause / Resume                   ✅
PropertyPurchaseUI                    ✅
BUY / SKIP                            ✅
pendingProperty                       ✅

Rent System                           ✅
Own Property No-Rent                  ✅
Other Player Rent                     ✅
baseRent                              ✅
Rent payer deduction                  ✅
Rent owner income                     ✅

START Pass Detection                  ✅
START Landing Detection               ✅
START Reward                          ✅

TAX Detection                         ✅
TAX data field                        ✅
TAX deduction                         ✅

Property Purchase regression          ✅
Own Property regression               ✅
Rent regression                       ✅
TAX standalone regression             ✅
```

注意：

- 当前已有证据分别验证了 START、TAX、Property Purchase、Own Property、Rent。
- 尚未专门保存一次“同一回合经过 START 后最终落到 TAX”的独立截图，因此不要把这一条单独写成已截图验收项。
- 不要因为进入 Chance / Destiny 而重写这些已经稳定的系统。

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

---

# 3. 当前玩家经济数据

初始资金：

```text
Player_1 → playerId 0 → money 15000
Player_2 → playerId 1 → money 15000
Player_3 → playerId 2 → money 15000
Player_4 → playerId 3 → money 15000
```

`EconomySystem` 已稳定提供：

```ts
getPlayerById()
addMoney()
removeMoney()
```

所有资金变化必须继续统一走 `EconomySystem`。

禁止直接：

```ts
player.money += amount;
player.money -= amount;
```

---

# 4. Paris / PROPERTY 当前数据

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

规则：

- `ownerId` 是运行时状态。
- 每次重新启动 Preview 后会重新初始化为 `null`。
- 同一局内购买后会保留。
- Rent 使用 `TileData.baseRent`，没有把 Paris 或 200 写死进 Rent 逻辑。

---

# 5. Property Purchase 当前稳定流程

```text
玩家移动完成
↓
TileSystem.resolveLanding(currentPlayer)
↓
无人 PROPERTY + 玩家买得起
↓
保存 pendingProperty
↓
resolveLanding() 返回 true
↓
GameManager 暂停回合
↓
Roll Dice 禁用
↓
PropertyPurchaseUI 显示

BUY
→ EconomySystem.removeMoney()
→ 设置 ownerId
→ 清除 pendingProperty
→ 隐藏 UI
→ nextTurn()
→ 恢复 Roll Dice

SKIP
→ 不扣钱
→ ownerId 保持 null
→ 清除 pendingProperty
→ 隐藏 UI
→ nextTurn()
→ 恢复 Roll Dice
```

不要重写这套流程。

---

# 6. Rent System 当前稳定流程

```text
玩家落到已购 PROPERTY
↓
ownerId == 当前玩家 playerId
→ No rent
→ 正常 nextTurn()

ownerId != 当前玩家 playerId
→ payer 通过 EconomySystem.removeMoney(baseRent)
→ owner 通过 EconomySystem.addMoney(baseRent)
→ 正常 nextTurn()
```

Paris：

```text
baseRent = 200
```

已验证：

```text
payer -200
owner +200
不触发购买 UI
正常 nextTurn()
```

---

# 7. START Reward 当前规则

已由用户明确确认：

```text
经过 START：奖励
刚好停在 START：同样奖励
游戏开局站在 START：不奖励
奖励金额：2000
```

START 检测位于 `PlayerController` 的逐格移动流程中。

原因：

- `TileSystem.resolveLanding()` 只知道最终落地格。
- 如果玩家途中经过 START、最终停在别的格子，仅靠最终落地无法判断经过 START。
- 因此检测放在逐格移动过程中。

当前行为：

```text
棋子实际移动到 Tile_00
↓
如果 Tile_00 不是最后一步
→ PASSED START
→ +2000

如果 Tile_00 是最后一步
→ LANDED ON START
→ +2000
```

资金变化统一调用：

```ts
EconomySystem.addMoney()
```

游戏初始化站在 `Tile_00` 不会触发奖励。

已实际验证：

```text
Player_1:
15000 → PASSED START → 17000

Player_3:
19000 → LANDED ON START → 21000
```

并验证 START 后仍能继续正常进入 Property / Rent / 普通落地流程。

---

# 8. START Reward 已验证回归案例

## 8.1 START → Paris → BUY

实际日志验证：

```text
Player_1
26000
→ START +2000
→ 28000
→ 落到 Paris
→ Purchase UI 正常出现
→ BUY -1600
→ 26400
→ Paris ownerId = 0
→ 正常 nextTurn()
```

确认：

```text
START Reward                  ✅
Property Purchase detection   ✅
PropertyPurchaseUI            ✅
Turn Pause                    ✅
BUY                           ✅
Turn Resume                   ✅
```

## 8.2 START → 自己的 Paris

实际日志验证：

```text
Player_1
26400
→ START +2000
→ 28400
→ 落到 Paris ownerId=0
→ No rent required
→ 正常 nextTurn()
```

确认：

```text
START Reward        ✅
Own Property        ✅
No Rent             ✅
nextTurn            ✅
```

## 8.3 START → 别人的 Paris → Rent

实际日志验证：

```text
Player_2
25000
→ START +2000
→ 27000
→ 落到 Paris ownerId=0
→ Rent -200
→ 26800

Player_1
28400
→ Rent +200
→ 28600
```

确认：

```text
START Reward        ✅
Rent payer          ✅
Rent owner          ✅
nextTurn            ✅
```

---

# 9. TAX 当前数据层

`TileData.ts` 当前结构：

```ts
import { TileType } from './TileType';

export interface TileData {
    id: number;
    name: string;
    type: TileType;

    price?: number;
    baseRent?: number;
    taxAmount?: number;
    ownerId?: number | null;
}
```

`taxAmount` 是 TAX 专属数据字段。

当前 `TileDatabase.ts` 中 Tax：

```ts
{
    id: 4,
    name: 'Tax',
    type: TileType.TAX,
    taxAmount: 1000
}
```

固定 TAX 金额已经由用户确认：

```text
TAX = 1000
```

不要在 `TileSystem.ts` 中把 1000 写死。

---

# 10. TAX 当前正式流程

```text
玩家最终落到 TileType.TAX
↓
TileSystem 读取 tileData.taxAmount
↓
获取 PlayerEconomyData.playerId
↓
EconomySystem.getPlayerById()
↓
记录扣款前资金
↓
EconomySystem.removeMoney(playerId, taxAmount)
↓
Console 输出
↓
resolveLanding() 返回 false
↓
GameManager 正常 nextTurn()
```

当前没有：

```text
TAX UI
Bankruptcy
欠款处理
资产不足处理
```

不要提前实现这些内容。

---

# 11. TAX 已实际验收

TAX Step 1：

```text
[TileSystem] Player_3 landed on TAX: Tax
[TaxSystem] Player_3 landed on TAX: Tax.
[TaxSystem] TAX detected. No tax deducted yet.
```

验证了：

```text
TAX 专属识别 ✅
不扣款 ✅
正常 nextTurn ✅
```

TAX Step 2：

实际案例：

```text
Player_2
21000
→ TAX -1000
→ 20000
```

Console：

```text
[TaxSystem] Tax amount: 1000.
[EconomySystem] removeMoney: Player_2 21000 - 1000 = 20000
[TaxSystem] TAX PAID: Player_2 paid 1000.
[TaxSystem] Money: 21000 -> 20000
```

另一个已验证案例：

```text
Player_4
15000
→ TAX -1000
→ 14000
→ 正常 nextTurn()
```

确认：

```text
TileType.TAX detection        ✅
taxAmount read                ✅
EconomySystem.removeMoney()   ✅
固定扣 1000                   ✅
正常 nextTurn                 ✅
```

---

# 12. 当前 `TileSystem` 的职责边界

当前 `TileSystem.resolveLanding()` 已承担：

```text
通用落地识别
PROPERTY Purchase
Rent
TAX
```

但不要因为后续加入 Chance / Destiny 就重构现有系统。

下一阶段优先采用最小增量方案。

---

# 13. 当前不允许重写的稳定系统

```text
DiceSystem
PlayerController
BoardManager
TurnManager
GameManager 原有骰子 / 移动 / 回合流程
EconomySystem
TileType
TileData 已有字段
TileDatabase 已有数据
TileSystem PROPERTY / Rent / TAX
PropertyPurchaseUI
BUY / SKIP
START Reward
```

开发原则：

- 严格增量开发。
- 不为了“更优雅”而重构。
- 每次只实现一个可以运行验收的小阶段。
- TypeScript 修改优先提供完整文件可复制替换版。
- 如果缺少当前最新实际代码，先让用户上传，不要猜旧版本。
- 每一步必须说明：
  - 修改哪个 TypeScript
  - Cocos Creator 里点哪里
  - Inspector 是否需要设置
  - 正确 Console 应看到什么
- 用户发截图后，先检查截图，再进入下一步。

---

# 14. 当前尚未实现

```text
Chance Card System
Destiny Card System
Chance UI
Destiny UI
Jail Logic
Bankruptcy
Victory Condition
Save / Load
Rent UI
TAX UI
正式完整棋盘
正式 3D 建筑资产
```

---

# 15. 下一阶段：Chance → Destiny

现在进入新的核心阶段：

```text
CHANCE
↓
DESTINY
```

不要同时实现。

第一阶段只做：

```text
CHANCE Step 1
玩家最终落到 TileType.CHANCE
↓
输出专属 ChanceSystem Console
↓
正常 nextTurn()
```

暂时不要：

```text
随机抽卡
Chance 卡牌数据
加钱
扣钱
移动玩家
Chance UI
回合暂停
Destiny
Jail
Bankruptcy
```

当前 `Tile_02` 已经是：

```text
Tile_02 → Chance
```

已有通用日志能识别：

```text
[TileSystem] Player_X landed on CHANCE: Chance
```

下一步只增加专属 Chance 分支，例如：

```text
[ChanceSystem] Player_X landed on CHANCE: Chance.
[ChanceSystem] CHANCE detected. No card drawn yet.
```

然后正常 nextTurn。

---

# 16. 新对话第一任务

请从：

```text
CHANCE Step 1
```

开始。

在开始写代码前：

1. 先阅读本 handoff。
2. 把本 handoff 作为唯一真实基线。
3. 判断最小改动点。
4. 如果需要当前最新 `TileSystem.ts`，请先让用户上传。
5. 不要根据旧代码猜测。
6. 不要提前做卡牌系统。
7. CHANCE Step 1 验收通过后，再规划 Chance 数据层。

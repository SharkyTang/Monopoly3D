# Monopoly3D v0.1 — CHANCE 完成阶段交接存档

> 项目：微信小游戏 3D 大富翁  
> 引擎：Cocos Creator 3.8.8  
> 当前阶段：v0.1 Core Prototype  
> 本文用途：作为下一阶段 **DESTINY** 新对话的唯一真实基线。  
> 最新状态：**CHANCE 核心系统已完成，并完成 START / Property Purchase / Rent / TAX 回归测试。**

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

CHANCE Landing Detection              ✅
ChanceCardType                        ✅
ChanceCardData                        ✅
ChanceCardDatabase                    ✅
Chance Random Draw                    ✅
Chance MONEY_GAIN                     ✅
Chance MONEY_LOSS                     ✅
Chance MOVE FORWARD                   ✅
Chance MOVE BACKWARD                  ✅
Chance MOVE secondary landing         ✅
Chance backward → START reward        ✅

Final Legacy Regression:
START Pass                            ✅
START Landing                         ✅
Property Purchase                     ✅
Rent                                  ✅
TAX                                   ✅
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

注意：

- 因测试棋盘只有 7 格，骰子一次可能在同一回合中经过 START 后又最终停在 START。
- 当前规则允许“经过 START +2000”和“最终停 START +2000”分别触发，所以同一次移动可能出现两次 START 奖励。
- 这是当前规则下的预期行为，不是 Bug。

---

# 3. 当前玩家经济规则

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

所有资金变化必须继续统一通过 `EconomySystem`。

禁止直接：

```ts
player.money += amount;
player.money -= amount;
```

---

# 4. PROPERTY / Rent 当前稳定规则

Paris 当前数据：

```text
id       = 1
name     = Paris
type     = PROPERTY
price    = 1600
baseRent = 200
ownerId  = null（新 Preview 初始化）
```

## Property Purchase

```text
玩家落到无人 PROPERTY
↓
TileSystem 检查价格与余额
↓
保存 pendingProperty
↓
resolveLanding() 返回 true
↓
GameManager 暂停回合
↓
PropertyPurchaseUI 打开
↓
BUY / SKIP
```

BUY：

```text
EconomySystem.removeMoney()
→ ownerId = buyer playerId
→ clearPendingProperty()
→ UI 隐藏
→ nextTurn()
```

SKIP：

```text
不扣钱
→ ownerId 保持 null
→ clearPendingProperty()
→ UI 隐藏
→ nextTurn()
```

## Rent

```text
落到自己的 PROPERTY
→ No rent
→ nextTurn()

落到别人的 PROPERTY
→ payer: EconomySystem.removeMoney(baseRent)
→ owner: EconomySystem.addMoney(baseRent)
→ nextTurn()
```

Paris 当前：

```text
baseRent = 200
```

---

# 5. START 当前稳定规则

用户已明确确认：

```text
正常向前经过 START：+2000
正常向前最终停在 START：+2000
Chance 倒退最终停在 START：+2000
游戏开局站在 START：不奖励
```

目前没有扩展规则：

```text
“向后移动经过 START，但最终不停在 START”暂未定义，不要自行猜测。
```

START 检测位于 `PlayerController` 的逐格移动流程中。

原因：

```text
TileSystem.resolveLanding() 只处理最终落地。
START 的“途中经过”必须由逐格移动检测。
```

所有 START 奖励统一调用：

```ts
EconomySystem.addMoney()
```

---

# 6. TAX 当前稳定规则

当前 Tax：

```text
Tile_04
type      = TAX
taxAmount = 1000
```

固定规则：

```text
TAX = 1000
```

执行：

```text
玩家最终落 TAX
↓
读取 tileData.taxAmount
↓
EconomySystem.removeMoney(playerId, taxAmount)
↓
nextTurn()
```

不要在 `TileSystem` 中把 1000 重新写死。

目前未实现：

```text
TAX UI
Bankruptcy
欠款处理
资产不足处理
```

---

# 7. CHANCE 数据层

当前脚本目录：

```text
assets/scripts/chance/
├── ChanceCardType.ts
├── ChanceCardData.ts
└── ChanceCardDatabase.ts
```

## ChanceCardType

当前类型：

```ts
MONEY_GAIN
MONEY_LOSS
MOVE
```

## ChanceCardData

当前字段：

```ts
id: number;
title: string;
description: string;
type: ChanceCardType;
amount?: number;
moveSteps?: number;
```

## ChanceCardDatabase

当前测试卡共 6 张：

```text
1. Lucky Bonus
   type = MONEY_GAIN
   amount = 1000

2. Big Prize
   type = MONEY_GAIN
   amount = 2000

3. Repair Fee
   type = MONEY_LOSS
   amount = 500

4. Unexpected Expense
   type = MONEY_LOSS
   amount = 1000

5. Move Forward
   type = MOVE
   moveSteps = +3

6. Move Backward
   type = MOVE
   moveSteps = -2
```

当前随机抽取允许连续重复抽到同一张卡，这是正常行为。

---

# 8. CHANCE 当前完整流程

```text
玩家最终落 TileType.CHANCE
↓
TileSystem 输出 Chance 专属日志
↓
从 CHANCE_CARD_DATABASE 随机抽 1 张
↓
根据 ChanceCardType 执行
```

---

# 9. CHANCE — MONEY_GAIN 已验收

支持：

```text
Lucky Bonus → +1000
Big Prize   → +2000
```

执行流程：

```text
读取 drawnCard.amount
↓
获取 PlayerEconomyData.playerId
↓
EconomySystem.getPlayerById()
↓
记录 moneyBefore
↓
EconomySystem.addMoney()
↓
输出 moneyBefore -> moneyAfter
↓
nextTurn()
```

已实际验证案例包括：

```text
Big Prize:
21000 + 2000 = 23000

Lucky Bonus:
30800 + 1000 = 31800
```

---

# 10. CHANCE — MONEY_LOSS 已验收

支持：

```text
Repair Fee          → -500
Unexpected Expense  → -1000
```

执行流程：

```text
读取 drawnCard.amount
↓
获取 PlayerEconomyData.playerId
↓
EconomySystem.getPlayerById()
↓
记录 moneyBefore
↓
EconomySystem.removeMoney()
↓
输出 moneyBefore -> moneyAfter
↓
nextTurn()
```

已实际验证：

```text
Repair Fee:
17000 - 500 = 16500

Unexpected Expense:
19000 - 1000 = 18000
```

---

# 11. CHANCE — MOVE FORWARD 已验收

当前：

```text
Move Forward
moveSteps = +3
```

重要架构：

```text
TileSystem
→ 不直接让 GameManager 立刻 nextTurn
→ 保存 pendingChanceMoveSteps

GameManager
→ 发现 pending Chance MOVE
→ clear pending
→ 调用 PlayerController.moveBySteps(+3)
→ 等动画完全完成
→ 再 resolveLanding()
→ 最后根据落地结果决定是否 nextTurn
```

已验证：

```text
Tile_02 / Chance
→ +3
→ Tile_03
→ Tile_04
→ Tile_05 / Jail
```

移动完成后：

```text
GameManager
→ 再次 TileSystem.resolveLanding()
→ [TileSystem] Player_X landed on JAIL: Jail
→ nextTurn()
```

目前 Jail 只有落地识别，没有 Jail 功能。

---

# 12. CHANCE — MOVE BACKWARD 已验收

当前：

```text
Move Backward
moveSteps = -2
```

`PlayerController.moveBySteps()` 已从“只支持正数”扩展为支持有符号步数：

```text
steps > 0  → 向前
steps < 0  → 向后
steps = 0  → 拒绝
```

实现原则：

```text
direction  = steps > 0 ? 1 : -1
totalSteps = abs(steps)
```

棋盘索引向后移动仍正确循环：

```text
(nextIndex + direction + tileCount) % tileCount
```

已实际验证：

```text
Tile_02
→ Tile_01
→ Tile_00 / START
```

并正确：

```text
LANDED ON START
→ EconomySystem.addMoney(+2000)
→ movement finished
→ GameManager 再次 resolveLanding(Tile_00)
→ TileSystem 只识别 START
→ 不重复发钱
→ nextTurn()
```

实际验收案例：

```text
Player_1:
63300 → 65300
```

START 奖励只发生一次。

---

# 13. PlayerController 当前重要变化

为了 Chance MOVE，当前 `PlayerController` 已稳定支持：

```text
正向步数
负向步数
逐格 Tween
棋盘循环
START 检测
```

START 检测当前规则：

```text
direction > 0:
    经过 START → 奖励
    最终停 START → 奖励

direction < 0:
    只有“最终停 START” → 奖励
```

不要为了 Destiny 重写这一套移动逻辑。

---

# 14. TileSystem 当前职责

当前 `TileSystem.resolveLanding()` 已承担：

```text
通用落地识别
CHANCE
PROPERTY Purchase
Rent
TAX
```

同时维护：

```text
pendingProperty
pendingChanceMoveSteps
```

Chance MOVE 只负责登记待移动步数，实际异步移动由 GameManager 接管。

不要因为 Destiny 而重构现有 TileSystem 架构。

---

# 15. GameManager 当前重要职责

当前 GameManager 已稳定处理：

```text
骰子
正常玩家移动
移动完成后的 resolveLanding()
Property Purchase 回合暂停
PropertyPurchaseUI
Chance pending MOVE
Chance 二次移动
Chance MOVE 后再次 resolveLanding()
Chance MOVE 后若落 PROPERTY，继续保留 Property Purchase 暂停语义
正常 nextTurn()
```

特别注意：

```text
TileSystem.resolveLanding() 返回 true
```

目前语义仍然是：

```text
需要暂停回合，等待 Property Purchase Decision
```

不要改变这个含义。

---

# 16. CHANCE Final Regression 已通过

Chance 完整实现后，因为修改过 `PlayerController` / `GameManager` / `TileSystem`，已重新执行 Legacy Regression。

## 16.1 正常经过 START

已验证：

```text
Player_1
15000
→ PASSED START
→ +2000
→ 17000
```

结果：

```text
START Pass              ✅
EconomySystem.addMoney  ✅
```

## 16.2 正常停在 START

已验证：

```text
Player_1
19000
→ LANDED ON START
→ +2000
→ 21000
→ TileSystem landed on START
→ nextTurn
```

结果：

```text
START Landing           ✅
只奖励一次              ✅
nextTurn                ✅
```

## 16.3 Property Purchase

已验证：

```text
Player_2
money = 17000
→ landed Paris
→ Purchase UI
→ BUY
→ -1600
→ 15400
→ ownerId = 1
→ nextTurn
```

结果：

```text
Property Detection      ✅
Purchase UI             ✅
Turn Pause              ✅
BUY                     ✅
ownerId                 ✅
Turn Resume             ✅
```

## 16.4 TAX

已验证：

```text
Player_4
17000
→ PASSED START +2000
→ 19000
→ landed TAX
→ -1000
→ 18000
→ nextTurn
```

结果：

```text
START + TAX 串联        ✅
TAX -1000               ✅
nextTurn                ✅
```

## 16.5 Rent

已验证：

```text
Player_4
22000
→ PASSED START +2000
→ 24000
→ landed Paris (ownerId=1)
→ -200
→ 23800

Player_2(owner)
27400
→ +200
→ 27600
```

结果：

```text
START + Rent 串联       ✅
Rent payer -200         ✅
Rent owner +200         ✅
nextTurn                ✅
```

---

# 17. 当前尚未实现

```text
Destiny Card System
Destiny UI

Chance UI

Jail Logic
Bankruptcy
Victory Condition
Save / Load
Rent UI
TAX UI

正式完整棋盘
正式 3D 建筑资产
```

Chance 当前完成的是 **Core Logic / Console Prototype**，不是最终视觉 UI。

---

# 18. 下一核心阶段：DESTINY

现在正式进入：

```text
DESTINY
```

不要把 Destiny 和 Chance 同时重构。

第一阶段只做：

```text
DESTINY Step 1

玩家最终落到 TileType.DESTINY
↓
输出专属 DestinySystem Console
↓
不抽卡
↓
不执行效果
↓
正常 nextTurn()
```

当前 `Tile_03` 已经是：

```text
Tile_03 → Destiny
```

现有通用 TileSystem 已能输出类似：

```text
[TileSystem] Player_X landed on DESTINY: Destiny
```

下一步只增加专属日志，例如：

```text
[DestinySystem] Player_X landed on DESTINY: Destiny.
[DestinySystem] DESTINY detected. No card drawn yet.
```

然后：

```text
[TurnManager] Next turn: Player_Y
```

---

# 19. DESTINY Step 1 暂时不要做的内容

```text
❌ DestinyCardType
❌ DestinyCardData
❌ DestinyCardDatabase
❌ 随机抽 Destiny 卡
❌ 加钱 / 扣钱
❌ 移动玩家
❌ Destiny UI
❌ 回合暂停
❌ Jail
❌ Bankruptcy
```

Step 1 验收通过后，再像 Chance 一样逐步建立 Destiny 数据层。

---

# 20. 下一对话的开发原则

必须继续遵守：

1. 每次只实现一个很小、可实际运行验收的阶段。
2. 用户是 Cocos Creator 新手，必须明确告诉用户在 Cocos Creator 中点击哪里。
3. 明确告诉用户修改哪个 TypeScript。
4. TypeScript 修改优先提供“完整文件可复制替换版”，不要要求用户手动替换多个局部片段。
5. 明确告诉用户 Inspector 是否需要设置。
6. 每一步给出正确 Console 预期。
7. 用户发截图后，先检查截图，再进入下一阶段。
8. 严格增量开发。
9. 不为了代码更优雅而重构稳定系统。
10. 所有资金变化必须继续统一经过 EconomySystem。
11. 如果需要当前最新代码，先让用户上传对应 TypeScript，不根据旧版本猜。
12. 不要破坏：
    - DiceSystem
    - PlayerController
    - BoardManager
    - TurnManager
    - EconomySystem
    - Property Purchase
    - PropertyPurchaseUI
    - Rent
    - START Reward
    - TAX
    - CHANCE
13. DESTINY Step 1 验收通过后，再讨论 Destiny 卡牌数据层。
14. Destiny 完整稳定以后，再进入后续 Jail 等系统。
15. 当一个稳定子系统完成、下一阶段进入新的核心流程/架构边界时，主动提醒用户是否适合切换新对话并制作 handoff，不要等用户询问。

---

# 21. 新对话第一任务

从：

```text
DESTINY Step 1
```

开始。

开始写代码前：

1. 先完整阅读本 handoff。
2. 把本 handoff 作为当前项目唯一真实基线。
3. 判断最小改动点。
4. 如果需要当前最新版 `TileSystem.ts`，先让用户上传。
5. 不要根据旧版 Chance 开发过程猜测当前文件。
6. 不要提前实现 Destiny 卡牌数据层。
7. 不要修改当前已验收的 Chance。
8. Step 1 目标只有：

```text
[TileSystem] Player_X landed on DESTINY: Destiny
[DestinySystem] Player_X landed on DESTINY: Destiny.
[DestinySystem] DESTINY detected. No card drawn yet.
[TurnManager] Next turn: Player_Y
```

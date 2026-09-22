# Monopoly3D v0.1 — DESTINY 完成阶段交接存档

> 项目：微信小游戏 3D 大富翁  
> 引擎：Cocos Creator 3.8.8  
> 当前阶段：v0.1 Core Prototype  
> 交接日期：2026-09-22  
> 本文用途：作为下一阶段 **JAIL** 新对话的唯一真实基线。  
> 最新状态：**CHANCE + DESTINY 核心逻辑已完成，并完成 START / Property Purchase / Rent / TAX / CHANCE / DESTINY Final Regression。**

---

# 1. 当前已完成并实际验收

```text
Core Movement / Turn Loop                  ✅
DiceSystem                                 ✅
PlayerController                           ✅
BoardManager                               ✅
TurnManager                                ✅

TileType / TileData / TileDatabase         ✅
TileSystem Landing Recognition             ✅

PlayerEconomyData                          ✅
EconomySystem Base                         ✅
getPlayerById()                            ✅
addMoney()                                 ✅
removeMoney()                              ✅

Property Affordability                     ✅
Property Purchase Decision                 ✅
Turn Pause / Resume                        ✅
PropertyPurchaseUI                         ✅
BUY / SKIP                                 ✅
pendingProperty                            ✅

Rent System                                ✅
Own Property No-Rent                       ✅
Other Player Rent                          ✅
baseRent                                   ✅
Rent payer deduction                       ✅
Rent owner income                          ✅

START Pass Detection                       ✅
START Landing Detection                    ✅
START Reward                               ✅

TAX Detection                              ✅
TAX deduction                              ✅

CHANCE Landing Detection                   ✅
ChanceCardType                             ✅
ChanceCardData                             ✅
ChanceCardDatabase                         ✅
Chance Random Draw                         ✅
Chance MONEY_GAIN                          ✅
Chance MONEY_LOSS                          ✅
Chance MOVE FORWARD                        ✅
Chance MOVE BACKWARD                       ✅
Chance MOVE secondary landing              ✅
Chance backward → START reward             ✅

DESTINY Landing Detection                  ✅
DestinyCardType                            ✅
DestinyCardData                            ✅
DestinyCardDatabase                        ✅
Destiny Random Draw                        ✅
Destiny MONEY_GAIN                         ✅
Destiny MONEY_LOSS                         ✅
Destiny MOVE FORWARD                       ✅
Destiny MOVE BACKWARD                      ✅
Destiny MOVE secondary landing             ✅

Final Regression:
START Pass                                 ✅
START Landing                              ✅
Property Purchase                          ✅
Rent                                       ✅
TAX                                        ✅
CHANCE MONEY                               ✅
CHANCE MOVE                                ✅
DESTINY MONEY                              ✅
DESTINY MOVE                               ✅
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

- 因测试棋盘只有 7 格，骰子可能在同一回合内多次经过 START。
- 当前规则允许：
  - 经过 START +2000
  - 最终停在 START +2000
- 因此同一次正常正向移动如果既经过 START 又最终停在 START，可能累计获得 +4000。
- 这是当前已确认规则，不是 Bug。

---

# 3. 当前玩家经济规则

新 Preview 初始资金：

```text
Player_1 → playerId 0 → 15000
Player_2 → playerId 1 → 15000
Player_3 → playerId 2 → 15000
Player_4 → playerId 3 → 15000
```

`EconomySystem` 已稳定提供：

```ts
getPlayerById()
addMoney()
removeMoney()
```

所有资金变化必须统一经过 `EconomySystem`。

禁止直接：

```ts
player.money += amount;
player.money -= amount;
```

---

# 4. PROPERTY / Rent 当前稳定规则

Paris：

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
TileSystem 检查余额
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

当前 Paris：

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
向后移动经过 START、但最终不停 START：不奖励
游戏开局站在 START：不奖励
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

当前 `PlayerController.moveBySteps()` 已稳定支持：

```text
正向步数
负向步数
逐格 Tween
棋盘循环
START 检测
```

不要为了后续 JAIL 重写移动逻辑。

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

# 7. CHANCE 当前定位与数据层

正式定位：

> **CHANCE = 即时型随机事件，以小额资金变化和短距离移动为主。**

当前目录：

```text
assets/scripts/chance/
├── ChanceCardType.ts
├── ChanceCardData.ts
└── ChanceCardDatabase.ts
```

当前测试卡：

```text
1. Lucky Bonus
   MONEY_GAIN
   +1000

2. Big Prize
   MONEY_GAIN
   +2000

3. Repair Fee
   MONEY_LOSS
   -500

4. Unexpected Expense
   MONEY_LOSS
   -1000

5. Move Forward
   MOVE
   +3

6. Move Backward
   MOVE
   -2
```

随机抽取允许连续重复同一张卡，这是正常行为。

---

# 8. CHANCE 当前完整流程

```text
玩家最终落 CHANCE
↓
TileSystem 输出 Chance 专属日志
↓
从 CHANCE_CARD_DATABASE 随机抽 1 张
↓
根据 ChanceCardType 执行
```

MONEY_GAIN / MONEY_LOSS：

```text
读取 amount
↓
读取 PlayerEconomyData.playerId
↓
EconomySystem.getPlayerById()
↓
记录 moneyBefore
↓
EconomySystem.addMoney() / removeMoney()
↓
输出 moneyBefore -> moneyAfter
↓
nextTurn()
```

MOVE：

```text
TileSystem
→ 保存 pendingChanceMoveSteps
→ 不直接异步移动

GameManager
→ 发现 pending Chance MOVE
→ clear pending
→ PlayerController.moveBySteps(steps)
→ 等移动完成
→ 再次 TileSystem.resolveLanding()
→ 根据新落地点继续处理
```

Chance MOVE 后如果落到：

```text
PROPERTY → 保留 Purchase UI / Turn Pause 语义
TAX      → 正常扣款
START    → 遵守 START 规则
JAIL     → 当前仅通用落地识别
SPECIAL  → 通用落地识别
```

---

# 9. DESTINY 正式定位

用户已确认：

> **DESTINY = 局势型随机事件，影响更大，后续允许加入特殊移动、玩家互动、房产事件和持续效果。**

当前 v0.1 先实现“比 CHANCE 更重”的基础效果，不提前加入复杂状态系统。

当前目录：

```text
assets/scripts/destiny/
├── DestinyCardType.ts
├── DestinyCardData.ts
└── DestinyCardDatabase.ts
```

---

# 10. DESTINY 当前数据层

## DestinyCardType

当前：

```text
MONEY_GAIN
MONEY_LOSS
MOVE
```

## DestinyCardData

当前字段：

```ts
id: number;
title: string;
description: string;
type: DestinyCardType;
amount?: number;
moveSteps?: number;
```

## DestinyCardDatabase

当前测试卡 6 张：

```text
1. Great Fortune
   MONEY_GAIN
   +3000

2. Jackpot
   MONEY_GAIN
   +5000

3. Major Setback
   MONEY_LOSS
   -2000

4. Financial Crisis
   MONEY_LOSS
   -3000

5. Destiny Advances
   MOVE
   +5

6. Destiny Reverses
   MOVE
   -4
```

---

# 11. DESTINY 当前完整流程

```text
玩家最终落 DESTINY
↓
TileSystem 输出 Destiny 专属日志
↓
从 DESTINY_CARD_DATABASE 随机抽 1 张
↓
根据 DestinyCardType 执行
```

MONEY_GAIN / MONEY_LOSS：

```text
读取 amount
↓
读取 PlayerEconomyData.playerId
↓
EconomySystem.getPlayerById()
↓
记录 moneyBefore
↓
EconomySystem.addMoney() / removeMoney()
↓
输出 moneyBefore -> moneyAfter
↓
nextTurn()
```

MOVE：

```text
TileSystem
→ 保存 pendingDestinyMoveSteps

GameManager
→ 发现 pending Destiny MOVE
→ clear pending
→ PlayerController.moveBySteps(steps)
→ 等移动动画完成
→ 再次 TileSystem.resolveLanding()
→ 继续处理新落地点
```

---

# 12. DESTINY MOVE 已验证行为

## MOVE FORWARD +5

从：

```text
Tile_03 / Destiny
```

路径：

```text
03
→ 04
→ 05
→ 06
→ 00 START
→ 01 Paris
```

已验证：

```text
Destiny Advances +5                 ✅
经过 START +2000                    ✅
二次落地识别                         ✅
落到 PROPERTY                        ✅
Property Purchase Turn Pause        ✅
PropertyPurchaseUI                  ✅
BUY                                 ✅
Own Property No-Rent                ✅
nextTurn                            ✅
```

## MOVE BACKWARD -4

从：

```text
Tile_03 / Destiny
```

路径：

```text
03
→ 02
→ 01
→ 00
→ 06
```

已验证：

```text
Destiny Reverses -4                 ✅
反向经过 START 不奖励                ✅
最终落 SPECIAL                      ✅
二次落地识别                         ✅
nextTurn                            ✅
```

---

# 13. TileSystem 当前重要职责

`TileSystem.resolveLanding()` 当前已经承担：

```text
通用最终落地识别
CHANCE
DESTINY
PROPERTY Purchase
Rent
TAX
```

当前维护：

```text
pendingProperty
pendingChanceMoveSteps
pendingDestinyMoveSteps
```

重要：

```text
resolveLanding() 返回 true
```

目前仍然只表示：

```text
需要暂停回合，等待 Property Purchase Decision
```

不要改变这个语义。

CHANCE / DESTINY MOVE 只负责登记待移动步数，真正异步移动由 `GameManager` 接管。

---

# 14. GameManager 当前重要职责

当前 `GameManager` 已稳定处理：

```text
骰子
正常玩家移动
移动完成后的 resolveLanding()

Property Purchase Turn Pause
PropertyPurchaseUI
BUY / SKIP 后恢复回合

Chance pending MOVE
Chance 二次移动
Chance MOVE 后再次 resolveLanding()

Destiny pending MOVE
Destiny 二次移动
Destiny MOVE 后再次 resolveLanding()

MOVE 后若落 PROPERTY：
继续保留 Property Purchase Turn Pause / UI 语义

正常 nextTurn()
```

不要因为 JAIL 而重构这些稳定流程。

---

# 15. DESTINY Final Regression — 已通过

本轮已重新验证：

## START Pass

```text
Player_1
15000
→ PASSED START
→ +2000
→ 17000
```

结果：✅

## START Landing

已验证同一回合中：

```text
Player_3
17800
→ PASSED START +2000
→ 19800
→ 最终 LANDED ON START +2000
→ 21800
```

当前规则允许两次奖励。结果：✅

## Property Purchase

```text
Player_1
17000
→ Paris
→ Purchase UI
→ BUY
→ -1600
→ 15400
→ ownerId=0
→ nextTurn
```

结果：✅

## TAX

```text
Player_2
15000
→ TAX
→ -1000
→ 14000
→ nextTurn
```

结果：✅

## Rent

```text
Player_3
17000
→ Paris (ownerId=0)
→ -200
→ 16800

Player_1(owner)
15400
→ +200
→ 15600
```

结果：✅

## CHANCE MONEY

```text
Player_4
17000
→ Unexpected Expense
→ -1000
→ 16000
→ nextTurn
```

结果：✅

## CHANCE MOVE

```text
Chance Move Forward +3
→ secondary movement
→ Tile_05 / Jail
→ secondary resolveLanding()
→ nextTurn
```

结果：✅

## DESTINY MONEY

```text
Great Fortune
Player_3
21800
→ +3000
→ 24800
→ nextTurn
```

结果：✅

## DESTINY MOVE

```text
Destiny Advances +5
→ START +2000
→ Paris
→ own property
→ No rent
→ nextTurn
```

以及：

```text
Destiny Reverses -4
→ 反向经过 START 不奖励
→ SPECIAL
→ nextTurn
```

结果：✅

---

# 16. 已知非阻塞问题

浏览器预览偶尔出现类似：

```text
Uncaught (in promise) Error:
A listener indicated an asynchronous response by returning true,
but the message channel closed before a response was received
```

当前观察：

- 该错误出现后游戏逻辑仍继续运行。
- Property BUY、资金变化、ownerId 更新、nextTurn 都没有被阻断。
- 当前不把它视为 Monopoly3D 核心逻辑失败。
- 不要为了这个报错随意修改稳定游戏代码。
- 如果后续要排查，单独作为浏览器/扩展/Preview 环境问题处理。

---

# 17. 当前尚未实现

```text
Jail Logic
Jail UI

Chance UI
Destiny UI
Rent UI
TAX UI

Bankruptcy
Victory Condition
Save / Load

正式完整棋盘
正式 3D 建筑资产
更完整的房产系统
更丰富的 Destiny：
  - 特殊移动
  - 玩家互动
  - 房产事件
  - 持续效果
```

---

# 18. 下一核心阶段：JAIL

现在正式进入：

```text
JAIL
```

当前：

```text
Tile_05 → Jail
```

现有 `TileSystem` 已能做通用落地识别，例如：

```text
[TileSystem] Player_X landed on JAIL: Jail
```

目前 Jail 没有任何功能。

---

# 19. JAIL Step 1 — 第一阶段只做这一件事

第一阶段目标：

```text
玩家最终落到 TileType.JAIL
↓
输出专属 JailSystem Console
↓
不进入拘留状态
↓
不跳过回合
↓
不罚款
↓
不弹 UI
↓
正常 nextTurn()
```

希望看到类似：

```text
[TileSystem] Player_X landed on JAIL: Jail
[JailSystem] Player_X landed on JAIL: Jail.
[JailSystem] JAIL detected. No jail effect applied yet.
[TurnManager] Next turn: Player_Y
```

---

# 20. JAIL Step 1 暂时不要做

```text
❌ isInJail
❌ jailTurns
❌ 跳过回合
❌ 骰子限制
❌ 双骰脱狱
❌ 罚款脱狱
❌ Jail Card
❌ Jail UI
❌ Bankruptcy
❌ 任何资金变化
```

JAIL Step 1 验收通过以后，再讨论 Jail 状态数据与规则。

---

# 21. 下一对话开发原则

必须继续遵守：

1. 每次只实现一个很小、可实际运行验收的阶段。
2. 用户是 Cocos Creator 新手，必须明确告诉用户在 Cocos Creator 中点击哪里。
3. 明确告诉用户修改哪个 TypeScript。
4. TypeScript 修改优先提供“完整文件可复制替换版”，不要让用户手动找多个局部片段。
5. 明确告诉用户 Inspector 是否需要设置。
6. 每一步给出正确 Console 预期。
7. 用户发截图后，先检查截图，再进入下一阶段。
8. 严格增量开发。
9. 不为了代码更优雅而重构稳定系统。
10. 所有资金变化必须继续统一经过 `EconomySystem`。
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
    - DESTINY
13. 保持：
    - `resolveLanding() === true` 仍只表示等待 Property Purchase Decision。
    - Chance / Destiny MOVE 继续由 GameManager 接管异步移动。
14. JAIL Step 1 只做专属日志，不提前实现真正 Jail 规则。
15. 当 Jail 成为稳定子系统、准备进入下一个新的核心阶段时，主动提醒切换新对话并制作 handoff，不要等用户主动询问。

---

# 22. 新对话第一任务

从：

```text
JAIL Step 1
```

开始。

开始写代码前：

1. 完整阅读本 handoff。
2. 把本 handoff 作为当前项目唯一真实基线。
3. 判断 JAIL Step 1 的最小修改点。
4. 如果需要当前最新版 `TileSystem.ts`，先让用户上传。
5. 不要根据旧版本猜当前代码。
6. 不要提前实现真正 Jail 状态系统。
7. 不要修改当前已验收的 CHANCE / DESTINY。
8. Step 1 目标只有：

```text
[TileSystem] Player_X landed on JAIL: Jail
[JailSystem] Player_X landed on JAIL: Jail.
[JailSystem] JAIL detected. No jail effect applied yet.
[TurnManager] Next turn: Player_Y
```

---

# 23. 当前稳定基线结论

截至本交接：

```text
Movement / Turn Loop      ✅
Economy                   ✅
Property Purchase         ✅
Rent                      ✅
START                     ✅
TAX                       ✅
CHANCE                    ✅
DESTINY                   ✅
Legacy Final Regression   ✅
```

下一核心阶段：

```text
JAIL
```

不要重新实现或重构已经稳定的系统。

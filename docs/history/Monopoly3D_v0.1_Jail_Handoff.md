# Monopoly3D v0.1 — JAIL 完成阶段交接存档

> 项目：微信小游戏 3D 大富翁  
> 引擎：Cocos Creator 3.8.8  
> 当前阶段：v0.1 Core Prototype  
> 交接日期：2026-09-22  
> 本文用途：作为下一对话的唯一真实基线。  
> 当前结论：JAIL 核心规则已经完成并实际运行通过；建议新对话先做一次 JAIL Final Regression，再进入下一个核心阶段。

---

# 1. 当前已完成并验收的核心系统

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
Property Purchase                          ✅
PropertyPurchaseUI                         ✅
BUY / SKIP                                 ✅
Rent System                                ✅

START Pass / Landing Reward                ✅
TAX                                        ✅

CHANCE Core                                ✅
- Random Draw
- MONEY_GAIN
- MONEY_LOSS
- MOVE FORWARD
- MOVE BACKWARD
- MOVE secondary landing

DESTINY Core                               ✅
- Random Draw
- MONEY_GAIN
- MONEY_LOSS
- MOVE FORWARD
- MOVE BACKWARD
- MOVE secondary landing

JAIL Core                                  ✅
- Landing Detection
- PlayerJailData
- Enter Jail State
- Skip Next Turn
- jailTurns
- Auto Release
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

当前 START 规则：

```text
经过 START：+2000
最终停在 START：+2000
向后经过 START 但最终不停 START：不奖励
游戏开局站在 START：不奖励
```

由于测试棋盘只有 7 格，同一正常正向移动可能多次经过 START，因此可能多次获得 +2000；这是当前已确认规则，不是 Bug。

---

# 3. 当前稳定经济规则

新 Preview 初始资金：

```text
Player_1 → playerId 0 → 15000
Player_2 → playerId 1 → 15000
Player_3 → playerId 2 → 15000
Player_4 → playerId 3 → 15000
```

所有资金变化继续统一经过 `EconomySystem`：

```text
getPlayerById()
addMoney()
removeMoney()
```

禁止直接修改：

```ts
player.money += amount;
player.money -= amount;
```

---

# 4. Property / Rent 当前规则

Paris：

```text
id       = 1
name     = Paris
type     = PROPERTY
price    = 1600
baseRent = 200
ownerId  = null（新 Preview）
```

Property Purchase：

```text
无人 PROPERTY
→ 检查余额
→ pendingProperty
→ resolveLanding() 返回 true
→ GameManager 暂停回合
→ PropertyPurchaseUI
→ BUY / SKIP
```

Rent：

```text
自己的 PROPERTY
→ No rent
→ nextTurn()

别人的 PROPERTY
→ payer removeMoney(baseRent)
→ owner addMoney(baseRent)
→ nextTurn()
```

非常重要：

```text
TileSystem.resolveLanding() === true
```

目前仍然只表示：

```text
等待 Property Purchase Decision
```

不要改变这个语义。

---

# 5. CHANCE / DESTINY 当前稳定架构

CHANCE 定位：

> 即时型随机事件，以小额资金变化和短距离移动为主。

DESTINY 定位：

> 局势型随机事件，影响更大；后续允许加入特殊移动、玩家互动、房产事件和持续效果。

CHANCE / DESTINY MOVE 都保持：

```text
TileSystem
→ 只登记 pending move

GameManager
→ 接管异步移动
→ PlayerController.moveBySteps()
→ 等待动画完成
→ 再次 TileSystem.resolveLanding()
```

不要把异步移动直接塞回 TileSystem。

---

# 6. JAIL 当前正式规则

用户已确认 v0.1 使用简化规则：

```text
玩家最终停到 JAIL
→ isInJail = true
→ jailTurns = 0

下一次轮到该玩家
→ 跳过 1 回合
→ jailTurns: 0 → 1
→ 自动释放
→ isInJail = false
→ jailTurns = 0
→ 继续下一位玩家
```

当前 v0.1 明确不实现：

```text
❌ 双骰脱狱
❌ 罚款脱狱
❌ Jail Card
❌ Jail UI
❌ 多回合拘留
❌ 3 回合限制
```

---

# 7. JAIL 实现结构

## 7.1 PlayerJailData.ts

新增独立组件：

```text
assets/scripts/jail/PlayerJailData.ts
```

字段：

```ts
isInJail: boolean = false;
jailTurns: number = 0;
```

四个 Player 均已挂载：

```text
Player_1
Player_2
Player_3
Player_4
```

初始：

```text
isInJail = false
jailTurns = 0
```

不要把这些字段塞进 `PlayerEconomyData.ts`。

---

## 7.2 TileSystem.ts

玩家最终落到 `TileType.JAIL` 后：

```text
取得 PlayerJailData
→ isInJail = true
→ jailTurns = 0
→ 输出 JailSystem 日志
→ return false
→ 正常 nextTurn()
```

已实际看到：

```text
[JailSystem] Player_1 entered JAIL.
[JailSystem] State updated: isInJail=true, jailTurns=0.
```

JAIL 不改变 `resolveLanding() === true` 的语义。

---

## 7.3 TurnManager.ts

`nextTurn()` 当前会检查下一名玩家是否处于 Jail。

如果：

```text
playerJailData.isInJail === true
```

则：

```text
jailTurns += 1
→ 输出 skip 日志
→ isInJail = false
→ jailTurns = 0
→ 自动释放
→ 再次 nextTurn()
```

因此：

```text
被关玩家不会掷骰
→ 自动跳过一次
→ 继续寻找下一位可行动玩家
```

当前逻辑也可以处理连续多个 Jail 玩家。

---

# 8. JAIL 已实际验收结果

已经实际运行确认：

## 正常落地进入 Jail

```text
[TileSystem] Player_1 landed on JAIL: Jail
[JailSystem] Player_1 landed on JAIL: Jail.
[JailSystem] Player_1 entered JAIL.
[JailSystem] State updated: isInJail=true, jailTurns=0.
[TurnManager] Next turn: Player_2
```

结果：✅

## 下一次自己的回合被跳过并自动释放

已实际运行确认：

```text
[JailSystem] Player_1 skips this turn because they are in JAIL.
[JailSystem] Player_1 jailTurns = 1.
[JailSystem] Player_1 served 1 skipped turn and is now released from JAIL.
[JailSystem] State updated: isInJail=false, jailTurns=0.
[TurnManager] Next turn: Player_2
```

结果：✅

确认：

```text
没有 DiceSystem Roll              ✅
jailTurns 0 → 1                   ✅
跳过一次                          ✅
自动释放                          ✅
isInJail → false                 ✅
jailTurns → 0                    ✅
正常继续下一位玩家                ✅
```

---

# 9. 已做过的同步回归

加入完整 Jail 规则以后，已经看到以下旧系统继续正常：

```text
START reward                      ✅
TAX                               ✅
PROPERTY                          ✅
Rent                              ✅
EconomySystem                     ✅
TurnManager                       ✅
```

---

# 10. 新对话第一任务：JAIL Final Regression

在正式把 JAIL 标记为稳定子系统之前，建议新对话先做一次最后回归。

只测试，不改代码。

## Test A — Normal Jail

已经通过，可视为基线：

```text
正常骰子落 JAIL
→ isInJail=true
→ 下一次自己的回合跳过
→ 自动释放
```

## Test B — CHANCE MOVE → JAIL

重点重新验证：

```text
CHANCE
→ MOVE
→ secondary landing = JAIL
→ isInJail=true
→ 后续下一次自己的回合被跳过
→ 自动释放
```

原因：

此前 `CHANCE MOVE → JAIL` 的二次落地曾验证过，
但那是在完整 Jail 状态 + Skip Turn 逻辑加入之前。

现在需要重新确认完整链路。

## Test C — Released player can act again

验证：

```text
玩家 Jail 自动释放
→ 再等一整轮
→ 再次轮到该玩家
→ DiceSystem 正常 Roll
→ PlayerController 正常移动
```

如果 B + C 均通过：

```text
JAIL v0.1 Stable ✅
```

然后再进入下一个核心阶段。

---

# 11. 下一核心阶段建议

当前测试棋盘仍存在：

```text
Tile_06 → Special
```

因此 JAIL Final Regression 通过以后，最自然的下一核心阶段是：

```text
SPECIAL
```

但不要直接设计复杂 Special 规则。

建议先从：

```text
SPECIAL Step 1
```

开始，只实现：

```text
玩家最终落到 TileType.SPECIAL
→ 输出专属 SpecialSystem Console
→ 不产生实际效果
→ 正常 nextTurn()
```

类似：

```text
[TileSystem] Player_X landed on SPECIAL: Special
[SpecialSystem] Player_X landed on SPECIAL: Special.
[SpecialSystem] SPECIAL detected. No special effect applied yet.
[TurnManager] Next turn: Player_Y
```

等 Step 1 验收通过以后，再讨论 Special 的正式定位与规则。

---

# 12. 开发原则

下一对话必须继续遵守：

1. 每次只实现一个很小、可以实际运行验收的阶段。
2. 用户是 Cocos Creator 新手，必须明确说明在 Cocos Creator 里点哪里。
3. 明确说明修改哪个 TypeScript。
4. TypeScript 修改优先给“完整文件可复制替换版”。
5. 明确说明 Inspector 是否需要设置。
6. 每一步都给正确 Console 预期。
7. 用户发截图后，先检查截图，再进入下一阶段。
8. 严格增量开发，不为了代码更优雅而重构稳定系统。
9. 不要破坏：
   - DiceSystem
   - PlayerController
   - BoardManager
   - TurnManager
   - EconomySystem
   - Property Purchase
   - PropertyPurchaseUI
   - Rent
   - START
   - TAX
   - CHANCE
   - DESTINY
   - JAIL
10. 所有资金变化继续统一经过 EconomySystem。
11. `resolveLanding() === true` 继续只表示等待 Property Purchase Decision。
12. CHANCE / DESTINY MOVE 继续由 GameManager 接管异步移动。
13. 如果需要当前最新实际代码，先让用户上传对应 TypeScript，不根据旧版本猜。
14. 不要提前实现 Bankruptcy、Victory、Save / Load。
15. 当下一个核心子系统稳定并准备进入新的架构边界时，主动提醒用户切换新对话并制作新的 handoff。

---

# 13. 当前尚未实现

```text
SPECIAL 正式逻辑

Chance UI
Destiny UI
Rent UI
TAX UI
Jail UI（v0.1 暂不做）

Bankruptcy
Victory Condition
Save / Load

正式完整棋盘
正式 3D 建筑资产
更完整 Property System
更丰富 Destiny Effects
```

---

# 14. 当前稳定基线结论

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
JAIL Core                 ✅
```

新对话第一件事：

```text
JAIL Final Regression
```

通过后：

```text
JAIL v0.1 Stable ✅
→ SPECIAL Step 1
```

不要重新实现或重构已经稳定的系统。

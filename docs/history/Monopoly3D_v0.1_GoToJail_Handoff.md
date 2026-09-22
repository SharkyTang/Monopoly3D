# Monopoly3D v0.1 — GO_TO_JAIL 完成阶段交接存档

> 项目：微信小游戏 3D 大富翁  
> 引擎：Cocos Creator 3.8.8  
> 当前阶段：v0.1 Core Prototype  
> 交接日期：2026-09-22  
> 本文用途：作为下一对话的当前真实基线。  
> 当前结论：JAIL v0.1、SPECIAL Airport / Transport v0.1、GO_TO_JAIL v0.1 均已完成核心逻辑并通过实际回归测试。下一阶段进入 `FREE_PARKING Step 1`。

---

# 1. 当前已完成并验收的核心系统

```text
Core Movement / Turn Loop                  ✅ Stable
DiceSystem                                 ✅
PlayerController                           ✅
BoardManager                               ✅
TurnManager                                ✅

TileType / TileData / TileDatabase         ✅
TileSystem Landing Recognition             ✅

Player Economy Data                        ✅
EconomySystem                              ✅

Property Purchase                          ✅
PropertyPurchaseUI                         ✅
BUY / SKIP                                 ✅
Rent System                                ✅

START                                      ✅
TAX                                        ✅

CHANCE Core                                ✅
- MONEY_GAIN
- MONEY_LOSS
- MOVE FORWARD
- MOVE BACKWARD
- secondary landing

DESTINY Core                               ✅
- MONEY_GAIN
- MONEY_LOSS
- MOVE FORWARD
- MOVE BACKWARD
- secondary landing

JAIL v0.1                                  ✅ Stable
- Landing Detection
- Enter Jail State
- Skip Next Turn
- jailTurns
- Auto Release

SPECIAL Airport / Transport v0.1           ✅ Stable
- SPECIAL detection
- SpecialType.TRANSPORT
- Airport decision pause
- Stay Here
- Travel fee
- Transport movement
- No START reward during Airport Transport
- secondary landing
- Property Purchase integration
- Rent integration

GO_TO_JAIL v0.1                            ✅ Stable
- Landing Detection
- Forced Move queue
- GameManager async control
- Direct move to JAIL
- No START reward during Forced Move
- Existing JAIL system reuse
- Skip next own turn
- Auto release
```

---

# 2. 当前灰盒测试棋盘

当前测试棋盘共 8 格：

```text
Tile_00 → START
Tile_01 → Paris / PROPERTY
Tile_02 → CHANCE
Tile_03 → DESTINY
Tile_04 → TAX
Tile_05 → JAIL
Tile_06 → Airport / SPECIAL / TRANSPORT
Tile_07 → GO_TO_JAIL
```

这是灰盒测试棋盘，不是正式完整棋盘。

`BoardManager` 当前 Tiles 数组顺序必须保持：

```text
[0] → Tile_00
[1] → Tile_01
[2] → Tile_02
[3] → Tile_03
[4] → Tile_04
[5] → Tile_05
[6] → Tile_06
[7] → Tile_07
```

不要为了下一功能随意打乱现有格子顺序。

---

# 3. 当前稳定经济规则

所有资金变化必须继续统一经过 `EconomySystem`：

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

当前固定数值：

```text
START reward = +2000
TAX = -1000
Airport travelCost = -500
Paris price = 1600
Paris baseRent = 200
```

---

# 4. START 当前稳定规则

```text
经过 START：+2000
最终停在 START：+2000
向后经过 START 但最终不停 START：不奖励
游戏开局站在 START：不奖励
```

当前测试棋盘较短，因此普通正向移动可能一次 Roll 多次经过 START；当前逻辑允许每次正常经过都奖励。

非常重要：

```text
Airport / Transport movement
→ 不属于普通逐格移动
→ 不触发 START pass reward
→ 不触发 START landing reward

GO_TO_JAIL Forced Move
→ 不属于普通逐格移动
→ 不触发 START pass reward
→ 不触发 START landing reward
```

---

# 5. Property / Rent 当前稳定规则

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
无主 PROPERTY
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

当前仍然只表示：

```text
等待 Property Purchase Decision
```

不要让 FREE_PARKING、Airport、GO_TO_JAIL 或其他新系统复用这个 `true` 语义。

---

# 6. CHANCE / DESTINY 当前稳定架构

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

当前已实际验证：

```text
DESTINY MOVE BACKWARD
→ secondary landing = GO_TO_JAIL
→ Forced Move to JAIL
→ Jail state
```

链路正常。

---

# 7. JAIL v0.1 正式规则

当前锁定规则：

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

当前明确不实现：

```text
❌ 双骰脱狱
❌ 罚款脱狱
❌ Jail Card
❌ Jail UI
❌ 多回合拘留
❌ 3 回合限制
```

---

# 8. SPECIAL Airport / Transport v0.1 正式规则

SPECIAL 第一版定位：

```text
SPECIAL = Airport / Transport
```

职责：

```text
CHANCE
= 小型即时随机事件

DESTINY
= 更强的局势型随机事件

SPECIAL
= 固定地图功能设施
= Airport / Transport
= 玩家主动选择是否旅行
```

当前 Airport：

```text
Tile_06
name = Airport
type = SPECIAL
specialType = TRANSPORT
travelCost = 500
destinationTileIndices = [1]
```

当前测试目的地：

```text
Paris / Tile_01
```

Transport 使用独立移动入口：

```text
PlayerController.moveToTileForTransport()
```

Transport 不逐格经过棋盘，不触发 START 奖励。

完成后再次 `resolveLanding()`，因此已验证：

```text
Airport → Unowned Property → Purchase ✅
Airport → Other Player Property → Rent ✅
Airport → Own Property → No Rent ✅
Stay Here ✅
```

---

# 9. GO_TO_JAIL v0.1 正式规则

当前 `Tile_07`：

```text
name = Go To Jail
type = GO_TO_JAIL
```

最终完整流程：

```text
玩家最终落到 GO_TO_JAIL
→ TileSystem 识别 GO_TO_JAIL
→ 登记 pending forced move
→ 目标自动指向当前 JAIL Tile（Tile_05）
→ GameManager 接管异步移动
→ PlayerController.moveToTileForForcedMove()
→ Tile_07 直接移动到 Tile_05
→ 不逐格经过棋盘
→ 不触发 START pass / landing reward
→ Forced Move 完成
→ GameManager 再调用现有 TileSystem.resolveLanding(player)
→ TileSystem 识别当前 Tile_05 = JAIL
→ 复用现有 JAIL 状态逻辑
→ isInJail = true
→ jailTurns = 0
→ nextTurn()

下一次轮到该玩家
→ 跳过 1 回合
→ jailTurns = 1
→ 自动释放
→ isInJail = false
→ jailTurns = 0
```

重要职责边界：

```text
普通 Dice / Chance / Destiny
→ moveBySteps()

Airport Transport
→ moveToTileForTransport()

GO_TO_JAIL
→ moveToTileForForcedMove()
```

不要为了“代码统一”把三种移动强行合并。

---

# 10. GO_TO_JAIL 已通过实际测试

## Test A — Step 1 Detection

```text
玩家落到 Tile_07
→ GO_TO_JAIL 正确识别
→ 不移动
→ 不入狱
→ 正常 nextTurn()
```

结果：

```text
✅
```

## Test B — Forced Move

```text
玩家落到 Tile_07
→ Forced Move queued
→ Tile_07 → Tile_05
→ 不触发 START reward
→ 暂不入狱
→ 正常 nextTurn()
```

结果：

```text
✅
```

## Test C — Full Jail Integration

实际验证链路：

```text
DESTINY MOVE BACKWARD
→ Tile_07 / GO_TO_JAIL
→ Forced Move Tile_07 → Tile_05
→ No START reward
→ resolve JAIL landing
→ isInJail=true
→ jailTurns=0
→ nextTurn
```

下一轮：

```text
Player_X skips this turn because they are in JAIL
→ jailTurns = 1
→ Auto Release
→ isInJail=false
→ jailTurns=0
```

结果：

```text
✅
```

正式状态：

```text
GO_TO_JAIL v0.1 Stable ✅
```

---

# 11. 一个非功能性清理项

当前 `TileSystem` 中可能仍保留 Step 2 临时 Console：

```text
[GoToJailSystem] Step 2 only: forced movement is queued,
but Jail state will not be changed yet.
```

现在 GO_TO_JAIL 已经会在 Forced Move 到达后进入 JAIL，因此这条日志文案已经过时。

后续可安全改成：

```text
[GoToJailSystem] Forced move queued. Jail state will be resolved after arrival.
```

或直接删除该临时日志。

注意：

```text
这只是 Console 文案清理。
不要因为清理文案而重构 GO_TO_JAIL 逻辑。
```

---

# 12. 当前严禁破坏的稳定系统

下一阶段继续严格遵守：

```text
❌ 不重构 DiceSystem
❌ 不重构 PlayerController 普通 movement
❌ 不重构 BoardManager
❌ 不重构 TurnManager
❌ 不重构 EconomySystem
❌ 不重构 Property Purchase
❌ 不重构 Rent
❌ 不重构 START
❌ 不重构 TAX
❌ 不重构 CHANCE
❌ 不重构 DESTINY
❌ 不重构 JAIL
❌ 不重构 SPECIAL Airport / Transport
❌ 不重构 GO_TO_JAIL
```

---

# 13. 下一核心阶段：FREE_PARKING

当前建议进入：

```text
FREE_PARKING Step 1
```

第一阶段只实现：

```text
玩家最终落到 FREE_PARKING
→ TileSystem 正确识别
→ 输出专属 FreeParkingSystem Console
→ 暂时没有资金效果
→ 暂时没有特殊奖励
→ 不弹 UI
→ 正常 nextTurn()
```

当前先不要实现：

```text
❌ TAX / 罚款资金池
❌ Jackpot
❌ 随机奖励
❌ 回血 / 加钱
❌ 停留奖励
❌ UI
❌ 音效
❌ 动画
```

FREE_PARKING v0.1 第一阶段先把它当作“无效果功能格”处理。

---

# 14. FREE_PARKING 开发方式

继续采用严格增量开发：

1. 每次只实现一个很小、可以实际运行验收的阶段。
2. 用户是 Cocos Creator 新手，要明确说明在 Cocos Creator 里点哪里。
3. 明确说明修改哪个 TypeScript。
4. TypeScript 修改优先提供“完整文件可复制替换版”。
5. 明确说明 Inspector 是否需要修改。
6. 每一步给正确 Console 预期。
7. 用户发截图后，先检查截图，再进入下一阶段。
8. 不为了代码更优雅而重构稳定系统。
9. 所有资金变化必须经过 EconomySystem。
10. `TileSystem.resolveLanding() === true` 继续只表示等待 Property Purchase Decision。
11. CHANCE / DESTINY MOVE 继续由 GameManager 接管异步移动。
12. Airport Transport 继续使用独立 Transport movement。
13. GO_TO_JAIL 继续使用独立 Forced Move。
14. 如果需要当前最新实际代码，先让用户上传对应 TypeScript，不根据旧版本猜。
15. 不提前实现 Bankruptcy、Victory、Save / Load。
16. 当 FREE_PARKING 成为稳定子系统并准备进入下一核心架构边界时，主动提醒切换新对话并整理新的 handoff。

---

# 15. 推荐下一阶段顺序

```text
1. FREE_PARKING Step 1
2. FREE_PARKING v0.1 Stable
3. Tile 类型补全
4. Board v0.2 — Full Board Foundation
5. 8 格灰盒棋盘 → 28～32 格正式棋盘
6. 世界地标 Property 配置
7. 正式 3D 地图与建筑资产
```

---

# 16. 新对话执行提示词

请把本文件作为当前项目真实基线，并严格按照下面要求继续：

```text
请先完整阅读我上传的 `Monopoly3D_v0.1_GoToJail_Handoff.md`，
并把它作为当前项目的真实基线。

我正在使用 Cocos Creator 3.8.8 从零制作准备发布到微信小游戏的 3D 大富翁。

当前已经稳定：

Movement / Turn Loop ✅
Economy ✅
Property Purchase ✅
Rent ✅
START ✅
TAX ✅
CHANCE ✅
DESTINY ✅
JAIL v0.1 Stable ✅
SPECIAL Airport / Transport v0.1 Stable ✅
GO_TO_JAIL v0.1 Stable ✅

不要重新实现或重构这些已经稳定的系统。

当前 GO_TO_JAIL 正式规则：

- TileType.GO_TO_JAIL 已存在
- 当前灰盒 Tile_07 = GO_TO_JAIL
- 落地后由 TileSystem 登记 pending forced move
- GameManager 接管异步移动
- 使用 PlayerController.moveToTileForForcedMove()
- 直接移动到当前 JAIL Tile（当前 Tile_05）
- Forced Move 不逐格经过棋盘
- Forced Move 不触发 START pass / landing reward
- 到达 JAIL 后复用现有 TileSystem.resolveLanding()
- 进入原有 JAIL 状态：
  isInJail = true
  jailTurns = 0
- 下一次自己的回合跳过 1 回合
- jailTurns 变为 1 后自动释放
- isInJail = false
- jailTurns = 0
- resolveLanding() === true 仍然只表示等待 Property Purchase Decision

下一核心阶段开始：

FREE_PARKING

请继续按照完全新手、一步一步、小阶段实际运行验收的方式教我。

FREE_PARKING Step 1 第一阶段只实现：

玩家最终落到 FREE_PARKING
→ TileSystem 正确识别
→ 输出专属 FreeParkingSystem Console
→ 暂时没有资金效果
→ 暂时没有特殊奖励
→ 不弹 UI
→ 正常 nextTurn()

不要直接实现完整 FREE_PARKING。

开发要求：

- 每次只教一个很小、可以实际运行验收的阶段。
- 明确告诉我 Cocos Creator 里点哪里。
- 明确告诉我修改哪个 TypeScript。
- TypeScript 修改优先给完整文件可复制替换版。
- 明确告诉我 Inspector 是否需要修改。
- 告诉我正确完成后 Console 应该看到什么。
- 我发截图以后，先检查截图，再进入下一阶段。
- 不要为了代码更优雅而重构稳定系统。
- 所有资金变化继续统一经过 EconomySystem。
- resolveLanding() === true 继续只表示等待 Property Purchase Decision。
- CHANCE / DESTINY MOVE 继续由 GameManager 接管异步移动。
- Airport Transport 继续保持独立移动逻辑，不触发 START reward。
- GO_TO_JAIL 继续保持独立 Forced Move 逻辑，不触发 START reward。
- 如果需要查看当前最新实际代码，请让我上传对应 TypeScript，不要根据旧版本猜。
- 当 FREE_PARKING 成为稳定子系统、准备进入下一核心阶段时，请主动提醒我切换新对话并整理新的 handoff。
```

---

# 17. 当前阶段最终结论

截至 2026-09-22：

```text
Movement / Turn Loop                ✅
Economy                             ✅
Property Purchase                   ✅
Rent                                ✅
START                               ✅
TAX                                 ✅
CHANCE                              ✅
DESTINY                             ✅
JAIL v0.1 Stable                    ✅
SPECIAL Airport / Transport v0.1    ✅ Stable
GO_TO_JAIL v0.1                     ✅ Stable
```

下一步：

```text
→ FREE_PARKING Step 1
```

# Monopoly3D v0.1 — SPECIAL Airport / Transport 完成阶段交接存档

> 项目：微信小游戏 3D 大富翁  
> 引擎：Cocos Creator 3.8.8  
> 当前阶段：v0.1 Core Prototype  
> 交接日期：2026-09-22  
> 本文用途：作为下一对话的当前真实基线。  
> 当前结论：JAIL v0.1 与 SPECIAL Airport / Transport v0.1 均已完成核心逻辑并通过实际回归测试。下一阶段建议进入 `GO_TO_JAIL`，之后再做 `FREE_PARKING` 与完整棋盘扩建。

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
- PlayerJailData
- Enter Jail State
- Skip Next Turn
- jailTurns
- Auto Release
- CHANCE MOVE → JAIL regression
- Released player can act again regression

SPECIAL Airport / Transport v0.1           ✅ Stable
- SPECIAL detection
- SpecialType.TRANSPORT
- Airport data
- Airport decision pause
- Airport UI
- Stay Here
- Travel fee
- Transport movement
- No START reward during Airport Transport
- secondary landing
- Property Purchase integration
- Rent integration
- Own Property integration
```

---

# 2. 当前 7 格灰盒测试棋盘

当前仍然是测试棋盘，不是正式完整棋盘：

```text
Tile_00 → Start
Tile_01 → Paris / PROPERTY
Tile_02 → Chance
Tile_03 → Destiny
Tile_04 → Tax
Tile_05 → Jail
Tile_06 → Airport / SPECIAL / TRANSPORT
```

当前 `Tile_06` 已不再只是空 `Special`，而是：

```text
name = Airport
type = TileType.SPECIAL
specialType = SpecialType.TRANSPORT
travelCost = 500
destinationTileIndices = [1]
```

当前测试目的地 `[1]` 仅表示：

```text
Tile_01 → Paris
```

这是灰盒测试配置，不是正式世界地图最终配置。

---

# 3. 当前稳定经济规则

新 Preview 初始资金：

```text
Player_1 → playerId 0 → 15000
Player_2 → playerId 1 → 15000
Player_3 → playerId 2 → 15000
Player_4 → playerId 3 → 15000
```

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

测试棋盘只有 7 格，所以普通正向移动可能一次 Roll 多次经过 START；当前规则允许每次经过都获得 +2000，这不是 Bug。

非常重要：

```text
Airport / Transport movement
→ 不属于普通棋盘移动
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

当前仍然只表示：

```text
等待 Property Purchase Decision
```

不要把 Airport / Transport decision 也塞进这个 `true` 语义里。

---

# 6. CHANCE / DESTINY 当前稳定架构

CHANCE：

> 即时型随机事件，以小额资金变化和短距离移动为主。

DESTINY：

> 局势型随机事件，影响更大；后续可扩展玩家互动、房产事件和持续效果。

MOVE 架构继续保持：

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

JAIL Final Regression 已通过：

```text
正常骰子落 JAIL                                  ✅
CHANCE MOVE → secondary landing = JAIL           ✅
下一次自己的回合跳过                              ✅
自动释放                                         ✅
释放后再等一整轮可正常 Dice Roll / Move           ✅
```

正式状态：

```text
JAIL v0.1 Stable ✅
```

---

# 8. SPECIAL 正式定位

SPECIAL 第一版已经正式锁定为：

```text
SPECIAL v0.1 = AIRPORT / TRANSPORT
```

职责边界：

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

SPECIAL 不作为第三套随机卡系统。

第一版只做 Transport，不做：

```text
❌ Bank
❌ Shop
❌ MiniGame
❌ Random Card
❌ 随机加钱 / 扣钱
```

---

# 9. SPECIAL / Airport 当前数据结构

新增：

```text
SpecialType.ts
```

当前：

```ts
export enum SpecialType {
    TRANSPORT = 'TRANSPORT'
}
```

TileData 已支持：

```text
specialType
travelCost
destinationTileIndices
```

当前 Airport：

```text
name = Airport
type = SPECIAL
specialType = TRANSPORT
travelCost = 500
destinationTileIndices = [1]
```

---

# 10. Airport v0.1 正式规则

## 10.1 玩家落到 Airport

```text
玩家最终落到 Tile_06 Airport
→ TileSystem 识别 SPECIAL
→ 读取 SpecialType.TRANSPORT
→ 读取 travelCost
→ 读取 destinationTileIndices
→ 建立 pendingTransportDecision
→ GameManager 检测 Airport decision
→ 当前回合暂停
→ AirportPanel 自动打开
```

Airport decision 不使用：

```text
resolveLanding() === true
```

而是独立：

```text
pendingTransportDecision
```

---

## 10.2 Stay Here

```text
玩家点击 Stay Here
→ 不扣钱
→ 不移动
→ clearPendingTransportDecision()
→ AirportPanel 关闭
→ 普通 UI 恢复
→ nextTurn()
```

已实际运行通过：

```text
[GameManager] Player_X chose Stay Here at Airport.
[SpecialSystem] Pending Transport decision cleared.
[TurnManager] Next turn: Player_Y
[GameManager] Airport Stay Here completed. Turn resumed.
```

状态：

```text
Stay Here ✅
```

---

## 10.3 Travel

当前灰盒版本只有一个目的地：

```text
Paris / Tile_01
```

点击：

```text
Travel to Paris
```

流程：

```text
检查 pendingTransportDecision
→ 检查 destinationTileIndices
→ 检查玩家余额
→ EconomySystem.removeMoney(500)
→ clearPendingTransportDecision()
→ AirportPanel 关闭
→ PlayerController.moveToTileForTransport()
→ 直接到目标格
→ 不触发 START reward
→ 再次 TileSystem.resolveLanding()
```

---

# 11. Transport Movement 架构

不要使用普通 `moveBySteps()` 来做机场传送。

当前已经新增独立 Transport 移动入口：

```text
PlayerController.moveToTileForTransport(...)
```

职责：

```text
普通 Dice / Chance / Destiny
→ moveBySteps()
→ 正常经过格子
→ START 规则正常生效

Airport Transport
→ moveToTileForTransport()
→ 直接到目标 Tile
→ 不逐格经过 START
→ 不触发 START reward
```

当前 Console 已实际看到：

```text
[TransportSystem] Player_X transport started: Tile_06 -> Tile_01.
[TransportSystem] Airport travel does not trigger START pass / landing reward.
[TransportSystem] Player_X arrived at Tile_01.
```

---

# 12. Airport UI 当前结构

Hierarchy 当前类似：

```text
Canvas
├── RollDiceButton
├── DiceResultLabel
├── TurnLabel
├── PropertyPurchasePanel
│   ├── PropertyNameLabel
│   ├── PriceLabel
│   ├── BuyButton
│   └── SkipButton
│
└── AirportPanel
    ├── AirportTitle
    ├── TravelCostLabel
    ├── DestinationLabel
    ├── TravelButton
    │   └── Label
    └── StayHereButton
        └── Label
```

当前显示内容：

```text
AIRPORT
Travel Cost: 500
Destination: Paris

[ Travel to Paris ]
[ Stay Here ]
```

当前 `AirportPanel`：

```text
UITransform
Width  = 620
Height = 500
Anchor = 0.5 / 0.5
Position = 0 / 0 / 0
```

`AirportPanel` 自己的 `cc.Sprite` 当前保持禁用：

```text
cc.Sprite ❌ disabled
```

原因：当前 `default_sprite` 会形成不需要的巨大默认背景。

后续正式做 UI 美术时，建议：

```text
AirportPanel
├── Background
├── AirportTitle
├── ...
```

让 `AirportPanel` 只负责整体显示/隐藏，`Background` 单独负责视觉背景。

---

# 13. Airport UI 当前自动显示 / 隐藏行为

GameManager 已有：

```text
airportPanel
```

Inspector 中已将：

```text
Canvas/AirportPanel
```

拖入 GameManager 的 `Airport Panel` 字段。

游戏启动：

```text
AirportPanel = hidden
```

普通回合：

```text
TurnLabel visible
DiceResultLabel visible
RollDiceButton visible
```

玩家落 Airport：

```text
AirportPanel visible
RollDiceButton hidden
DiceResultLabel hidden
TurnLabel hidden
```

点击 Stay Here 或完成 Travel 后：

```text
AirportPanel hidden
普通 UI 恢复
```

---

# 14. Airport Button Click Event

## StayHereButton

Inspector：

```text
Button
→ Click Events
```

当前：

```text
Node      = 挂有 GameManager Component 的节点
Component = GameManager
Handler   = onStayHereAtAirport
```

## TravelButton

当前：

```text
Node      = 挂有 GameManager Component 的节点
Component = GameManager
Handler   = onTravelToAirportDestination
```

---

# 15. Airport Final Regression — 已全部通过

## Test A — Stay Here

```text
Airport
→ Stay Here
→ 不扣钱
→ 不移动
→ pending Transport 清除
→ UI 关闭
→ nextTurn()
```

结果：

```text
✅
```

---

## Test B — Airport → Unowned Property

实际运行：

```text
Player_4
→ Airport
→ Travel fee 500
→ 15000 → 14500
→ Transport Tile_06 → Tile_01
→ 不触发 START reward
→ Paris 无主
→ Property Purchase UI
→ 买下 Paris 1600
→ 14500 → 12900
→ Paris ownerId = 3
→ nextTurn()
```

结果：

```text
✅
```

---

## Test C — Airport → Other Player Property

实际运行：

```text
Player_1
→ Airport
→ Travel fee 500
→ 17000 → 16500
→ Transport to Paris
→ Paris ownerId = 3
→ Player_1 支付 rent 200
→ Player_1: 16500 → 16300
→ Player_4: 12900 → 13100
→ nextTurn()
```

结果：

```text
✅
```

---

## Test D — Airport → Own Property

实际运行：

```text
Player_4
→ Airport
→ Travel fee 500
→ 13100 → 12600
→ Transport to Paris
→ Paris ownerId = 3
→ 当前 Player_4 playerId = 3
→ own property
→ No rent required
→ 不弹 BUY / SKIP
→ nextTurn: Player_1
```

实际 Console：

```text
[TileSystem] Paris is owned by playerId=3.
[RentSystem] Player_4 landed on their own property Paris. No rent required.
[TurnManager] Next turn: Player_1
```

结果：

```text
✅
```

---

# 16. SPECIAL 当前正式稳定结论

```text
SPECIAL Detection                         ✅
SpecialType.TRANSPORT                     ✅
Airport Data                              ✅
Travel Cost                               ✅
Pending Transport Decision                ✅
Turn Pause                                ✅
AirportPanel                              ✅
Stay Here                                 ✅
Travel to Paris                           ✅
EconomySystem Integration                 ✅
No START Reward During Transport          ✅
Transport Secondary Landing               ✅
Unowned Property → Purchase               ✅
Other Property → Rent                     ✅
Own Property → No Rent                    ✅
Turn Resume                               ✅
```

正式状态：

```text
SPECIAL Airport / Transport v0.1 Stable ✅
```

---

# 17. 当前尚未实现的 Airport 功能

当前 v0.1 故意不实现：

```text
❌ 多目的地选择 UI
❌ London / Tokyo / Dubai / New York 等正式目的地
❌ Airport Destination 列表滚动 / 卡片
❌ 玩家余额不足专属 UI
❌ Current Location 禁用展示
❌ 正式 Airport 美术
❌ Transport 动画 / 飞机动画
❌ Airport 音效
❌ 不同地图不同 Transport 类型
```

当前测试只使用：

```text
Paris / Tile_01
```

以后正式完整棋盘再扩展。

---

# 18. 下一阶段建议

SPECIAL 已成为稳定子系统。

现在建议切换新对话，进入新的核心架构边界。

建议顺序：

```text
1. GO_TO_JAIL
2. FREE_PARKING
3. Tile 类型补全
4. Board v0.2 — Full Board Foundation
5. 7 格灰盒棋盘 → 28～32 格正式棋盘
6. 世界地标 Property 配置
7. 正式 3D 地图与建筑资产
```

---

# 19. 下一阶段：GO_TO_JAIL

不要一次实现完整逻辑。

先做：

```text
GO_TO_JAIL Step 1
```

第一阶段只实现：

```text
玩家最终落到 GO_TO_JAIL
→ TileSystem 正确识别
→ 输出专属 Console
→ 暂时不强制移动
→ 不触发 JAIL
→ 正常 nextTurn()
```

Step 1 验收通过后，再逐步实现：

```text
GO_TO_JAIL
→ 强制移动到 JAIL
→ Transport / Forced Move 不触发沿途格子
→ 不获得 START reward
→ 到达 JAIL
→ isInJail = true
→ jailTurns = 0
→ 下一次自己的回合跳过
→ 自动释放
```

应尽量复用已经稳定的 JAIL 状态系统，不要重新写第二套监狱状态。

---

# 20. 开发原则

下一对话继续严格遵守：

1. 每次只实现一个很小、可以实际运行验收的阶段。
2. 用户是 Cocos Creator 新手，必须明确说明在 Cocos Creator 里点哪里。
3. 明确说明修改哪个 TypeScript。
4. TypeScript 修改优先提供“完整文件可复制替换版”。
5. 明确说明 Inspector 是否需要设置。
6. 每一步给正确 Console 预期。
7. 用户发截图以后，先检查截图，再进入下一阶段。
8. 严格增量开发，不为了代码更优雅而重构稳定系统。
9. 不破坏：
   - DiceSystem
   - PlayerController 普通 movement
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
   - SPECIAL Airport / Transport
10. 所有资金变化必须经过 EconomySystem。
11. `TileSystem.resolveLanding() === true` 仍只表示等待 Property Purchase Decision。
12. CHANCE / DESTINY MOVE 继续由 GameManager 接管异步移动。
13. Airport Transport 继续使用独立 Transport movement，不触发 START reward。
14. 如果需要当前最新实际代码，先让用户上传对应 TypeScript，不根据旧版本猜。
15. 不提前实现 Bankruptcy、Victory、Save / Load。
16. 当下一个稳定子系统完成并准备进入新的架构边界时，主动提醒切换新对话并整理 handoff。

---

# 21. 新对话执行提示词

请把本文件作为当前项目真实基线，并严格按照下面要求继续：

```text
请先完整阅读我上传的 `Monopoly3D_v0.1_Special_Airport_Handoff.md`，
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

不要重新实现或重构这些已经稳定的系统。

下一核心阶段开始：

GO_TO_JAIL

请继续按照完全新手、一步一步、小阶段实际运行验收的方式教我。

GO_TO_JAIL Step 1 第一阶段只实现：

玩家最终落到 GO_TO_JAIL
→ TileSystem 正确识别
→ 输出专属 GoToJailSystem Console
→ 暂时不强制移动
→ 暂时不触发 JAIL
→ 不扣钱
→ 不弹 UI
→ 正常 nextTurn()

不要直接实现完整 GO_TO_JAIL。

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
- `TileSystem.resolveLanding() === true` 继续只表示等待 Property Purchase Decision。
- CHANCE / DESTINY MOVE 继续由 GameManager 接管异步移动。
- Airport Transport 继续保持独立移动逻辑，不触发 START reward。
- 如果需要查看当前最新实际代码，请让我上传对应 TypeScript，不要根据旧版本猜。
- 当 GO_TO_JAIL 成为稳定子系统、准备进入下一核心阶段时，请主动提醒我切换新对话并整理新的 handoff。
```

---

# 22. 当前阶段最终结论

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
```

下一步：

```text
→ GO_TO_JAIL Step 1
```

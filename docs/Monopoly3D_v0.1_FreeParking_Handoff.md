# Monopoly3D v0.1 — FREE_PARKING 完成阶段交接存档

> 项目：微信小游戏 3D 大富翁  
> 引擎：Cocos Creator 3.8.8  
> 当前阶段：v0.1 Core Prototype  
> 交接日期：2026-09-23  
> 本文用途：作为下一对话框的当前真实基线。  
> 当前结论：`FREE_PARKING v0.1 Stable ✅`，并且此前稳定系统继续保持不变。下一阶段建议进入 **Tile 类型补全 / Board v0.2 — Full Board Foundation**。

---

# 1. 当前已经正式稳定的核心系统

```text
Movement / Turn Loop                  ✅ Stable
DiceSystem                            ✅
PlayerController                      ✅
BoardManager                          ✅
TurnManager                           ✅

TileType / TileData / TileDatabase    ✅
TileSystem Landing Recognition        ✅

Player Economy Data                   ✅
EconomySystem                         ✅

Property Purchase                     ✅
PropertyPurchaseUI                    ✅
BUY / SKIP                            ✅
Rent System                           ✅

START                                 ✅ Stable
TAX                                   ✅ Stable

CHANCE                                ✅ Stable
- MONEY_GAIN
- MONEY_LOSS
- MOVE FORWARD
- MOVE BACKWARD
- secondary landing

DESTINY                               ✅ Stable
- MONEY_GAIN
- MONEY_LOSS
- MOVE FORWARD
- MOVE BACKWARD
- secondary landing

JAIL v0.1                             ✅ Stable
SPECIAL Airport / Transport v0.1      ✅ Stable
GO_TO_JAIL v0.1                       ✅ Stable
FREE_PARKING v0.1                     ✅ Stable
```

---

# 2. 当前灰盒测试棋盘

当前灰盒棋盘已扩展为 **9 格**：

```text
Tile_00 → START
Tile_01 → Paris / PROPERTY
Tile_02 → CHANCE
Tile_03 → DESTINY
Tile_04 → TAX
Tile_05 → JAIL
Tile_06 → Airport / SPECIAL / TRANSPORT
Tile_07 → GO_TO_JAIL
Tile_08 → FREE_PARKING
```

`BoardManager` 当前 `Tiles` 数组：

```text
Size = 9

[0] → Tile_00
[1] → Tile_01
[2] → Tile_02
[3] → Tile_03
[4] → Tile_04
[5] → Tile_05
[6] → Tile_06
[7] → Tile_07
[8] → Tile_08
```

这是当前已经实际在 Cocos Creator Inspector 中确认过的顺序。

不要为了后续功能随意打乱现有格子顺序。

---

# 3. 当前稳定经济规则

所有资金变化继续统一经过：

```text
EconomySystem.getPlayerById()
EconomySystem.addMoney()
EconomySystem.removeMoney()
```

禁止直接修改：

```ts
player.money += amount;
player.money -= amount;
```

当前固定数值：

```text
START reward        = +2000
TAX                  = -1000
Airport travelCost   = -500
Paris price          = 1600
Paris baseRent       = 200
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

重要：

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

# 5. Property Purchase / Rent 当前稳定规则

Paris：

```text
id       = 1
name     = Paris
type     = PROPERTY
price    = 1600
baseRent = 200
ownerId  = null（新 Preview）
```

无主 PROPERTY：

```text
→ 检查余额
→ pendingProperty
→ resolveLanding() 返回 true
→ GameManager 暂停回合
→ PropertyPurchaseUI
→ BUY / SKIP
```

自己的 PROPERTY：

```text
→ No rent
→ nextTurn()
```

别人的 PROPERTY：

```text
→ payer removeMoney(baseRent)
→ owner addMoney(baseRent)
→ nextTurn()
```

非常重要：

```ts
TileSystem.resolveLanding() === true
```

当前仍然 **只表示**：

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

已经验证过的组合链路包括：

```text
DESTINY MOVE BACKWARD
→ secondary landing = GO_TO_JAIL
→ Forced Move to JAIL
→ Jail state
```

---

# 7. JAIL v0.1 正式规则

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

完成后再次 `resolveLanding()`，已经验证：

```text
Airport → Unowned Property → Purchase ✅
Airport → Other Player Property → Rent ✅
Airport → Own Property → No Rent ✅
Stay Here ✅
```

---

# 9. GO_TO_JAIL v0.1 正式规则

当前：

```text
Tile_07
name = Go To Jail
type = GO_TO_JAIL
```

流程：

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

不要为了“统一代码”把三种移动强行合并。

---

# 10. FREE_PARKING v0.1 正式规则

当前新增：

```text
Tile_08
name = Free Parking
type = FREE_PARKING
```

`TileType.ts` 已加入：

```ts
FREE_PARKING = 'FREE_PARKING'
```

`TileDatabase.ts` 已加入：

```ts
{
    id: 8,
    name: 'Free Parking',
    type: TileType.FREE_PARKING
}
```

`TileData.ts` 本阶段 **没有新增字段**。

原因：

```text
FREE_PARKING v0.1
→ 没有金额
→ 没有奖励
→ 没有特殊参数
→ 没有 UI
→ 没有额外移动
```

`TileSystem.ts` 当前 FREE_PARKING 逻辑：

```ts
if (tileData.type === TileType.FREE_PARKING) {

    console.log(
        `[FreeParkingSystem] ${player.node.name} landed on FREE_PARKING: ${tileData.name}.`
    );

    console.log(
        '[FreeParkingSystem] No effect in Step 1. Turn will continue normally.'
    );

    return false;
}
```

正式行为：

```text
玩家最终落到 FREE_PARKING
→ TileSystem 正确识别
→ 输出专属 FreeParkingSystem Console
→ 不加钱
→ 不扣钱
→ 无特殊奖励
→ 不弹 UI
→ 不登记 pending action
→ 不进行额外移动
→ resolveLanding() 返回 false
→ GameManager 走原有正常流程
→ nextTurn()
```

---

# 11. FREE_PARKING 已通过实际测试

实际 Console 验证链路：

```text
[DiceSystem] Rolled 5 + 3 = 8
[GameManager] Player_1 rolled 8

Player_1 正常逐格移动：
Tile_01
Tile_02
Tile_03
Tile_04
Tile_05
Tile_06
Tile_07
Tile_08

[PlayerController] Player_1 movement finished at tile 8
[GameManager] Player_1 movement completed.

[TileSystem] Player_1 landed on FREE_PARKING: Free Parking
[FreeParkingSystem] Player_1 landed on FREE_PARKING: Free Parking.
[FreeParkingSystem] No effect in Step 1. Turn will continue normally.

[TurnManager] Next turn: Player_2
```

验收结果：

```text
FREE_PARKING 识别                         ✅
Tile_08 数据映射                         ✅
专属 FreeParkingSystem Console           ✅
没有资金变化                             ✅
没有特殊奖励                             ✅
没有 UI                                 ✅
没有额外移动                             ✅
没有 pending action                      ✅
resolveLanding() 没有错误暂停回合         ✅
正常 nextTurn() → Player_2               ✅
```

正式状态：

```text
FREE_PARKING v0.1 Stable ✅
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
❌ 不重构 FREE_PARKING
```

不要为了“代码更优雅”而重构已经通过实际测试的系统。

---

# 13. 当前明确不做的 FREE_PARKING 功能

当前 FREE_PARKING 保持“无效果功能格”。

暂时不实现：

```text
❌ TAX / 罚款资金池
❌ Jackpot
❌ 随机奖励
❌ 回血 / 加钱
❌ 停留奖励
❌ FREE_PARKING UI
❌ 音效
❌ 动画
```

后续如果要升级 FREE_PARKING，必须作为单独版本规划，不要在 Board v0.2 阶段顺手加入。

---

# 14. 下一核心阶段建议

现在 9 格灰盒已经覆盖：

```text
START
PROPERTY
CHANCE
DESTINY
TAX
JAIL
SPECIAL
GO_TO_JAIL
FREE_PARKING
```

下一阶段建议从“单格规则开发”切换到：

```text
Tile 类型补全
↓
Board v0.2 — Full Board Foundation
↓
9 格灰盒测试棋盘 → 28～32 格正式棋盘
↓
世界地标 Property 配置
↓
正式 3D 地图 / 地标建筑资产
```

下一对话首先不要直接建完整 28～32 格地图。

推荐第一步：

```text
Board v0.2 Step 1 — Full Board Data Planning
```

第一阶段只做：

```text
1. 检查当前 TileType 是否已经覆盖正式棋盘需要的基础格子类型
2. 规划正式棋盘总格数（目标约 28～32）
3. 规划各 TileType 的数量与大致分布
4. 规划哪些格子是 PROPERTY
5. 规划哪些格子继续作为 CHANCE / DESTINY / TAX / SPECIAL 等功能格
6. 先只输出数据规划
7. 不立即批量创建 28～32 个 Cocos Node
8. 不立即制作 3D 建筑
9. 不立即重构 BoardManager
```

先把正式棋盘数据结构和格子分布确定，再进入实际创建阶段。

---

# 15. 下一阶段开发方式

继续采用严格增量开发：

1. 每次只实现一个很小、可以实际运行验收的阶段。
2. 用户是 Cocos Creator 新手，要明确说明在 Cocos Creator 里点哪里。
3. 明确说明修改哪个 TypeScript。
4. TypeScript 修改优先提供“完整文件可复制替换版”。
5. 明确说明 Inspector 是否需要修改。
6. 每一步给正确 Console 预期。
7. 用户发截图后，先检查截图，再进入下一阶段。
8. 不为了代码更优雅而重构稳定系统。
9. 所有资金变化必须继续经过 EconomySystem。
10. `TileSystem.resolveLanding() === true` 继续只表示等待 Property Purchase Decision。
11. CHANCE / DESTINY MOVE 继续由 GameManager 接管异步移动。
12. Airport Transport 继续使用独立 Transport movement。
13. GO_TO_JAIL 继续使用独立 Forced Move。
14. FREE_PARKING 保持无效果规则，除非用户明确进入新的 FREE_PARKING 版本开发。
15. 如果需要当前最新实际代码，先让用户上传对应 TypeScript，不根据旧版本猜。
16. 不提前实现 Bankruptcy、Victory、Save / Load。
17. 当下一个稳定子系统或 Board v0.2 阶段完成、即将进入新的核心架构边界时，主动提醒切换新对话框并整理新的 handoff。

---

# 16. 推荐给新对话框的执行提示词

```text
请先完整阅读我上传的 `Monopoly3D_v0.1_FreeParking_Handoff.md`，
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
FREE_PARKING v0.1 Stable ✅

不要重新实现或重构这些已经稳定的系统。

当前灰盒棋盘已经是 9 格：

Tile_00 → START
Tile_01 → Paris / PROPERTY
Tile_02 → CHANCE
Tile_03 → DESTINY
Tile_04 → TAX
Tile_05 → JAIL
Tile_06 → Airport / SPECIAL / TRANSPORT
Tile_07 → GO_TO_JAIL
Tile_08 → FREE_PARKING

FREE_PARKING 当前正式规则：

- TileType.FREE_PARKING 已存在
- Tile_08 = FREE_PARKING
- 玩家最终落到 FREE_PARKING 后由 TileSystem 正确识别
- 输出专属 FreeParkingSystem Console
- 不加钱
- 不扣钱
- 无特殊奖励
- 不弹 UI
- 不登记 pending action
- 不进行额外移动
- resolveLanding() 返回 false
- 正常 nextTurn()
- resolveLanding() === true 仍然只表示等待 Property Purchase Decision

下一核心阶段开始：

Board v0.2 — Full Board Foundation

请继续按照完全新手、一步一步、小阶段实际运行验收的方式教我。

第一阶段先做：

Board v0.2 Step 1 — Full Board Data Planning

目标：
1. 检查当前 TileType 是否足够支撑正式棋盘。
2. 规划正式棋盘总格数，目标约 28～32 格。
3. 规划各 TileType 数量与大致分布。
4. 规划 PROPERTY 数量和分布。
5. 结合“地图一 = 世界地标建筑”的方向规划棋盘。
6. 这一阶段先只做数据结构 / 棋盘布局规划。
7. 暂时不要让我在 Cocos Creator 中批量创建 28～32 个 Node。
8. 暂时不要制作 3D 建筑。
9. 暂时不要重构 BoardManager、PlayerController、TurnManager 或 TileSystem。

开发要求：

- 每次只推进一个很小、可以确认的阶段。
- 如果下一步需要当前最新代码，请明确让我上传哪些 TypeScript，不要根据旧版本猜。
- TypeScript 修改优先提供完整文件可复制替换版。
- 明确告诉我 Cocos Creator 里需要点哪里、Inspector 是否需要修改。
- 我发截图以后，先检查截图，再进入下一阶段。
- 所有资金变化继续统一经过 EconomySystem。
- resolveLanding() === true 继续只表示 Property Purchase Decision。
- CHANCE / DESTINY 的异步移动继续由 GameManager 接管。
- Airport Transport 保持独立 Transport movement。
- GO_TO_JAIL 保持独立 Forced Move。
- FREE_PARKING 保持当前无效果规则。
- 不要为了代码更优雅而重构已经稳定的系统。
- 不提前实现 Bankruptcy、Victory、Save / Load。
- 当 Board v0.2 到达新的稳定里程碑并准备进入下一核心架构边界时，请主动提醒我切换新对话框并整理新的 handoff。
```

---

# 17. 当前阶段最终结论

截至 2026-09-23：

```text
Movement / Turn Loop                ✅ Stable
Economy                             ✅ Stable
Property Purchase                   ✅ Stable
Rent                                ✅ Stable
START                               ✅ Stable
TAX                                 ✅ Stable
CHANCE                              ✅ Stable
DESTINY                             ✅ Stable
JAIL v0.1                           ✅ Stable
SPECIAL Airport / Transport v0.1    ✅ Stable
GO_TO_JAIL v0.1                     ✅ Stable
FREE_PARKING v0.1                   ✅ Stable
```

下一阶段：

```text
→ Board v0.2 — Full Board Foundation
→ Step 1: Full Board Data Planning
```

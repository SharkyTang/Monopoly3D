请先完整阅读我上传的 `Monopoly3D_v0.1_Destiny_Handoff.md`，并把它作为当前项目唯一真实基线。

我正在使用 Cocos Creator 3.8.8 从零制作一个准备发布到微信小游戏的 3D 大富翁游戏。

目前已经实际运行验收完成：

- DiceSystem
- PlayerController 正向 / 反向移动与棋盘循环
- BoardManager
- TurnManager
- TileType / TileData / TileDatabase
- TileSystem
- PlayerEconomyData
- EconomySystem
- Property Purchase
- PropertyPurchaseUI
- BUY / SKIP
- Rent System
- START Reward
- TAX
- CHANCE 完整核心逻辑
  - Random Draw
  - MONEY_GAIN
  - MONEY_LOSS
  - MOVE FORWARD
  - MOVE BACKWARD
  - MOVE 后二次落地识别
- DESTINY 完整核心逻辑
  - DestinyCardType
  - DestinyCardData
  - DestinyCardDatabase
  - Random Draw
  - MONEY_GAIN
  - MONEY_LOSS
  - MOVE FORWARD +5
  - MOVE BACKWARD -4
  - MOVE 后二次落地识别
- START / Property Purchase / Rent / TAX / CHANCE / DESTINY Final Regression

当前正式进入新的核心阶段：

# JAIL

请严格增量开发，不要重写已经跑通的系统。

---

## 第一阶段：只实现 JAIL Step 1

本阶段只实现：

玩家最终落到 `TileType.JAIL`
→ 输出专属 JailSystem Console
→ 不进入拘留状态
→ 不跳过回合
→ 不罚款
→ 不弹 UI
→ 正常 nextTurn()

例如希望看到：

[TileSystem] Player_X landed on JAIL: Jail
[JailSystem] Player_X landed on JAIL: Jail.
[JailSystem] JAIL detected. No jail effect applied yet.
[TurnManager] Next turn: Player_Y

---

## 开发要求

1. 每次只教一个很小、可以实际运行验收的阶段。
2. 我是 Cocos Creator 新手，请明确告诉我在 Cocos Creator 里点哪里。
3. 明确告诉我修改哪个 TypeScript。
4. 涉及 TypeScript 修改时，优先直接给我“完整文件可复制替换版”，不要让我手动寻找多个局部代码段。
5. 明确告诉我 Inspector 是否需要设置。
6. 告诉我正确完成后 Console 应该看到什么。
7. 我发截图以后，先检查截图，再进入下一阶段。
8. 严格基于当前稳定架构增量开发，不要为了代码更优雅而重构。
9. 不要破坏：
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
10. 所有资金变化以后仍必须统一经过 `EconomySystem`，禁止直接修改 `money`。
11. `TileSystem.resolveLanding() === true` 仍只表示“需要等待 Property Purchase Decision”，不要改变这个语义。
12. Chance / Destiny MOVE 继续保持：
    - TileSystem 只登记 pending move
    - GameManager 接管异步移动
    - 移动完成后再次 resolveLanding()
13. 如果需要查看当前最新实际代码，请让我上传对应 TypeScript 文件，不要根据旧版本猜测。
14. JAIL Step 1 完整验收通过以后，再讨论 Jail 状态数据和规则。
15. 暂时不要实现：
    - isInJail
    - jailTurns
    - 跳过回合
    - 双骰脱狱
    - 罚款脱狱
    - Jail Card
    - Jail UI
    - Bankruptcy
16. 当 Jail 成为稳定子系统、准备进入下一个新的核心阶段时，请主动提醒我切换新对话，并帮我整理新的 handoff，不要等我主动问。

请先阅读 handoff，然后判断 JAIL Step 1 的最小修改点。

如果需要当前最新 `TileSystem.ts`，请先让我上传，不要直接根据旧版本写代码。

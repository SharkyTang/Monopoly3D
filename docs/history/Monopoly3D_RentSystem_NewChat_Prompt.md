请先完整阅读我上传的 `Monopoly3D_v0.1_PropertyPurchase_Handoff.md`，并把它作为当前项目唯一真实基线。

我正在用 Cocos Creator 3.8.8 从零制作一个准备发布到微信小游戏的 3D 大富翁游戏。

目前已经实际运行验收通过：

- DiceSystem
- PlayerController 移动与棋盘循环
- BoardManager
- TurnManager 四人回合
- TileType / TileData / TileDatabase
- TileSystem 落地识别
- PlayerEconomyData
- EconomySystem
  - getPlayerById()
  - addMoney()
  - removeMoney()
- Property affordability
- Property Purchase Decision
- 回合暂停 / 恢复
- PropertyPurchaseUI
- SKIP
- BUY
- pendingProperty
- 正式购买交易
- 已购地产回归测试

当前正式 Property Purchase 流程：

玩家落到无人 PROPERTY 且买得起
→ TileSystem 保存 pendingProperty
→ GameManager 暂停当前回合
→ 显示 BUY / SKIP

SKIP
→ 不扣钱
→ ownerId 不变
→ 清空 pendingProperty
→ 隐藏 UI
→ nextTurn()

BUY
→ EconomySystem.removeMoney()
→ ownerId = 当前 playerId
→ 清空 pendingProperty
→ 隐藏 UI
→ nextTurn()

已验证真实案例：

Player_4 买 Paris：
15000 - 1600 = 13400
Paris ownerId: null → 3

之后 Player_1 落到 Paris：
ownerId=3
→ Console 正确显示 Paris is owned by playerId=3
→ 不再显示 BUY / SKIP
→ 当前暂时直接 nextTurn

现在继续下一阶段：

# Rent System

请严格增量开发，不要重写已经跑通的系统。

第一小阶段先只实现：

- 当玩家落到已购 PROPERTY 时，TileSystem 能区分：
  1. 当前玩家自己的地产
  2. 其他玩家拥有的地产
- 先只用 Console 验证
- 暂时不要真的扣 rent
- 暂时不要做 Rent UI
- 暂时不要做 Bankruptcy

当前 Paris：
- price = 1600
- baseRent = 200
- ownerId 为运行时状态

要求：

1. 每次只教一个小阶段。
2. 明确告诉我在 Cocos Creator 里点哪里。
3. 明确告诉我修改哪个 TypeScript。
4. 涉及 TypeScript 修改时，优先直接给我“完整文件可复制替换版”，不要让我手动找多个局部代码段。
5. 明确告诉我 Inspector 是否需要设置。
6. 告诉我正确完成后应该看到什么。
7. 我发截图后先检查截图，再进入下一步。
8. 严格基于当前稳定架构增量开发，不要为了更优雅而重构。
9. 不要提前实现 START / TAX / Chance / Destiny / Jail / Bankruptcy。
10. 当 Rent System 完整稳定完成、下一阶段进入 START / TAX 时，请主动提醒我生成新的 handoff 并切换新对话框，不要等我主动问。

请现在从 Rent System 的第一步开始教我。

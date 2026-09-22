请先完整阅读我上传的 `Monopoly3D_v0.1_RentSystem_Handoff.md`，并把它作为当前项目唯一真实基线。

我正在用 **Cocos Creator 3.8.8** 从零制作一个准备发布到微信小游戏的 3D 大富翁游戏。

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
- Rent System
  - 自己的地产识别
  - 别人的地产识别
  - baseRent 读取
  - payer 扣款
  - owner 收款
  - 连续收租回归测试

当前 Rent System 已验证：

```text
Owner 落自己地产
→ No rent required
→ 不扣钱
→ 正常 nextTurn()

Other Player 落别人地产
→ EconomySystem.removeMoney(payer, baseRent)
→ EconomySystem.addMoney(owner, baseRent)
→ Console 输出双方资金变化
→ 正常 nextTurn()
```

当前 Paris：

```text
Tile_01
name = Paris
type = PROPERTY
price = 1600
baseRent = 200
ownerId = 运行时状态
```

现在继续下一阶段：

# START Reward → TAX

请严格增量开发，不要重写已经跑通的系统。

---

## 第一阶段：只开始 START Reward

第一小阶段先只实现：

- 正确识别玩家是否经过 START
- 先只通过 Console 验证
- 暂时不要真的加钱
- 暂时不要做 START UI
- 暂时不要做 TAX
- 暂时不要做 Bankruptcy

开始写代码前，先根据当前项目架构确认最合适的最小改动点。

如果当前资料不足以确定“经过 START”的检测应该写在 `PlayerController`、`BoardManager`、`GameManager` 或其他位置，不要猜；先基于 handoff 中现有流程分析，再选择最小增量方案。

---

## START Reward 规则不要擅自假设

如果实现前必须确定以下规则，而 handoff 没有明确写，请先问我，不要自行决定：

1. 经过 START 是否奖励
2. 刚好停在 START 是否奖励
3. 游戏开局站在 START 是否奖励
4. START 奖励金额是多少

不要在我未确认前把这些规则写死。

---

## 开发要求

1. 每次只教一个小阶段。
2. 明确告诉我在 Cocos Creator 里点哪里。
3. 明确告诉我修改哪个 TypeScript。
4. 涉及 TypeScript 修改时，优先直接给我“完整文件可复制替换版”，不要让我手动寻找并替换多个局部代码段。
5. 明确告诉我 Inspector 是否需要设置。
6. 告诉我正确完成后应该看到什么。
7. 我发截图后先检查截图，再进入下一步。
8. 严格基于当前稳定架构增量开发，不要为了更优雅而重构。
9. 不要破坏已经完成的 Property Purchase 和 Rent System。
10. 所有资金变化必须继续统一走 `EconomySystem`。
11. 不要直接修改 `money`。
12. 不要提前实现 Chance / Destiny / Jail / Bankruptcy。
13. START Reward 完整稳定后，再进入 TAX。
14. TAX 也必须拆成多个小阶段：
    - 先识别 TAX
    - 再实际扣款
    - 最后回归测试
15. 当 START + TAX 完整稳定完成、下一阶段进入 Chance / Destiny 时，请主动提醒我生成新的 handoff 并切换新对话框，不要等我主动问。

请现在从 **START Reward 的第一步**开始教我。

请先完整阅读我上传的 `Monopoly3D_v0.1_Jail_Handoff.md`，并把它作为当前项目唯一真实基线。

我正在使用 Cocos Creator 3.8.8 从零制作一个准备发布到微信小游戏的 3D 大富翁游戏。

目前 Movement / Turn Loop、Economy、Property Purchase、Rent、START、TAX、CHANCE、DESTINY、JAIL 核心逻辑都已经完成。

当前 JAIL v0.1 规则已经锁定为：

玩家进入 JAIL
→ isInJail = true
→ jailTurns = 0
→ 下一次轮到该玩家时跳过 1 回合
→ jailTurns = 1
→ 自动释放
→ isInJail = false
→ jailTurns = 0
→ 继续下一位玩家。

暂时不实现双骰脱狱、罚款脱狱、Jail Card、Jail UI、多回合拘留。

新对话第一阶段不要改代码。

请先带我完成 `JAIL Final Regression`：

1. CHANCE MOVE 后二次落地到 JAIL
   → isInJail=true
   → 后续下一次自己的回合必须被跳过
   → 自动释放。

2. 玩家自动释放以后，再等一整轮
   → 再次轮到该玩家时必须可以正常 Dice Roll 和移动。

如果这两项都实际运行通过，就正式标记：

`JAIL v0.1 Stable ✅`

然后再进入下一个核心阶段：

`SPECIAL Step 1`

SPECIAL Step 1 第一阶段只实现：

玩家最终落到 `TileType.SPECIAL`
→ 输出专属 SpecialSystem Console
→ 不产生实际游戏效果
→ 不罚款
→ 不移动
→ 不弹 UI
→ 正常 nextTurn()

不要提前设计复杂 Special 规则。

开发要求：

- 每次只教一个很小、可以实际运行验收的阶段。
- 我是 Cocos Creator 新手，请明确告诉我在 Cocos Creator 里点哪里。
- 明确告诉我修改哪个 TypeScript。
- 涉及 TypeScript 修改时，优先直接给我“完整文件可复制替换版”，不要让我手动找多个局部代码段。
- 明确告诉我 Inspector 是否需要设置。
- 告诉我正确完成后 Console 应该看到什么。
- 我发截图以后，先检查截图，再进入下一阶段。
- 严格基于当前稳定架构增量开发，不要为了代码更优雅而重构。
- 不要破坏 DiceSystem、PlayerController、BoardManager、TurnManager、EconomySystem、Property Purchase、PropertyPurchaseUI、Rent、START、TAX、CHANCE、DESTINY、JAIL。
- 所有资金变化以后仍必须统一经过 EconomySystem。
- `TileSystem.resolveLanding() === true` 仍只表示“等待 Property Purchase Decision”，不要改变这个语义。
- Chance / Destiny MOVE 继续保持 TileSystem 只登记 pending move，GameManager 接管异步移动，移动完成后再次 resolveLanding()。
- 如果需要查看当前最新实际代码，请让我上传对应 TypeScript 文件，不要根据旧版本猜。
- 当 SPECIAL 成为稳定子系统、准备进入新的核心阶段时，请主动提醒我切换新对话，并帮我整理新的 handoff，不要等我主动问。

请先阅读 handoff，然后只带我完成 JAIL Final Regression，不要直接开始写 SPECIAL 代码。

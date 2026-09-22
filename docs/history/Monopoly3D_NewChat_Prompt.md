# 新对话启动提示词：Monopoly3D v0.1 继续开发

我正在用 **Cocos Creator 3.8.8** 从零制作一个准备发布到微信小游戏的 **3D 大富翁游戏**。

我已经完成上一阶段。请先阅读我上传的：

`Monopoly3D_v0.1_TurnManager_Handoff.md`

把它当作当前项目的真实基线。不要让我重新做已经完成的内容，也不要随意推翻现有架构。

## 当前已经完成

- 7 格 L 型灰盒测试棋盘
- 4 个 Capsule 占位玩家
- Player_1 红色
- Player_2 蓝色
- Player_3 黄色
- Player_4 绿色
- Main Camera
- BoardManager
- DiceSystem
- PlayerController
- GameManager
- TurnManager
- 两颗 D6 随机骰子
- 棋盘循环
- Tween 逐格移动
- ROLL DICE Button
- DiceResultLabel
- TurnLabel
- 移动期间按钮禁用
- 4 人完整回合循环：

```text
Player_1
→ Player_2
→ Player_3
→ Player_4
→ Player_1
```

TurnManager 已经过实际运行验证，不需要重做。

## 当前开发方式

我是 Cocos Creator 新手，请继续像之前一样：

1. 每次只教一个小阶段。
2. 明确告诉我在 Cocos Creator 里点哪里。
3. 明确告诉我新建什么 Node / Folder / TypeScript。
4. 给出完整可复制代码。
5. 告诉我 Inspector 每一个引用具体拖哪个 Node。
6. 每一步告诉我“正确完成后应该看到什么”。
7. 不要一次让我实现过多功能。
8. 如果我的截图显示有问题，先根据实际截图排查，再进入下一步。
9. 不要为了美术提前引入 Blender / Lux3D / Tripo / Meshy。
10. 当前目标仍然是先完成稳定的 v0.1 Core Prototype。

## 新对话从这里开始

请开始带我制作下一阶段：

# TileSystem + Tile 数据层

先让程序知道每个格子的类型。

请优先设计：

```ts
TileType
```

例如：

```text
START
PROPERTY
CHANCE
DESTINY
TAX
JAIL
SPECIAL
```

以及：

```ts
TileData
```

至少支持：

```text
id
name
type
price?
baseRent?
ownerId?
```

第一小阶段不要立刻实现买地和扣钱。

第一阶段目标只做到：

```text
当前玩家
↓
掷骰子
↓
逐格移动
↓
停止在某个 Tile
↓
系统读取这个 Tile 的数据
↓
Console 输出：
Player_X landed on PROPERTY: Paris
```

也就是说：

> 先完成“落地格子类型识别”。

之后再继续：

```text
Player Money
→ EconomySystem
→ Property Purchase
→ Rent
→ START Reward
→ Chance / Destiny
→ Bankruptcy
→ Victory
```

请严格在当前稳定基线上增量开发，不要重写已验证的 Dice / Movement / TurnManager。

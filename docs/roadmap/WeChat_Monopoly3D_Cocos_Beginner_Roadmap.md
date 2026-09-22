# 微信 3D 大富翁小游戏：Cocos Creator 零基础开发路线与操作指南

> 项目目标：制作一个可发布到微信小游戏的 3D 大富翁游戏  
> 当前阶段：从 0 开始 / 刚安装 Cocos Creator  
> 推荐引擎：Cocos Creator 3.x（本指南按 Cocos Creator 3.8 LTS 官方文档中的界面与概念编写）  
> 项目代号：`Monopoly3D_v0.1_Core_Prototype`

---

# 0. 先记住最重要的一件事

这个项目的第一步 **不是**：

- 先做精致角色
- 先做世界地标建筑
- 先学 Blender
- 先用 Lux3D / Tripo / Meshy
- 先生成背景音乐
- 先设计商城
- 先做联机
- 先做完整 UI

第一步是：

> **在 Cocos Creator 中做出一个丑但是能完整玩一局的大富翁灰盒原型。**

也就是：

```text
开始游戏
↓
4 名玩家
↓
玩家 1 掷骰子
↓
棋子移动
↓
落到一个格子
↓
触发格子效果
↓
可以买地产 / 支付租金 / 抽事件
↓
切换玩家
↓
继续循环
↓
玩家破产
↓
只剩最后一名玩家
↓
游戏结束
```

只要这个循环成立，你的游戏本体就已经“出生”了。

后面的：

- 世界地标
- 精致人物
- 建筑动画
- 音乐
- 粒子效果
- UI
- 商城
- 微信社交
- 排行榜

全部是在这个核心上继续加内容。

---

# 1. 第一版 v0.1 到底做什么

## 1.1 v0.1 的目标

版本名：

```text
Monopoly3D v0.1 Core Prototype
```

唯一目标：

> 让 4 个占位棋子能够按照大富翁规则完成一局游戏。

---

## 1.2 v0.1 必须包含

第一版只做：

- 4 名玩家
- 1 张测试棋盘
- 约 32 个棋盘格
- 2 颗六面骰的逻辑（画面上暂时可以只显示数字）
- 回合系统
- 玩家移动
- 初始资金
- 普通地产
- 买地产
- 地产拥有者
- 租金
- 机会格
- 命运格
- 奖励 / 罚款
- 起点
- 简单特殊格
- 破产判断
- 胜利判断

---

## 1.3 v0.1 暂时不要做

下面这些全部先忍住：

- 精致人物模型
- 人物换装
- Blender 世界地标
- Lux3D 建模
- Tripo / Meshy
- Holopix
- Suno 音乐
- ElevenLabs
- 高级骰子动画
- 复杂 UI
- 商城
- 皮肤
- 排行榜
- 好友系统
- 微信登录
- 多人实时联网
- 匹配系统
- 排位系统
- 第二张地图
- 中国地图
- 大量特效

原因很简单：

如果核心规则没有跑通，你越早制作高级资产，后面返工成本越高。

---

# 2. 第一版规则表

这些数字不是最终平衡值，只是为了让程序先运行。

| 项目 | v0.1 暂定值 |
|---|---:|
| 玩家数 | 固定 4 人 |
| 初始资金 | 15000 |
| 骰子 | 2 × D6 |
| 地图总格数 | 32 左右 |
| 经过起点奖励 | +2000 |
| 普通地产 | 18～22 格 |
| 机会格 | 3 格 |
| 命运格 | 3 格 |
| 税收 / 罚款 | 2 格 |
| 特殊格 | 起点、停留/监狱等 |
| 初始地产 | 无 |
| 胜利条件 | 其余玩家全部破产 |

后期再做数值平衡。

---

# 3. 整体版本路线

## v0.1 — Core Prototype

完成：

- 回合
- 骰子
- 移动
- 地图
- 地产
- 金钱
- 租金
- 破产
- 胜利

美术全部使用灰盒占位。

---

## v0.2 — Rules Complete

加入：

- 更完整的地图规则
- 机会卡
- 命运卡
- 特殊格
- 买房 / 升级
- 更多事件
- 更完善的经济系统

---

## v0.3 — UI / UX

加入：

- 玩家 HUD
- 当前资金
- 当前回合
- 掷骰子按钮
- 地产购买窗口
- 卡牌弹窗
- 资产面板
- 游戏菜单
- 结算界面

---

## v0.4 — 3D World Foundation

开始把灰盒棋盘变成真正的 3D 世界地图。

此时才正式进入：

- 世界地标场景设计
- 3D 建筑布局
- 地图灯光
- 地面
- 天空
- 环境

---

## v0.5 — Landmark Assets

正式制作：

- 伦敦
- 巴黎
- 东京
- 上海
- 纽约
- 迪拜
- 新加坡
- 等世界地标模型

可能使用：

- Blender
- Lux3D
- Tripo
- Meshy
- AI 建模工具

---

## v0.6 — Characters

制作正式玩家角色：

- 男角色
- 女角色
- 不同服装
- 不同主题
- 待机
- 行走
- 胜利
- 失败

---

## v0.7 — Animation & Feedback

加入：

- 骰子动画
- 棋子移动动画
- 买地动画
- 收租反馈
- 金币动画
- 相机运动
- 建筑动画
- 卡牌动画

---

## v0.8 — Audio

加入：

- 世界地图 BGM
- 中国地图 BGM
- UI 音效
- 掷骰子音效
- 行走音效
- 买地音效
- 特殊格音效

可以考虑：

- Suno
- ElevenLabs
- MiniMax
- 自制 / 授权音频

---

## v0.9 — WeChat Mini Game

重点：

- 微信小游戏构建
- 包体控制
- 性能优化
- 资源分包
- 加载优化
- 微信开发者工具测试
- 真机测试

---

## v1.0 — First Public Version

达到：

- 可完整开始 / 结束一局
- 操作稳定
- 无重大 Bug
- UI 完整
- 音效完整
- 第一张正式地图
- 第一批正式角色
- 微信小游戏正常运行

---

# 4. Cocos Creator 到底是什么

你可以把 Cocos Creator 理解为：

> “制作游戏的总工作台”。

它负责：

- 场景
- 3D 模型
- 灯光
- 摄像机
- UI
- 脚本
- 动画
- 音频
- 物理
- 游戏逻辑
- 平台构建

而：

- Blender：负责生产 3D 模型
- Suno：负责生产音乐
- Holopix / GPT Image：负责视觉概念
- Codex：辅助写代码和修改工程
- Cocos Creator：把这些东西最终组装成游戏

所以 Cocos Creator 是你这个项目的“总装车间”。

---

# 5. Cocos Creator 最重要的 5 个区域

第一次打开编辑器后，你最需要认识：

## 5.1 Hierarchy / 层级管理器

它显示：

> 当前 Scene 里面有什么东西。

例如：

```text
Scene
├── Main Camera
├── Directional Light
├── Board
│   ├── Tile_00
│   ├── Tile_01
│   ├── Tile_02
│   └── ...
├── Players
│   ├── Player_1
│   ├── Player_2
│   ├── Player_3
│   └── Player_4
└── GameManager
```

你以后会非常频繁地使用这里。

---

## 5.2 Scene / 场景编辑器

这是你的 3D 工作区。

你会在里面：

- 看棋盘
- 移动模型
- 调整位置
- 调整旋转
- 调整大小
- 摆建筑
- 摆摄像机

类似 Blender 的 Viewport。

---

## 5.3 Inspector / 属性检查器

当你点击一个对象：

```text
Tile_01
```

Inspector 会显示这个对象的属性。

最常用的是：

```text
Position
Rotation
Scale
```

统称：

```text
Transform
```

---

## 5.4 Assets / 资源管理器

相当于项目文件柜。

以后你的：

- Scene
- TypeScript
- Material
- Texture
- Model
- Audio
- Prefab

都在这里。

---

## 5.5 Console / 控制台

程序：

- 报错
- Warning
- log
- 调试信息

都会出现在这里。

以后 Codex 写完代码，你首先要学会看 Console。

---

# 6. 推荐项目目录

创建项目以后，不要把所有东西扔在 `assets` 根目录。

建议：

```text
assets/
│
├── scenes/
│   └── Main.scene
│
├── scripts/
│   ├── core/
│   │   ├── GameManager.ts
│   │   ├── TurnManager.ts
│   │   └── GameState.ts
│   │
│   ├── board/
│   │   ├── BoardManager.ts
│   │   ├── Tile.ts
│   │   └── TileData.ts
│   │
│   ├── player/
│   │   └── PlayerController.ts
│   │
│   ├── dice/
│   │   └── DiceSystem.ts
│   │
│   └── economy/
│       └── EconomySystem.ts
│
├── prefabs/
│   ├── tiles/
│   └── players/
│
├── materials/
│
├── models/
│
├── textures/
│
├── audio/
│
└── ui/
```

第一天不需要全部建完。

你只需要先建立：

```text
assets/
├── scenes/
├── scripts/
├── materials/
└── prefabs/
```

---

# 7. 从刚安装完开始：一步一步操作

---

# STEP 1 — 打开 Cocos Dashboard

启动：

```text
Cocos Dashboard
```

Dashboard 是 Cocos Creator 的管理器。

它主要负责：

- 安装 Creator 编辑器
- 管理版本
- 创建项目
- 打开项目

如果你已经安装了 Creator 编辑器，就直接进入：

```text
项目 / Projects
```

---

# STEP 2 — 创建新项目

在 Dashboard 中找到：

```text
新建项目
```

建议：

### 项目名称

```text
Monopoly3D_v0.1_Core_Prototype
```

### 项目路径

建议放到一个稳定的英文目录。

Mac 可以例如：

```text
~/Documents/GameProjects/Monopoly3D_v0.1_Core_Prototype
```

尽量避免：

```text
桌面/我的大富翁游戏/最终版/
```

长期开发项目最好：

- 英文路径
- 不频繁移动
- 不放 iCloud 自动同步目录
- 路径清晰

---

# STEP 3 — 选择空项目 / 3D 项目模板

优先选择：

```text
Empty / 空项目
```

如果版本中存在明确 3D 模板，也可以选择对应的 3D Empty 类模板。

我们的目标是：

> 自己从零搭项目，不使用复杂样例模板。

点击：

```text
创建并打开
```

等待编辑器打开。

---

# STEP 4 — 第一次不要急着写代码

打开后先花 5～10 分钟认识界面。

找到：

```text
Hierarchy
Scene
Inspector
Assets
Console
```

如果某个窗口不见了，可以从顶部：

```text
面板 / Panel
```

重新打开。

---

# STEP 5 — 保存 Main Scene

在 Assets：

右键：

```text
Create
→ Scene
```

命名：

```text
Main
```

放：

```text
assets/scenes/Main.scene
```

或者新场景创建后：

```text
Cmd + S
```

保存。

以后养成习惯：

```text
Cmd + S
```

频繁保存。

---

# STEP 6 — 创建项目文件夹

在 Assets 内建立：

```text
scenes
scripts
materials
prefabs
```

推荐：

```text
assets/
├── scenes/
├── scripts/
├── materials/
└── prefabs/
```

---

# STEP 7 — 创建第一个 Cube

Hierarchy 空白处：

右键：

```text
Create
→ 3D Object
→ Cube
```

创建后：

重命名：

```text
TestTile
```

点击它。

然后看 Inspector。

找到：

```text
Transform
```

你会看到：

```text
Position
Rotation
Scale
```

试着改变：

```text
Position X
Position Y
Position Z
```

观察 Cube 移动。

这一步的意义：

> 学会“节点 + Transform”。

---

# STEP 8 — 把 Cube 变成棋盘格

例如：

```text
Scale
X = 2
Y = 0.2
Z = 2
```

你现在应该看到：

> 一个扁平的方形棋盘格。

把它重命名：

```text
Tile_00
```

---

# STEP 9 — 创建 Board 父节点

Hierarchy：

```text
Create
→ Empty Node
```

命名：

```text
Board
```

把：

```text
Tile_00
```

拖到：

```text
Board
```

下面。

现在应该是：

```text
Scene
└── Board
    └── Tile_00
```

---

# STEP 10 — 复制棋盘格

选中：

```text
Tile_00
```

使用复制 / Duplicate。

Mac 常见快捷方式：

```text
Cmd + D
```

生成：

```text
Tile_01
Tile_02
Tile_03
...
```

每复制一个，修改 Position。

例如：

```text
Tile_00 = (-6, 0, -6)
Tile_01 = (-2, 0, -6)
Tile_02 = ( 2, 0, -6)
Tile_03 = ( 6, 0, -6)
```

先做一个非常小的测试棋盘。

不要第一天就摆 32 格。

先做：

```text
8～12 格
```

确认概念。

---

# 8. 最终棋盘如何排列

正式 v0.1 可以做约 32 格。

类似：

```text
□ □ □ □ □ □ □ □ □
□               □
□               □
□               □
□               □
□               □
□               □
□               □
□ □ □ □ □ □ □ □ □
```

最开始所有格子都可以是灰色 Cube。

完全不需要建筑。

---

# 9. 创建 4 个玩家占位棋子

第一版玩家不要建模。

使用：

```text
Capsule
```

或者：

```text
Cylinder
```

作为玩家。

创建一个：

```text
Player_1
```

然后复制：

```text
Player_2
Player_3
Player_4
```

放到：

```text
Players
```

节点下面。

结构：

```text
Scene
├── Board
│   ├── Tile_00
│   ├── Tile_01
│   └── ...
│
└── Players
    ├── Player_1
    ├── Player_2
    ├── Player_3
    └── Player_4
```

第一版可以通过不同颜色区分。

---

# 10. 摄像机

Scene 需要 Camera 才能让玩家看到画面。

Hierarchy 中一般会有：

```text
Main Camera
```

选中 Camera。

调整：

```text
Position
Rotation
```

让它从斜上方向下看整个棋盘。

不要一开始追求电影级镜头。

v0.1 的要求只有：

> 能清楚看到棋盘和玩家。

---

# 11. 灯光

Scene 中一般会存在：

```text
Directional Light
```

如果没有：

创建一个 Directional Light。

目标：

> Cube 和玩家能够被正常照亮。

第一版不研究：

- GI
- HDR
- PBR 高级效果
- 烘焙
- 环境光高级参数

以后再做。

---

# 12. 点击运行 / Preview

找到编辑器上方的：

```text
Preview / 运行
```

运行场景。

此时：

> 游戏没有任何玩法没关系。

你第一阶段只需要看到：

- 棋盘
- 玩家
- Camera 正确
- 灯光正确

如果能看到：

✅ 第一阶段通过。

---

# 13. 第一个 TypeScript 脚本

在：

```text
assets/scripts
```

右键：

```text
Create
→ TypeScript
```

命名：

```text
HelloGame.ts
```

打开后写最简单的脚本：

```ts
import { _decorator, Component } from 'cc';

const { ccclass } = _decorator;

@ccclass('HelloGame')
export class HelloGame extends Component {

    start() {
        console.log('Monopoly3D started!');
    }

}
```

---

# 14. 脚本不是创建完就自动运行

这是 Cocos 新手特别容易误解的地方。

你创建：

```text
HelloGame.ts
```

之后，还需要把脚本：

> 挂载到一个 Node 上。

---

# 15. 创建 GameManager Node

Hierarchy：

```text
Create
→ Empty Node
```

命名：

```text
GameManager
```

选中：

```text
GameManager
```

然后把：

```text
HelloGame.ts
```

拖到 Inspector。

或者：

```text
Add Component
```

找到你的脚本。

运行游戏。

Console 如果出现：

```text
Monopoly3D started!
```

说明：

✅ 你已经成功执行了自己的第一段 Cocos TypeScript。

这是非常重要的里程碑。

---

# 16. 理解 Node + Component

这是 Cocos 最重要的基础概念之一。

可以这样理解：

```text
Node = 东西本身
Component = 这个东西具有什么能力
```

例如：

```text
Player_1
```

是 Node。

然后它可能挂：

```text
MeshRenderer
PlayerController
Animation
Collider
```

这些都是 Component。

所以：

```text
Player_1
├── Transform
├── MeshRenderer
├── PlayerController
└── Animation
```

最终共同组成一个游戏角色。

---

# 17. 你的游戏核心架构

不要把所有逻辑写进一个 3000 行脚本。

我们拆成系统。

---

## 17.1 GameManager

负责：

```text
游戏开始
游戏状态
初始化玩家
初始化棋盘
判断游戏结束
重新开始
```

它是整个游戏的最高层管理器。

---

## 17.2 TurnManager

负责：

```text
现在轮到谁
开始回合
结束回合
切到下一玩家
跳过玩家
处理破产玩家
```

例如：

```text
Player1
↓
Player2
↓
Player3
↓
Player4
↓
Player1
```

---

## 17.3 DiceSystem

负责：

```text
掷骰子
返回点数
```

第一版甚至不需要真正的骰子模型。

逻辑：

```ts
die1 = 1~6
die2 = 1~6

total = die1 + die2
```

以后再加入：

- 3D 骰子
- 物理
- 动画
- 音效

---

## 17.4 BoardManager

负责：

```text
所有格子
格子顺序
Tile_00
Tile_01
Tile_02
...
```

它知道：

```text
第 0 格在哪里
第 1 格在哪里
第 2 格在哪里
```

玩家移动时：

```text
currentTile = 5
dice = 7
newTile = 12
```

BoardManager 找到：

```text
Tile_12.position
```

然后玩家移动过去。

---

## 17.5 PlayerController

每个玩家都有：

```text
id
name
money
currentTile
ownedProperties
bankrupt
```

负责：

```text
移动
更新位置
更新资金
玩家状态
```

---

## 17.6 TileSystem

格子可能是：

```text
START
PROPERTY
CHANCE
DESTINY
TAX
JAIL
SPECIAL
```

玩家落到格子后：

```text
TileSystem
```

判断：

> 这个格子应该触发什么？

---

## 17.7 EconomySystem

负责：

```text
付款
收钱
买地产
租金
罚款
奖励
资产
破产
```

最好不要让不同脚本到处直接：

```ts
player.money -= 500;
```

以后统一经过 EconomySystem。

这样比较容易维护。

---

# 18. 核心系统关系

```text
GameManager
│
├── TurnManager
│   └── 控制当前玩家
│
├── DiceSystem
│   └── 生成骰子点数
│
├── BoardManager
│   └── 管理棋盘格
│
├── PlayerController
│   └── 管理玩家
│
├── TileSystem
│   └── 判断落地效果
│
└── EconomySystem
    ├── 买地
    ├── 收租
    ├── 奖励
    └── 罚款
```

---

# 19. 第一段真正的游戏逻辑：DiceSystem

创建：

```text
assets/scripts/dice/DiceSystem.ts
```

第一版逻辑可以非常简单：

```ts
import { _decorator, Component } from 'cc';

const { ccclass } = _decorator;

@ccclass('DiceSystem')
export class DiceSystem extends Component {

    public roll(): number {
        const die1 = Math.floor(Math.random() * 6) + 1;
        const die2 = Math.floor(Math.random() * 6) + 1;

        const total = die1 + die2;

        console.log(`Dice: ${die1} + ${die2} = ${total}`);

        return total;
    }

}
```

第一阶段不是做动画。

而是确认：

```text
roll()
```

能返回：

```text
2～12
```

---

# 20. TurnManager 第一版思路

```ts
currentPlayerIndex = 0;
```

代表：

```text
Player_1
```

结束后：

```ts
currentPlayerIndex++;
```

当达到：

```text
4
```

重新：

```text
0
```

形成：

```text
0 → 1 → 2 → 3 → 0 → ...
```

---

# 21. BoardManager 第一版思路

每个棋盘格按顺序保存。

例如：

```text
Tile_00
Tile_01
Tile_02
Tile_03
...
Tile_31
```

玩家：

```text
currentTile = 4
```

骰子：

```text
7
```

计算：

```text
4 + 7 = 11
```

玩家移动到：

```text
Tile_11
```

如果超过 31：

```text
(currentTile + dice) % 32
```

这样会绕回起点。

---

# 22. PlayerController 第一版数据

概念上：

```ts
playerId
playerName
money
currentTileIndex
isBankrupt
```

例如：

```text
Player 1
money = 15000
currentTileIndex = 0
isBankrupt = false
```

---

# 23. 不要把游戏规则绑死在模型上

这是整个项目未来能不能顺利扩展的关键。

不要：

```text
点击巴黎模型
→ 代码里面直接写 Paris
```

应该使用“数据驱动”。

例如：

```ts
{
    id: 7,
    name: "Paris",
    type: "PROPERTY",
    price: 1600,
    rent: 200,
    ownerId: null
}
```

以后：

```text
Paris
```

现在只是一个：

```text
灰色 Cube
```

未来替换为：

```text
埃菲尔铁塔 + 巴黎场景
```

核心规则代码完全不用改。

这叫：

> 游戏逻辑与表现层分离。

---

# 24. 推荐地产数据结构

后面可以设计：

```ts
export enum TileType {
    START,
    PROPERTY,
    CHANCE,
    DESTINY,
    TAX,
    JAIL,
    SPECIAL
}

export interface TileData {
    id: number;
    name: string;
    type: TileType;

    price?: number;
    baseRent?: number;

    ownerId?: number | null;
}
```

以后地图：

```text
World Map
China Map
Future Map
Fantasy Map
```

都可以使用同一个核心系统。

---

# 25. 完整回合应该是什么样

例如：

```text
Player 1 Turn
↓
允许点击 Roll
↓
DiceSystem.roll()
↓
结果 = 7
↓
PlayerController.move(7)
↓
经过动画移动 7 格
↓
到达 Paris
↓
TileSystem.resolve()
↓
Paris.owner == null
↓
询问是否购买
↓
Player 1 点击购买
↓
EconomySystem.buyProperty()
↓
Player1.money -= 1500
↓
Paris.owner = Player1
↓
结束回合
↓
TurnManager.nextTurn()
↓
Player 2
```

以后 Player 2 到 Paris：

```text
Player 2
↓
Paris.owner = Player1
↓
计算租金 200
↓
Player2 -200
↓
Player1 +200
↓
Next Turn
```

---

# 26. v0.1 真正的验收标准

不是：

❌ 建筑够不够好看

不是：

❌ 人物精不精致

不是：

❌ 音乐好不好听

不是：

❌ UI 高不高级

唯一标准：

> **4 个方块/胶囊小人能不能不依赖人工修改数据，完整玩完一局。**

必须能够：

```text
开始
→ 掷骰子
→ 移动
→ 落地
→ 触发事件
→ 买地
→ 收租
→ 金钱变化
→ 玩家破产
→ 淘汰
→ 最后一人获胜
→ 游戏结束
```

只要达到：

✅ v0.1 完成。

---

# 27. 推荐的开发阶段

## 阶段 A — Editor 入门

完成：

- 创建项目
- 保存 Scene
- 创建 Cube
- 使用 Transform
- 创建父节点
- 创建 Camera
- 创建 Light
- Preview

完成后你应该看到：

> 一个由 Cube 组成的小棋盘。

---

## 阶段 B — Script 入门

完成：

- 创建 TypeScript
- 挂脚本
- console.log
- start()
- 获取 Node
- 修改 Node 位置

完成后应该：

> 运行游戏，Console 可以看到你的 log。

---

## 阶段 C — Board

完成：

- 32 Tile
- Tile 按顺序管理
- BoardManager
- 玩家当前位置索引

完成后：

> 可以通过代码让棋子跳到指定 Tile。

---

## 阶段 D — Dice

完成：

- DiceSystem
- 2 个随机 D6
- total

完成后：

> 每次测试可以得到 2～12。

---

## 阶段 E — Movement

完成：

```text
骰子 = 7
↓
玩家移动 7 格
```

初期甚至可以瞬移。

以后再做：

```text
1 格
→ 1 格
→ 1 格
```

连续动画。

---

## 阶段 F — Turns

完成：

```text
P1
P2
P3
P4
P1
```

且只有当前玩家可以操作。

---

## 阶段 G — Economy

加入：

```text
money
price
rent
owner
```

完成：

```text
买地
支付租金
获得租金
```

---

## 阶段 H — Special Tiles

加入：

```text
Chance
Destiny
Tax
Jail
Start
```

---

## 阶段 I — Bankruptcy

例如：

```text
money < 0
```

进入：

```text
bankrupt
```

玩家被移出回合。

---

## 阶段 J — Victory

如果：

```text
activePlayers.length === 1
```

游戏结束。

---

# 28. 你第一天应该做什么

第一天完全不要碰正式美术。

目标：

### 1

打开 Dashboard。

### 2

创建：

```text
Monopoly3D_v0.1_Core_Prototype
```

### 3

建立：

```text
assets/scenes
assets/scripts
assets/materials
assets/prefabs
```

### 4

保存：

```text
Main.scene
```

### 5

创建：

```text
Board
```

### 6

做 8～12 个 Cube。

### 7

创建：

```text
Players
```

### 8

做 4 个 Capsule。

### 9

调整 Camera。

### 10

Preview 成功。

### 11

创建：

```text
GameManager
```

### 12

创建 HelloGame.ts。

### 13

挂载脚本。

### 14

Console 成功输出：

```text
Monopoly3D started!
```

完成这些：

> 第一天已经足够。

---

# 29. 第一周推荐计划

## Day 1

Cocos 编辑器基础：

- Scene
- Node
- Component
- Transform
- Camera
- Light
- Preview

产物：

> 小型灰盒棋盘。

---

## Day 2

TypeScript + Component：

- 创建脚本
- 挂脚本
- start()
- Console
- 获取 Node
- Node Position

产物：

> 代码可以控制对象。

---

## Day 3

BoardManager：

- Tile 顺序
- Tile Index
- 查找 Tile
- 棋子定位

产物：

> 输入 Index，棋子可以到对应格子。

---

## Day 4

DiceSystem：

- D6
- 两颗骰子
- total
- Console 测试

产物：

> 每次可以生成 2～12。

---

## Day 5

PlayerController：

- currentTileIndex
- move()
- 玩家位置

产物：

> 玩家根据骰子点数移动。

---

## Day 6

TurnManager：

```text
P1 → P2 → P3 → P4
```

产物：

> 四人轮流行动。

---

## Day 7

第一次完整核心循环：

```text
当前玩家
↓
Roll
↓
Move
↓
Resolve Tile
↓
End Turn
↓
Next Player
```

这就是第一个真正的 milestone。

---

# 30. 第二周之后

再进入：

```text
Property
↓
Economy
↓
Rent
↓
Chance
↓
Destiny
↓
Bankruptcy
↓
Victory
```

完成后才进入：

```text
UI
↓
正式地图
↓
角色
↓
动画
↓
音乐
↓
微信小游戏
```

---

# 31. 最开始甚至不要让 Codex 一次做整个游戏

错误方式：

```text
“Codex，帮我制作一个 3D 大富翁小游戏。”
```

这样非常容易：

- 架构混乱
- 文件过多
- Bug 很难定位
- 你不知道它改了什么
- 后期越来越难维护

---

# 32. 正确的 Codex 使用方式

每次只给一个 milestone。

例如第一轮：

```text
请先检查当前 Cocos Creator 项目结构。

本轮只完成 v0.1-A：
1. 建立基础目录结构
2. 创建 Main Scene
3. 建立 Board / Players / Managers 节点结构
4. 使用基础 3D Primitive 作为占位
5. 不实现地产、经济、UI、动画
6. 完成后输出变更报告

不要越界实现后续功能。
```

第二轮再：

```text
v0.1-B：BoardManager
```

第三轮：

```text
v0.1-C：DiceSystem
```

以此类推。

---

# 33. 推荐 v0.1 拆分

```text
v0.1-A
Project Foundation

v0.1-B
Board System

v0.1-C
Dice System

v0.1-D
Player Movement

v0.1-E
Turn System

v0.1-F
Tile Resolution

v0.1-G
Economy

v0.1-H
Property

v0.1-I
Bankruptcy + Victory

v0.1-J
Integration & Bug Fix
```

不要一次全部做。

---

# 34. 新手最常见错误

## 错误 1：脚本写了但没有运行

原因通常：

> 没挂到 Node。

检查：

```text
Hierarchy
→ 找到 Node
→ Inspector
→ 看有没有你的 Component
```

---

## 错误 2：修改了代码但游戏没变化

检查：

- Console 有没有红色 Error
- 脚本是否正确挂载
- 当前运行的是不是正确 Scene
- Scene 是否保存
- 是否有编译错误

---

## 错误 3：游戏运行黑屏

检查：

- 是否有 Camera
- Camera 是否朝向对象
- 对象是不是在 Camera 后方
- 灯光是否存在
- Scale 是否为 0
- Camera 是否启用

---

## 错误 4：Cube 看不到

检查 Transform：

```text
Position
Scale
```

尤其：

```text
Scale = 0
```

或者放太远。

---

## 错误 5：Hierarchy 越来越乱

不要：

```text
Cube
Cube
Cube
Cube
Capsule
Cube
Capsule
...
```

应该：

```text
Board
├── Tile_00
├── Tile_01
└── ...

Players
├── Player_1
├── Player_2
└── ...

Managers
├── GameManager
├── TurnManager
└── ...
```

---

## 错误 6：过早开始精致建模

如果：

```text
骰子 → 移动 → 地产 → 租金
```

还没跑通，

就不要开始批量制作 20 个地标。

---

## 错误 7：让 Codex 无限自由发挥

一定写：

```text
本轮范围
禁止范围
验收标准
完成报告
```

---

# 35. 建议 Hierarchy 最终长这样

第一版：

```text
Main
│
├── Environment
│   ├── Main Camera
│   └── Directional Light
│
├── Board
│   ├── Tile_00
│   ├── Tile_01
│   ├── Tile_02
│   ├── ...
│   └── Tile_31
│
├── Players
│   ├── Player_1
│   ├── Player_2
│   ├── Player_3
│   └── Player_4
│
├── Managers
│   ├── GameManager
│   ├── TurnManager
│   ├── BoardManager
│   ├── DiceSystem
│   └── EconomySystem
│
└── UI
```

---

# 36. 正式地标什么时候进来

等 v0.1 核心完成之后。

比如当前：

```text
Tile_07
Name = Paris
```

画面只是：

```text
□
```

到了正式版本：

```text
Tile_07
│
├── Ground
├── EiffelTower
├── Street
├── Trees
└── Effects
```

但是：

```text
TileData
price
rent
owner
```

完全不需要重写。

这就是为什么现在必须做好架构。

---

# 37. Blender / Lux3D 什么时候使用

不要在 v0.1 使用。

建议：

```text
v0.1 Core
↓
v0.2 Rules
↓
v0.3 UI
↓
v0.4 3D Foundation
↓
v0.5 Blender / Lux3D / Tripo / Meshy
```

此时模型通过：

```text
FBX / glTF / GLB
```

等格式进入 Cocos。

---

# 38. 音乐什么时候使用

建议：

```text
v0.8
```

因为音乐不会决定核心玩法能否成立。

你现在已经可以提前研究：

- Suno
- ElevenLabs
- 地图音乐风格

但不要让音乐制作阻塞程序开发。

---

# 39. 微信小游戏什么时候测试

不要等 v1.0 才第一次测试微信。

建议：

### v0.1 后期

做一次最简单构建测试：

```text
Cocos
→ Project
→ Build
→ WeChat Mini Game
```

确保：

> 项目基础架构能够在微信小游戏环境跑起来。

然后：

### v0.5

再测一次模型 / 包体 / 性能。

### v0.8

测音频。

### v0.9

进行完整微信小游戏优化。

---

# 40. 微信小游戏最终构建逻辑

正式阶段需要：

1. 安装微信开发者工具
2. 准备微信小游戏 AppID
3. 在 Cocos Creator 配置微信开发者工具路径
4. 打开构建发布
5. 选择微信小游戏
6. 填写 AppID
7. Build
8. Run
9. 微信开发者工具打开
10. 真机测试

现在不用急着做。

---

# 41. 你现在立刻只做这 10 件事

如果你今天刚下载 Cocos Creator：

## ①

打开：

```text
Cocos Dashboard
```

## ②

确认已安装 Creator 3.x 编辑器。

## ③

新建：

```text
Monopoly3D_v0.1_Core_Prototype
```

## ④

选择 Empty 项目。

## ⑤

建立：

```text
assets/scenes
assets/scripts
assets/materials
assets/prefabs
```

## ⑥

创建并保存：

```text
Main.scene
```

## ⑦

创建：

```text
Board
```

并在里面放 8～12 个 Cube。

## ⑧

创建：

```text
Players
```

并放 4 个 Capsule。

## ⑨

把 Camera 调整到能看到整个棋盘。

## ⑩

点击 Preview。

如果你能看到：

> 棋盘 + 四个玩家占位棋子

就先停下来。

这代表：

# v0.1-A 的场景基础已经开始成功建立。

---

# 42. 下一步才做什么

下一步不是美术。

而是：

```text
TypeScript
↓
GameManager
↓
BoardManager
↓
DiceSystem
↓
PlayerController
↓
TurnManager
```

然后第一次实现：

```text
点击 / 调用 Roll
↓
得到骰子点数
↓
Player 1 移动
↓
切 Player 2
```

这会成为你的第一个真正“能玩”的版本。

---

# 43. 推荐开发原则

以后整个项目都遵守：

## 原则 1

先逻辑，后美术。

## 原则 2

先灰盒，后正式模型。

## 原则 3

先单机规则，后联网。

## 原则 4

先数据结构，后动画。

## 原则 5

核心逻辑和美术表现分离。

## 原则 6

Codex 每次只执行一个明确 milestone。

## 原则 7

每一个版本都有明确验收标准。

## 原则 8

每完成一个稳定版本就备份 / Git Commit。

---

# 44. 最终开发总流程

```text
IDEA
│
▼
规则设计
│
▼
Cocos 灰盒
│
▼
Board
│
▼
Dice
│
▼
Movement
│
▼
Turns
│
▼
Tiles
│
▼
Economy
│
▼
Properties
│
▼
Chance / Destiny
│
▼
Bankruptcy
│
▼
Victory
│
▼
UI
│
▼
3D Environment
│
▼
Landmarks
│
▼
Characters
│
▼
Animation
│
▼
Audio
│
▼
WeChat Adaptation
│
▼
Performance
│
▼
QA
│
▼
v1.0
```

---

# 45. 官方参考

Cocos Creator 3.8 官方用户手册：

https://docs.cocos.com/creator/3.8/manual/zh/

Dashboard：

https://docs.cocos.com/creator/3.8/manual/zh/getting-started/dashboard/

Hello World / 新手项目：

https://docs.cocos.com/creator/3.8/manual/en/getting-started/helloworld/

微信小游戏发布：

https://docs.cocos.com/creator/3.8/manual/zh/editor/publish/publish-wechatgame.html

---

# 46. 当前状态检查表

你可以每次回来继续勾。

## v0.1-A — Project Foundation

- [ ] Cocos Dashboard 正常
- [ ] Creator Editor 正常
- [ ] 创建项目
- [ ] 创建 Main.scene
- [ ] 创建目录
- [ ] 创建 Board
- [ ] 创建测试 Tiles
- [ ] 创建 Players
- [ ] Camera 调好
- [ ] Light 正常
- [ ] Preview 正常
- [ ] HelloGame.ts 正常
- [ ] Console 输出正常

## v0.1-B — Board System

- [ ] 32 个 Tile
- [ ] Tile 编号
- [ ] BoardManager
- [ ] Tile Position
- [ ] 指定 Index 可定位

## v0.1-C — Dice System

- [ ] DiceSystem
- [ ] D6 × 2
- [ ] 返回 2～12
- [ ] Console 正确

## v0.1-D — Player Movement

- [ ] PlayerController
- [ ] currentTileIndex
- [ ] move()
- [ ] 绕过终点
- [ ] 回到起点
- [ ] 起点奖励

## v0.1-E — Turn System

- [ ] Player 1
- [ ] Player 2
- [ ] Player 3
- [ ] Player 4
- [ ] 循环
- [ ] 防止非当前玩家行动

## v0.1-F — Tile System

- [ ] PROPERTY
- [ ] CHANCE
- [ ] DESTINY
- [ ] TAX
- [ ] START
- [ ] SPECIAL

## v0.1-G — Economy

- [ ] 初始资金
- [ ] 付款
- [ ] 收款
- [ ] 奖励
- [ ] 罚款
- [ ] 租金

## v0.1-H — Property

- [ ] price
- [ ] rent
- [ ] owner
- [ ] buy
- [ ] pay rent

## v0.1-I — End Game

- [ ] bankruptcy
- [ ] 移除破产玩家
- [ ] 剩余玩家统计
- [ ] 最后一人胜利
- [ ] 游戏结束

## v0.1-J — Integration

- [ ] 完整一局
- [ ] 无阻断 Bug
- [ ] Console 无严重 Error
- [ ] 保存版本
- [ ] Git Commit / 备份
- [ ] 微信小游戏初步构建测试

---

# 结论

你现在最重要的目标不是：

> “做一个漂亮的大富翁。”

而是：

> **“做一个可以完整玩的大富翁。”**

先得到：

```text
不好看
但能玩
```

再一步一步变成：

```text
能玩
↓
好用
↓
好看
↓
有动画
↓
有音乐
↓
有正式角色
↓
有世界地标
↓
微信小游戏可发布
```

这会是整个项目风险最低、返工最少的开发路线。

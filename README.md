# Monopoly3D · 3D 大富翁

使用 **Cocos Creator 3.8.8 + TypeScript** 开发的回合制 3D 大富翁原型，目标平台为微信小游戏。

当前 **v0.1 Core Prototype** 使用 9 格灰盒棋盘和 4 个本地玩家，围绕「掷骰 → 移动 → 落地结算 → 切换回合」实现核心玩法，包含地产购买与收租、随机事件、机场旅行和监狱规则。

> 项目仍处于核心玩法验证阶段。仓库提供 Cocos 工程源码，尚未构建或发布微信小游戏；完整棋盘、正式美术资产和胜负结算不属于当前版本。

[快速开始](#快速开始) · [操作方式](#操作方式) · [棋盘与规则](#棋盘与规则) · [项目结构](#项目结构) · [开发文档](#开发文档)

## 当前功能

| 系统 | v0.1 内容 |
| --- | --- |
| 回合与移动 | 4 个本地玩家依次行动，双骰掷点，逐格移动动画与落地结算 |
| 玩家经济 | 独立玩家余额，通过 `EconomySystem` 统一处理收入与支出 |
| 地产 | 无主地产购买或跳过；停在他人地产支付租金，自有地产免租 |
| 机会 / 命运 | 加钱、扣钱、前进、后退；移动事件结束后再次结算落点 |
| 机场 | 选择付费前往 Paris，或留在原地；抵达后处理购买或租金 |
| 监狱 | 停在监狱即入狱；下次轮到该玩家时跳过 1 回合并自动释放 |
| 前往监狱 | 从功能格直接移至监狱，进入同一套监狱流程 |
| 免费停车 | 无资金变化、无额外移动，正常结束回合 |

## 快速开始

### 环境

- **Cocos Dashboard / Cocos Creator 3.8.8**：版本以 `package.json` 为准。
- **Git**：也可以从 GitHub 下载 ZIP 并解压。
- 浏览器：用于编辑器内的浏览器预览。

### 打开并预览

1. 克隆仓库：

   ```bash
   git clone https://github.com/SharkyTang/Monopoly3D.git
   cd Monopoly3D
   ```

2. 在 **Cocos Dashboard** 中导入项目，选择包含 `package.json` 的 `Monopoly3D` 根目录。
3. 使用 **Cocos Creator 3.8.8** 打开，等待资源导入和脚本编译完成。
4. 在资源管理器中打开 [`assets/scenes/Main.scene`](assets/scenes/Main.scene)。
5. 使用编辑器顶部的浏览器预览入口运行当前场景。

首次打开时，Cocos 会重新生成 `library/` 和 `temp/`。`tsconfig.json` 引用的 `temp/tsconfig.cocos.json` 也由编辑器生成。当前工程没有 npm 依赖、`npm start`、独立构建或自动化测试脚本。

如需查看归档时的固定版本，可访问 **[`v0.1` 标签](https://github.com/SharkyTang/Monopoly3D/tree/v0.1)**。`main` 用于后续更新，基线归档说明见 [v0.1 baseline](docs/baseline/v0.1-baseline.md)。

## 操作方式

当前主场景提供 4 个本地玩家，由同一设备上的操作依次推进回合。

| 场景按钮 | 操作 |
| --- | --- |
| `ROLL DICE` | 为当前玩家掷两个骰子，每个骰子为 1–6 点，按总点数移动 |
| `BUY` / `SKIP` | 停在可购买的无主地产时，购买或跳过 |
| `Travel to Paris` / `Stay Here` | 停在机场时，付费旅行或留在原地 |

骰子结果和当前回合显示在场景 UI 中，资金变化与事件结算可在浏览器开发者工具的 Console 中查看。等待移动和落地事件完成后，再进行下一次操作。

## 棋盘与规则

当前棋盘包含以下 9 格，顺序与 `BoardManager.tiles` 及 `TileDatabase` 对应。

| 节点 | 名称 / 类型 | 当前规则 |
| --- | --- | --- |
| `Tile_00` | Start / `START` | 正向经过或最终停在起点可获 2000 奖励；开局站在起点不奖励 |
| `Tile_01` | Paris / `PROPERTY` | 价格 1600，基础租金 200 |
| `Tile_02` | Chance / `CHANCE` | 随机触发资金或移动事件 |
| `Tile_03` | Destiny / `DESTINY` | 随机触发资金或移动事件 |
| `Tile_04` | Tax / `TAX` | 扣除 1000 |
| `Tile_05` | Jail / `JAIL` | 入狱，下次轮到时跳过 1 回合并自动释放 |
| `Tile_06` | Airport / `SPECIAL` | 可支付 500 直达 Paris，或选择停留 |
| `Tile_07` | Go To Jail / `GO_TO_JAIL` | 直接移动至 `Tile_05` 并入狱 |
| `Tile_08` | Free Parking / `FREE_PARKING` | 无额外效果 |

每位玩家的场景初始资金为 **15000**。普通向前移动经过起点会发放奖励；向后经过但未停在起点不奖励。机场旅行和强制入狱采用直接移动，不触发起点奖励。

这些规则是当前原型的简化规则。例如，监狱暂不提供掷出双骰同点、支付罚款或使用卡牌脱狱，免费停车也没有税款资金池或奖金机制。

## 项目结构

```text
Monopoly3D/
├── assets/
│   ├── scenes/Main.scene       # 主场景：9 格棋盘、4 个玩家与交互 UI
│   ├── materials/              # 玩家颜色材质
│   ├── prefabs/                # 预留的预制体目录
│   └── scripts/
│       ├── core/               # GameManager：流程协调；TurnManager：玩家轮转
│       ├── board/              # 棋盘节点与格子顺序
│       ├── player/             # 移动控制、玩家经济数据
│       ├── dice/               # 双骰点数生成
│       ├── economy/            # 资金查询与变更
│       ├── tile/               # 格子类型、数据与落地规则
│       ├── chance/             # 机会卡类型与数据
│       ├── destiny/            # 命运卡类型与数据
│       ├── jail/               # 玩家监狱状态
│       └── ui/                 # 地产购买面板
├── docs/                       # 交接文档、历史记录、路线图与归档清单
├── settings/                   # Cocos 项目设置
├── .creator/                   # 编辑器相关文件
├── package.json                # 项目信息与引擎版本
└── tsconfig.json               # TypeScript 配置
```

`GameManager` 协调掷骰、移动、购买选择及后续结算；`TileSystem` 识别落点并登记待处理事件；`PlayerController` 执行移动。所有资金变更经由 `EconomySystem`。

继续开发时请保留资源的 `.meta` 文件与 UUID，并保持场景中的 Inspector 引用一致。普通移动、机场旅行和强制入狱有各自的移动入口；`TileSystem.resolveLanding()` 返回 `true` 当前仅表示等待地产购买决定。具体约定见 [最新交接文档](docs/Monopoly3D_v0.1_FreeParking_Handoff.md)。

## 后续方向

下一阶段建议为 **Board v0.2 — Full Board Foundation**：先规划约 28–32 格的完整棋盘数据和格子分布，再逐步加入世界地标地产与 3D 地图资产。这些内容仍属于规划。

破产与胜负结算、存档 / 读档、联网对战，以及微信小游戏构建和发布，均不属于当前 v0.1 已交付范围。完整长期设想见 [早期路线图](docs/roadmap/WeChat_Monopoly3D_Cocos_Beginner_Roadmap.md)。

## 开发文档

- [文档索引](docs/README.md)：当前交接、历次系统记录与路线图入口。
- [FREE_PARKING 阶段交接](docs/Monopoly3D_v0.1_FreeParking_Handoff.md)：当前 v0.1 的规则、既有运行验收记录与开发约定。
- [v0.1 基线归档说明](docs/baseline/v0.1-baseline.md)：归档来源、保留内容和核验范围。
- [文件校验清单](docs/baseline/v0.1-manifest.json)：归档时原工程和原始参考文档的 SHA-256 记录。

当前功能说明依据仓库源码、场景配置和既有交接文档。基线归档做过文件一致性与静态引用核验；本次 README 更新核对了代码和配置，未重新运行 Cocos 场景或执行微信小游戏构建。运行验收记录以对应交接文档为准。

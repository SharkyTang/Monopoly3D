# Monopoly3D — Board v0.2 Full Board Foundation Handoff

> 状态：**Stable（灰盒棋盘与现有规则回归）**  
> 日期：2026-09-23  
> 引擎：Cocos Creator 3.8.8  
> 本机工程：`/Users/shaoqitang/Documents/GameProjects/Monopoly3D_v0.1_Core_Prototype`  
> Git 分支：`board-v0.2-direct-migration`

## 1. 本轮完成与恢复点

本轮直接迁移当前本机工程，没有建立长期并行的 9 格与 32 格活动版本。迁移前先只读确认 9 格 Preview、`BoardManager Tiles = 9`、最新版 `PropertyGroup.ts` / `TileData.ts` / `TileDatabase.ts` 和 Git 状态。原仓库当时没有提交；当前稳定 9 格基线已保存为根提交。

| 提交 | 用途 |
|---|---|
| `0c2d441` | 9 格 Step 1C 稳定基线 checkpoint，位于 `main` |
| `852e5cc` | 32 格数据、场景实体和 BoardManager 同步迁移 |
| `dccb2be` | 修复命运移动落在机会格后，机会 MOVE 未继续执行的固定布局冲突 |

恢复 9 格基线时可从 `main` / `0c2d441` 建立独立工作树；不要在 32 格分支上覆盖或清理用户文件。`.creator/` 与 `.DS_Store` 是本机生成的未跟踪文件，不属于本轮提交。

## 2. 32 格灰盒棋盘

`assets/scripts/tile/TileDatabase.ts` 现在有 32 条活动数据；`assets/scenes/Main.scene` 中有 `Tile_00` 至 `Tile_31` 共 32 个唯一节点，沿方形周边顺序排列。`BoardManager.tiles` 为 32 项，数组位置与同编号实体节点、`TileData.id` 严格一致。四名玩家 `currentTileIndex` 均为 0，起点仍在 START。主摄像机已调整，以容纳完整棋盘。现阶段仍是灰盒，不含地标建筑。

| Index | 名称 / 类型 | Group | Price | Base Rent |
|---:|---|---|---:|---:|
| 00 | START | — | — | — |
| 01 | Paris / PROPERTY | 1 | 1600 | 200 |
| 02 | London / PROPERTY | 1 | 1800 | 230 |
| 03 | CHANCE | — | — | — |
| 04 | Barcelona / PROPERTY | 1 | 2000 | 260 |
| 05 | Rome / PROPERTY | 2 | 2200 | 300 |
| 06 | Airport West / SPECIAL TRANSPORT | — | — | — |
| 07 | Athens / PROPERTY | 2 | 2500 | 340 |
| 08 | FREE_PARKING | — | — | — |
| 09 | Istanbul / PROPERTY | 2 | 2800 | 390 |
| 10 | Cairo / PROPERTY | 3 | 3000 | 430 |
| 11 | DESTINY | — | — | — |
| 12 | Dubai / PROPERTY | 3 | 3400 | 480 |
| 13 | TAX | — | — | — |
| 14 | Casablanca / PROPERTY | 3 | 3800 | 540 |
| 15 | CHANCE | — | — | — |
| 16 | JAIL | — | — | — |
| 17 | Singapore / PROPERTY | 4 | 4000 | 580 |
| 18 | Kuala Lumpur / PROPERTY | 4 | 4500 | 650 |
| 19 | DESTINY | — | — | — |
| 20 | Sydney / PROPERTY | 4 | 5000 | 730 |
| 21 | Tokyo / PROPERTY | 5 | 5200 | 780 |
| 22 | Airport East / SPECIAL TRANSPORT | — | — | — |
| 23 | Seoul / PROPERTY | 5 | 5800 | 880 |
| 24 | GO_TO_JAIL | — | — | — |
| 25 | Shanghai / PROPERTY | 5 | 6400 | 980 |
| 26 | New York / PROPERTY | 6 | 6800 | 1050 |
| 27 | CHANCE | — | — | — |
| 28 | San Francisco / PROPERTY | 6 | 7600 | 1180 |
| 29 | TAX | — | — | — |
| 30 | Rio de Janeiro / PROPERTY | 6 | 8400 | 1350 |
| 31 | DESTINY | — | — | — |

计数：18 PROPERTY（6 组 × 3）、3 CHANCE、3 DESTINY、2 TAX、2 SPECIAL，以及 START、JAIL、GO_TO_JAIL、FREE_PARKING 各 1。全部地产显式写 `ownerId: null`。两处 TAX 均为 1000。两个机场均收 500：West（Tile_06）仅传送到 Paris（Tile_01）；East（Tile_22）仅传送到 Shanghai（Tile_25）。这是本阶段单目的地配置，未增加目的地选择功能。

## 3. 保留的行为边界

- 初始金钱 15000；经过或停在 START 加 2000，向后经过 START 不加，开局站在 START 不加。机场传送和强制入狱移动不发 START 奖励。
- 所有资金变化继续通过 `EconomySystem.addMoney()` / `removeMoney()`。
- `TileSystem.resolveLanding() === true` 只表示等待地产购买决定。购买、跳过、自有地产及租金流程保持原语义。
- CHANCE / DESTINY 的 MOVE 由 `GameManager` 接管异步移动并在完成后再次结算落地；机场仍使用 `moveToTileForTransport()`；入狱仍使用 `moveToTileForForcedMove()`。
- FREE_PARKING 无资金、UI 或额外移动效果；监狱沿用“跳过一次后自动释放”的 v0.1 规则。
- 32 格固定布局中，Tile_19 / Tile_31 的 DESTINY 后退 4 格会落在 CHANCE。`GameManager.ts` 仅补上这一连锁所需的机会 MOVE 处理，没有重写稳定系统，也没有宣称支持无限事件链。

## 4. Cocos Preview 回归记录

以下均在本机 Cocos Creator 3.8.8 打开的当前工程中运行 Preview，并查看 Chrome Console。为可重复覆盖指定格，部分测试在 DevTools 中固定骰子结果或卡片随机值，并临时设置玩家起始索引；随机函数在测试结束后恢复。这些测试只改变 Preview 的内存状态，没有写入场景或正式规则。

| 路径 | 已观察结果 |
|---|---|
| 启动 | `Loaded 32 tiles`；Tile 0 到 31 的日志与实体编号一致 |
| 整圈移动 / START | 玩家逐格经过 01 至 31，回到 00；15000 → 17000 |
| 地产 BUY / SKIP / 租金 | London 1800 购买成功；他人落地支付 230、业主收到 230；自有地产免租；Kuala Lumpur 跳过购买后正常换手 |
| TAX ×2 | Tile_13 与 Tile_29 均扣 1000 |
| CHANCE | 加钱卡 +1000、扣钱卡 -500；MOVE 卡在命运连锁中继续移动 |
| DESTINY | 加钱卡 +3000、扣钱卡 -2000；Tile_19 后退 4 至 Chance_15，再前进 3 至 Kuala Lumpur_18，出现正确购买面板 |
| GO_TO_JAIL / JAIL | Tile_24 强制移至 Tile_16 并设置 `isInJail=true`；下一次轮到该玩家时跳过并自动释放 |
| FREE_PARKING | Tile_08 无效果，正常换手 |
| Airport West | Tile_06 扣 500，传送至 Paris_01；不发 START 奖励，落地出现购买面板 |
| Airport East | Tile_22 扣 500，传送至 Shanghai_25；不发 START 奖励，落地出现购买面板，购买成功后 `ownerId=1` |
| Airport → Rent | 另一玩家从 East 传送至已购 Shanghai，立即支付 980 租金给业主，并正常换手 |

场景 JSON 检查：32 个唯一、顺序一致的 `BoardManager.tiles` 引用；32 个 `Tile_00` 至 `Tile_31` 节点；四名玩家索引均为 0。数据检查：连续 id 0–31、类型数量匹配、18 个地产的 `price` / `baseRent` / `ownerId` / `propertyGroup` 均存在。`git diff --check` 通过。Preview 没有出现项目脚本的阻塞报错。

测试时 Chrome 扩展产生 3 条 `message channel closed` Promise 错误，在迁移前 9 格 Preview 中也存在；一次重复提交调试命令触发 `Player_4 is already moving` 警告，属于测试操作。Cocos 编辑器历史 Console 中还有 2026-09-21 的 `PropertyPurchasePanel` 重复 `cc.UITransform` 旧错误；当前 32 格 Preview 的购买流程已实际运行，未观察到新的项目级阻塞错误。

## 5. 下阶段边界

本 handoff 的稳定结论只覆盖 **Board v0.2 Full Board Foundation 灰盒与上述 Cocos Preview 回归**。尚未进行微信小游戏构建、真机测试或发布，也未加入 3D 地标资产。下一阶段可在此 checkpoint 上规划美术资产与微信小游戏构建验证；不要顺手加入破产、胜利、存档、房屋、地产升级、组别加成、拍卖、交易或多目的地机场 UI。

接续开发前，先确认 Cocos 打开的仍是上述本机工程及 `board-v0.2-direct-migration` 分支，再从当前最新提交继续。保留 9 格 checkpoint 作为恢复点。

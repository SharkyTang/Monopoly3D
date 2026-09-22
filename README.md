# Monopoly3D — v0.1 基线

使用 **Cocos Creator 3.8.8** 制作、面向微信小游戏的 3D 大富翁原型。本次归档固定 FREE_PARKING 完成后的 9 格灰盒版本，保存当前源码、场景、资源引用与开发交接文档。

**版本入口：[`v0.1` 标签](https://github.com/SharkyTang/Monopoly3D/tree/v0.1)**。后续开发可以继续推进，查阅或恢复本次基线时以该标签为准。

## 打开项目

1. 克隆仓库，或在 GitHub 的 `v0.1` 标签页面下载并解压 ZIP。
2. 在 Cocos Dashboard 中导入包含 `package.json` 的项目根目录，使用 **3.8.8** 打开。
3. 等待 Cocos 完成资源导入，打开 `assets/scenes/Main.scene`。
4. 使用编辑器的浏览器预览运行场景。

`library/`、`temp/` 是编辑器生成文件，首次打开时会重新生成。`tsconfig.json` 继承的 `temp/tsconfig.cocos.json` 也由 Cocos 生成。项目当前没有配置 npm 测试或独立构建脚本。

## 当前基线

| 格子 | 类型 / 功能 |
| --- | --- |
| Tile_00 | START |
| Tile_01 | Paris / PROPERTY |
| Tile_02 | CHANCE |
| Tile_03 | DESTINY |
| Tile_04 | TAX |
| Tile_05 | JAIL |
| Tile_06 | Airport / SPECIAL / TRANSPORT |
| Tile_07 | GO_TO_JAIL |
| Tile_08 | FREE_PARKING |

按既有交接记录，移动与回合、经济、地产购买、租金、START、TAX、CHANCE、DESTINY、JAIL、Airport、GO_TO_JAIL 和 FREE_PARKING 已完成此前的小阶段验收。

FREE_PARKING 保持无资金变化、无奖励、无 UI、无额外移动，`resolveLanding()` 返回 `false`，正常结束回合。该方法返回 `true` 仍只表示等待地产购买决定。

## 文件与文档

- `assets/`：20 个 TypeScript 脚本、Main 场景、4 个玩家材质和原有 `.meta` 文件。
- `settings/`、`.creator/`、`package.json`、`tsconfig.json`：原有项目配置。
- [最新交接文档](docs/Monopoly3D_v0.1_FreeParking_Handoff.md)：当前 v0.1 规则与此前验收记录。
- [文档索引](docs/README.md)：历次交接、提示词与早期路线图。
- [归档说明](docs/baseline/v0.1-baseline.md)：来源、排除项及本次核验范围。
- [文件校验清单](docs/baseline/v0.1-manifest.json)：原工程与归档文件的 SHA-256。

本次只做版本整理，没有修改游戏脚本、场景、材质或原有 UUID。已完成文件一致性和静态引用核验；本次归档没有重新运行游戏，也没有构建或发布微信小游戏。详细运行验收记录来自上述既有交接文档。

后续建议阶段为 Board v0.2 — Full Board Foundation；该阶段功能不属于此标签。

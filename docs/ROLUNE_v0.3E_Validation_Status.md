# ROLUNE v0.3E 验证记录（未完成）

日期：2026-09-23
工程：`Monopoly3D_v0.1_Core_Prototype`
分支：`gameplay-v0.3-depth-balance`
当前提交：`5c9188ed88e61131a1f18606b13e0fb9a76efd7b`（v0.3D）

## 已通过

- TypeScript 无阻塞错误，`git diff --check` 通过；没有改动受 Git 跟踪的源文件。
- 场景与数据检查：32 个唯一棋格、四名玩家各 10000、18 个地产、两处税格各 1000、机场各三个正确目的地及 500 费用。
- 真实 TypeScript 逻辑回归：四人轮转、棋盘循环与 START 奖励、BUY / SKIP / 自有地产 / RENT / 两处 TAX / FREE_PARKING / GO_TO_JAIL、机场六条路线、目的地 BUY / RENT、机场决策期间禁止掷骰。
- CHANCE 12 张卡回归通过：资金、前后移动、机场、地产、TAX、JAIL 和有限的 CHANCE / DESTINY 连锁落地。
- DESTINY 12 张卡回归通过：资金与四人结算、JAIL、START、地产、TAX 和 CHANCE 连锁落地。
- Cocos Preview 实际运行：32 格棋盘显示，四人各 10000，掷骰移动后显示购买面板；购买 Barcelona 扣除 2000 后轮到 Player 2，控制台无警告或错误。
- Cocos Creator 3.8.8 于 23:12:38 成功重新构建 `build/wechatgame`，耗时 4 秒。构建包包含本阶段机场、CHANCE、DESTINY 内容；`game.json` 设置为 `landscapeRight`。
- 微信开发者工具 Stable 2.02.2608060 打开最新构建，iPhone 15 Pro Max 模拟器横屏显示棋盘和 ROLL DICE；启动日志显示 32 格、四名玩家各 10000。
- 用户提供的调试器截图明确了 1 条错误和 1 条警告：错误为 `WAGame.js` 中的 `[jsbridge] invoke getSystemInfo fail: jsbridge not ready`，调用栈进入 `get_deviceOrientation`；警告为 `WAGame.js` 中关于基础库 3.7.0 起支持 HarmonyOS、可使用 `wx.getDeviceInfo()` 判断平台的接口提示。项目 `assets/` 脚本没有直接调用这些接口。结合游戏随后成功横屏加载、棋盘与玩家资金日志正常，这两条目前没有阻止启动；此结论不等于微信端玩法交互已通过。
- 2026-09-23 本轮复检：TypeScript 检查、`git diff --check` 和 Full / CHANCE / DESTINY 三组真实源码回归再次通过，未发现新增阻塞问题。

## 尚待微信模拟器验证

当前电脑控制接口可以读取微信窗口与截屏，但向小游戏画面发送鼠标点击持续失败（本轮重试仍返回 `noWindowsAvailable`）。微信开发者工具内置的小游戏画布自动化接口也需要更新其会话文件 `.cli`；该位置的写入权限申请未获批准，接口无法启动。因此微信端的掷骰、购买、机场选择及事件交互尚未实际点击验证。截图中的错误与警告均显示为微信运行时 `WAGame.js` 消息；虽然未见项目脚本栈帧，仍须通过实际交互完成微信端验收。

在已打开的微信开发者工具中完成：

1. 点击 ROLL DICE，确认移动、购买面板、BUY / SKIP、四人轮转；继续观察 RENT、两处 TAX、START、FREE_PARKING、JAIL / GO_TO_JAIL。
2. 分别从 Airport West / East 选择三个目的地，确认按钮可点、每次扣 500、无 START 奖励，到达地产后可 BUY 或支付 RENT；面板未处理时不能继续掷骰。
3. 在微信端抽样确认 CHANCE 与 DESTINY 的资金、移动、多人结算及移动后落地流程；各卡型的确定性逻辑已由上述自动回归覆盖。

## Checkpoint

由于微信模拟器点击流程仍未验证，**尚未建立 `v0.3E-wechat-stable` checkpoint**。当前稳定 checkpoint 保持为 v0.3D：`5c9188e`。现有未跟踪的 `.DS_Store` 和 `.creator/` 未被修改或提交。

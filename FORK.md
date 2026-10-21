# DayDayUp DSH — Fork 维护手册

本仓库是 [deepseek-ai/deepseek-harness](https://github.com/deepseek-ai/deepseek-harness) 的个人 fork，目标是长期跟随上游发布并自建 macOS 桌面版（后续做界面改造）。本文件记录分支策略、更新流程、回滚方法与对上游文件的改动清单。

## 基本信息

| 项 | 值 |
|---|---|
| 产品名 | DayDayUp DSH |
| 应用 ID（CFBundleIdentifier） | `com.saber.daydayupdsh` |
| 安装位置 | `/Volumes/saber/Applications/DayDayUp DSH.app`（与 `.prev.app` 同目录，外接盘） |
| 数据目录 | `~/.dsh`（留在系统卷；仅 283M，搬移需每次设 `DSH_HOME`，不划算） |
| 埋点 | 保留（上游默认） |
| 更新通道 | `dsh-v*` 正式版 + alpha/rc 预发布 tag |
| 当前基准 tag | `dsh-v0.2.1-rc.2` |
| 打包 worktree | `/Volumes/saber/dsh-build`（系统卷空间紧张，放大数据卷；`scripts/fork/config.env` 的 `FORK_WORKTREE`） |

## 远程与分支策略

- `origin` = `github.com/xihuanxiaosun/deepseek-harness`（我的 fork）
- `upstream` = `github.com/deepseek-ai/deepseek-harness`（上游，**只读，绝不推送**）
- `custom` = 我的日常工作分支，所有改动都在它上面；更新成功后快进到 `update/<tag>` 并推送 `origin`
- `master` = 上游镜像，不直接改动
- 跟踪上游**发布 tag**（`dsh-v*`），不跟 master 最新提交

## 改动存放约定

- 自建脚本：`scripts/fork/`（check-upstream、self-update、rollback 等）
- 自建功能包：`packages/fork/`（如 fork-updater）
- 少改上游已有文件；每改一个上游文件，必须登记到下面的清单

## 我改过的上游文件清单

预估合并冲突用。每次修改上游文件后更新此表。

| 上游文件 | 改动内容 | 改动日期 |
|---|---|---|
| `apps/desktop/scripts/electron-builder-config.mjs` | `productName` → `DayDayUp DSH`；`protocols[0].name` → `DayDayUp DSH`（第 108、116 行） | 2026-10-21 |
| `apps/desktop/scripts/desktop-package-environment.mjs` | unsigned 包 `DSH_DESKTOP_APP_ID` → `com.saber.daydayupdsh`；新增 `DSH_DESKTOP_PRODUCT_NAME`（第 31-33 行） | 2026-10-21 |
| `apps/desktop/scripts/smoke-packaged-runtime.ts` | 冒烟路径改用 `DSH_DESKTOP_PRODUCT_NAME`（原硬编码 `DeepSeek Harness.app`，第 15-18 行） | 2026-10-21 |
| `apps/desktop/scripts/package-macos.ts` | appPath 改用 `DSH_DESKTOP_PRODUCT_NAME`（第 81 行） | 2026-10-21 |
| `apps/desktop/scripts/package-target.ts` | 公证 appPath 改用 `DSH_DESKTOP_PRODUCT_NAME`（第 518 行） | 2026-10-21 |
| `apps/desktop/scripts/verify-retained-desktop.ts` | 发布校验 app 名改用 `DSH_DESKTOP_PRODUCT_NAME`（第 42 行） | 2026-10-21 |
| `packages/client/ui-theme/src/styles/design-platform.css` | 追加 CDS 色板重映射块（陶土主色/暖色明暗阶梯/品牌按钮），文件尾部覆盖 | 2026-10-21 |
| `packages/client/ui-workspace/src/client/rows/Rows.module.css` | CDS 行样式：10px 圆角、陶土文件夹芯片、数量徽标、选中态、时间 11px | 2026-10-21 |
| `packages/client/ui-workspace/src/client/rows/Rows.tsx` | 项目行加会话数徽标（`row.count.aria`） | 2026-10-21 |
| `packages/client/ui-workspace/src/client/rows/WorkspaceBrowser.module.css` | 分区标题小型大写字距；搜索展开为胶囊+发丝边 | 2026-10-21 |
| `packages/client/ui-workspace/src/client/locales.ts` | 新增 `row.count.aria`（中英） | 2026-10-21 |
| `packages/client/ui-chat/src/client/chat/ReasoningRow.module.css` | 思考体展开入场动画（160ms 淡入下滑，尊重 reduced-motion） | 2026-10-21 |
| `packages/client/ui-user-questions/src/client/QuestionComposer.module.css` | 决策卡：选中项陶土染色+编号牌、勾选框陶土填充、eyebrow 提暖 | 2026-10-21 |
| `packages/client/ui-user-questions/src/client/QuestionReplyView.module.css` | "已回答"标签提为陶土色 | 2026-10-21 |
| `packages/bundle/web-app/package.json` | 增加 `@deepseek-ai/dsh-client-ui-fork-brand` 依赖 | 2026-10-21 |
| `packages/bundle/web-app/cordis.patch.yml` | `ui-brand-official` 行替换为 `ui-fork-brand`（避免 official 档案下双注册冲突） | 2026-10-21 |

自建文件（上游不存在，不会产生冲突）：`FORK.md`、`scripts/fork/*`、`packages/fork/*`（现有：`ui-fork-brand` — DayDayUp DSH 侧边栏品牌位）。

## UI 改造基准（CDS）

界面以 open-claude-ui（Claude Design System 逆向还原，MIT）为基准：陶土 `#d97757`、暖色四层表面阶梯、18-20px 气泡圆角、小标签大写分区头。参考仓库克隆在 `/Volumes/saber/reference/open-claude-ui`（含离线 Storybook `docs/claude-components-storybook.html`）。令牌经 `design-platform.css` 尾部覆盖块全局生效；组件级借鉴按需移植，桌面壳（hiddenInset/vibrancy/合成音效）待做。

## 更新流程（阶段 4 落地后生效）

1. `scripts/fork/check-upstream`（只读）：fetch upstream tags → semver 找最新可更新 tag → `git merge-tree` 冲突预演 → 输出 JSON + 中文摘要
2. 在 dsh 内点"开始更新"（或手动执行）→ `scripts/fork/launch-update-in-terminal` 在终端里跑 `scripts/fork/self-update <tag>`
3. self-update 在 worktree `~/code/my-dsh-build` 里合并、打包（**先打完包确认成功才退出旧版**）→ 退出应用 → 备份 `~/.dsh` → 替换 `.app` → 重启 → 快进 `custom` 并推送 `origin`
4. 任何一步失败：不替换旧版；已退出则重开旧版；日志在 `~/Library/Logs/DayDayUp DSH/update-<时间戳>.log`

### 终端窗口自动关闭设置（一次性）

`self-update` 由 Terminal 运行，成功后自动关窗依赖此设置：
系统设置 → 描述文件 → Shell → 当 shell 退出时 → 选 **"如果 shell 干净退出则关闭"**。成功时窗口自动关闭，失败时保留窗口显示错误。

## 回滚

- 应用：`scripts/fork/rollback` 用 `/Applications/DayDayUp DSH.prev.app` 换回上一版
- 数据：`~/.dsh` 升级前的时间戳备份（保留最近 3 份），手动拷回
- 代码：`git reset --hard <旧基准tag>`（仅本地 custom，不影响已推送历史时；否则 `git revert`）

## 数据安全红线

- `~/.dsh` 只允许备份，不删除、不改写（会话格式会被新版本单向迁移）
- 不删除 `.prev.app` 以外的任何应用
- 不向上游推送/开 PR；不用 force push；不自动解决合并冲突

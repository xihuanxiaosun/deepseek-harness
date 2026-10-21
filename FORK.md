# DayDayUp DSH — Fork 维护手册

本仓库是 [deepseek-ai/deepseek-harness](https://github.com/deepseek-ai/deepseek-harness) 的个人 fork，目标是长期跟随上游发布并自建 macOS 桌面版（后续做界面改造）。本文件记录分支策略、更新流程、回滚方法与对上游文件的改动清单。

## 基本信息

| 项 | 值 |
|---|---|
| 产品名 | DayDayUp DSH |
| 应用 ID（CFBundleIdentifier） | `com.saber.daydayupdsh` |
| 安装后的应用 | `/Applications/DayDayUp DSH.app` |
| 数据目录 | `~/.dsh`（与官方版共用，本机未装官方版） |
| 埋点 | 保留（上游默认） |
| 更新通道 | `dsh-v*` 正式版 + alpha/rc 预发布 tag |
| 当前基准 tag | `dsh-v0.2.1-rc.2` |
| 打包 worktree | `~/code/my-dsh-build`（`custom` 的持久复用 worktree） |

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

自建文件（上游不存在，不会产生冲突）：`FORK.md`、`scripts/fork/*`、`packages/fork/*`。

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

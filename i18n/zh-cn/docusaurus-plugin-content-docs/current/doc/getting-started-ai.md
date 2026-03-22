---
title: AI Agent
sidebar_label: AI Agent
hide_title: false
hide_table_of_contents: false
---

# AI Agent

SRS 提供了多种使用 AI 的方式：您可以在 Telegram 或 Discord 中与 SRS Robot 对话快速获取解答，也可以通过 OpenClaw、Claude Code、Codex 或 Kiro 在本地运行 AI，使用预配置的 SRS 知识库进行开发和调试。

## SRS Robot

SRS 提供了基于 OpenClaw 构建的 AI 支持机器人，可在 Telegram 群组和 Discord 频道中使用。该机器人拥有涵盖 SRS 代码、文档和常见使用场景的深度知识库，并由最新的 AI 模型驱动。

您可以向 SRS 机器人咨询任何关于 SRS 的问题——如何使用、如何匹配使用场景、如何配置、如何排查问题，或其他任何疑问。机器人将基于最新的 SRS 知识库为您提供准确、及时的解答。

加入 SRS Telegram 群组：[https://t.me/+RiynvKOxpQ42MGJl](https://t.me/+RiynvKOxpQ42MGJl)

加入 SRS Discord 频道：[https://discord.gg/yZ4BnPmHAd](https://discord.gg/yZ4BnPmHAd)

进入群组后，@ SRS Robot 并直接提问即可。

## Claude Code

您可以在本地使用 Claude Code 与 SRS 代码库协作。SRS 内置了预配置的 `.claude` 目录，Claude Code 开箱即用，可以直接获取完整的项目上下文。

克隆 SRS 代码并启动 Claude Code：

```bash
git clone https://github.com/ossrs/srs.git
cd srs
claude
```

Claude Code 将自动加载 `srs/.claude` 中的配置，使其深度了解 SRS 代码库，您可以直接提问、调试问题、编写代码等。

## Codex

您也可以在本地使用 Codex 与 SRS 代码库协作。SRS 内置了预配置的 `.codex` 目录，Codex 开箱即用。

克隆 SRS 代码并启动 Codex：

```bash
git clone https://github.com/ossrs/srs.git
cd srs
codex
```

Codex 将自动加载 `srs/.codex` 中的配置。

## Kiro

您也可以在本地使用 Kiro 与 SRS 代码库协作。SRS 内置了预配置的 `.kiro` 目录，Kiro 开箱即用。

克隆 SRS 代码并启动 Kiro：

```bash
git clone https://github.com/ossrs/srs.git
cd srs
kiro-cli
```

Kiro 将自动加载 `srs/.kiro` 中的配置。

## OpenClaw

您可以创建一个带有 SRS 知识库的本地 OpenClaw Agent。首先克隆 SRS 代码：

```bash
git clone https://github.com/ossrs/srs.git
```

有两种方式将 Agent 指向 SRS 知识库：

- **直接设置工作空间** — 创建 Agent 时，将工作空间路径设置为 `srs/.openclaw`。
- **软链接** — 使用默认工作空间创建 Agent，然后删除默认工作空间目录，并将其替换为指向 `srs/.openclaw` 的软链接：

```bash
ln -sf ~/git/srs/.openclaw ~/.openclaw/workspace
```

Agent 启动后，列出可用的 Skill 并触发它们以加载知识库。Skill 会告诉 AI 需要加载哪些文件，以及如何更高效地处理 SRS 代码库相关的工作。

## Skills

在启动 OpenClaw、Claude Code、Codex 或 Kiro 并接入 SRS 代码库后，建议使用 Skill 以获得最佳效果。Skill 会为当前任务加载正确的知识库，并引导 AI 按照正确的工作流执行。

`srs-support` Skill 用于解答 SRS 项目相关的问题。它会根据您的问题自动加载相关知识库，让 AI 给出准确且有上下文的回答。

未来会持续添加更多 Skill。要查看当前可用的 Skill，直接问 AI 即可：

```
What skills can I use for SRS?
```

## 知识库

仅靠代码和文档，AI 无法真正理解和维护一个项目。项目背后有大量背景知识、设计思考、积累的经验、使用场景、社区沟通记录和调试工作流，这些内容只存在于人的脑海中，而不在任何文件里。SRS 知识库的目标，就是将这一切明确地记录下来。

知识库就是 OpenClaw 的 Memory——一系列文件，编码了 SRS 的背景、经验和上下文。它的构建方式是：让 AI 阅读代码和文档，再通过与 AI 对话将隐性知识挖掘出来并写成文件。随着时间推移，知识库将覆盖一切：不只是代码做了什么，还有为什么这样设计、如何思考问题、如何运营和维护这个项目。

知识库与代码共同构成 SRS 的唯一真理来源。知识库记录了代码无法表达的内容——背景、设计决策、使用场景、调试经验和社区知识。未来，传统文档将从知识库生成，并完全由 AI 维护。

在知识库之上，还有 Skill。Skill 是工作流，告诉 AI 如何处理特定任务，例如：

- **技术支持** — 解答用户问题，匹配使用场景
- **Issue 处理与修复** — 理解、复现和解决问题
- **功能开发** — 设计和实现新功能
- **项目维护** — 审查 Pull Request、管理发布、保持项目健康
- **调试** — 诊断和追踪代码库中的问题

每个 Skill 会加载知识库中相关的部分，并引导 AI 完成对应任务的正确工作流。这正是 AI 能够有效维护 SRS 的原因——不只是依靠原始智能，而是依托多年积累的结构化知识和工作流。

![](https://ossrs.net/gif/v1/sls.gif?site=ossrs.net&path=/lts/doc/zh/v7/getting-started-ai)

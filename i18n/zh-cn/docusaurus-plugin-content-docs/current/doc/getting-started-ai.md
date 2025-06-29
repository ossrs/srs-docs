---
title: AI Agent
sidebar_label: AI Agent
hide_title: false
hide_table_of_contents: false
---

# AI Agent

AI Agent是维护SRS和帮助您理解、调试、操作和开发SRS应用程序的强大工具。我们使用一套全面的AI Agent来维护SRS社区，并建立了AI遵循的指导原则，使您能够更高效地使用这些工具。

## Augment Code

Augment Code是一个非常强大的AI Agent，我们强烈推荐使用。我们为Augment Code配置了特定的设置和指导原则，让您只需用VSCode打开SRS项目，就能立即利用AI助手的全部功能。SRS为AI提供了全面的上下文信息，包括代码、文档和测试。

要使用Augment Code，首先安装VSCode，然后安装Augment Code扩展。请按照安装指南进行操作：[Install Augment for Visual Studio Code](https://docs.augmentcode.com/setup-augment/install-visual-studio-code)。

接下来，克隆SRS代码并确保打开根目录，该目录包含`.augment-guidelines`文件：

```bash
git clone https://github.com/ossrs/srs.git
cd srs
code .
```

您可以验证Augment Code设置以确保`Context`配置正确，然后通过向Augment Code提问来测试它，例如：

```
Will you follow any .augment-guidelines and .augmentignore of this project?
```

我们发现Augment Code对SRS代码库表现出深度的熟悉程度，可与经验丰富的维护者相媲美。有关使用Augment Code审查PullRequest和提高代码质量的实际示例，请参阅[AI Agent for SRS](https://medium.com/@winlinam/f9eb12a1ce74)。

## GitHub Copilot

GitHub Copilot是读写SRS代码的有效AI Agent。我们也将其用于PullRequest审查。虽然它是一个有价值的AI工具，但还不能完全达到经验丰富的维护者的专业水平。

## Pull Request

SRS还使用AI来帮助审查PullRequest，因此以AI能够有效理解您的更改和代码的方式来构建PullRequest非常重要。为确保最佳的AI审查效果，请遵循以下指导原则：

* 避免在PullRequest中重命名变量和函数，因为这会混淆AI分析。
* 避免重新排序函数或重构代码，因为这会使AI难以理解实际更改。
* 避免移动或重命名文件，因为这些对AI系统来说看起来像是重大更改。

如果您需要执行此类重构任务（重命名变量、函数或文件，或重新排序函数），请在主要功能PullRequest之前提交单独的PullRequest。明确注释重构PR不包含逻辑更改，这样我们可以跳过对该特定PR的AI审查。

## Comments

添加注释非常有益且推荐，特别是对于可能让您和AI都感到困惑的复杂逻辑。一般来说，如果您需要AI帮助来理解或澄清代码，您也应该要求AI为该代码添加注释。

注释总是有价值的且受欢迎的——将它们视为AI的提示。通过准确和全面的注释，AI可以更好地理解复杂代码和隐含的背景知识。通过保持这些良好实践，AI可以继续帮助提高项目质量并创造更好的维护体验。

您还应该利用AI生成简洁明了的CommmitMessage和PullRequest描述。不需要过多的文字——只需足够澄清代码中隐含的特殊上下文和知识即可。

![](https://ossrs.net/gif/v1/sls.gif?site=ossrs.net&path=/lts/doc/zh/v7/getting-started-ai)

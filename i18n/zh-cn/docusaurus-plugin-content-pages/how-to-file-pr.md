# HowToFilePR

欢迎给SRS贡献代码，请先阅读这个说明。

## Rules

* 请不要使用你的`4.0release`或`develop`分支，请使用`bugfix/bug-summary`，每个PR一个独立的分支。
* 若需要更新PR，请不要关闭之前的PR，不必新开PR，只需要提交到你自己的`bugfix/bug-summary`分支，PR会自动更新。
* 请不要夹带无关的代码，一个PR解决一个问题，或者支持一个功能，请不要夹带其他的有干扰的代码。
* 请花时间学习[Pro Git](https://git-scm.com/book/en/v2)，掌握GIT是非常必要的能力。

## File New PR

下图是提交到`4.0release`或其他分支的工作流：

[![Workflow](/img/HowToFilePR.png)](https://www.figma.com/file/5yAeoq2r3wwrXZwq1f93UH/How-to-File-PR-to-SRS)

**Step 1:** Fork SRS

请打开[ossrs/srs](https://github.com/ossrs/srs)，点击`Fork`，复制到你账号的仓库。

**Step 2:** Clone你的项目

```
git clone git@github.com:your-account/srs.git
git checkout -b master origin/master
cd srs
```

> Note: 请设置好你的GIT的配置项目`user.name`和`user.email`。

**Step 3:** 将SRS添加到remote源

```
git remote add srs https://github.com/ossrs/srs.git
git fetch srs
```

**Step 4:** 在提交PR前，同步SRS的代码

```
git fetch --all
```

**Step 5:** 为PR创建一个新的分支

```
git checkout -b bugfix/bug-summary srs/4.0release
```

> Note: 请认真给你的分支起一个名字，例如`bugfix/rtc-listen-ipv6`

**Step 6:** 完成编码，并提交到你的仓库

```
git push -u origin bugfix/bug-summary
```

> Note: 请在代码、注释和Commit中使用英文，请不要使用其他语言，也不要使用中文。

**Step 7:** 点击[这个链接](https://github.com/ossrs/srs/compare)，选择你的分支`bugfix/bug-summary`，提交到SRS的`4.0release`分支

> Remark: 请确保勾选上了`Allow edits and access to secrets by maintainers`，这样我们可以更新你的PR。

## Update Your PR

在Code Review之后，你可能需要更新你的PR，请执行命令：

```
git checkout bugfix/bug-summary
git commit -am 'Description for update'
git push
```

> Note: 请不要关闭和新开PR，你只需要更新你的分支就可以，PR会自动更新。

## Setup Your Email

提交代码前，需要设置你的[GitHub: Email](https://github.com/settings/emails)，请**不要选择**选项`Keep my email addresses private`，
它会导致你的PR无法显示名字。

请执行下面的命令，设置GIT账号（请换成你的账号）：

```bash
cd ~/git/srs
git config --local user.name "username"
git config --local user.email "useremail@xxx.com"
git config --list
```

PR合并后，你就会出现在[SRS: Contributors](https://github.com/ossrs/srs/graphs/contributors)这个列表中了。

## TOC: Update PR

Generally, TOC who has write access to SRS also are able to update the PR, please read [this post](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/committing-changes-to-a-pull-request-branch-created-from-a-fork).

Let's take a example of [PR #2908](https://github.com/ossrs/srs/pull/2908):

* Title: `SRT: url supports multiple QueryStrings`
* Fork: `https://github.com/zhouxiaojun2008/srs/tree/bugfix/fix-srt-url`
* Branch: `bugfix/fix-srt-url`

**Step 1:** Add a remote of PR fork, use SSH to clone the fork repository.

```bash
git remote add tmp git@github.com:zhouxiaojun2008/srs.git
```

**Step 2:** Update the fork repository, to get the branch.

```bash
git fetch tmp
```

**Step 3:** Now we got the branch of PR, switch to it.

```bash
git checkout bugfix/fix-srt-url
```

**Step 4:** Please update the branch, then push to the fork repository.

```bash
git push tmp bugfix/fix-srt-url
```

The PR should be updated automatically.

![](https://ossrs.net/gif/v1/sls.gif?site=ossrs.io&path=/lts/pages/how-to-file-pr-zh)



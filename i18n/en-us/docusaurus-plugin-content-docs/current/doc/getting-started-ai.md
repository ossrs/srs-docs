---
title: AI Agent
sidebar_label: AI Agent
hide_title: false
hide_table_of_contents: false
---

# AI Agent

AI Agents are powerful tools for maintaining SRS and helping you understand, debug, operate, and develop SRS applications. We use a comprehensive set of AI Agents to maintain the SRS community and have established guidelines for AI to follow, enabling you to use these tools more efficiently.

## Augment Code

Augment Code is an exceptionally powerful AI Agent that we highly recommend. We have configured specific settings and guidelines for Augment Code, allowing you to simply open the SRS project with VSCode and immediately leverage the full power of AI assistance. SRS provides comprehensive context for AI to work effectively, including code, documentation, and tests.

To use Augment Code, first install VSCode, then install the Augment Code extension. Follow the installation guide at [Install Augment for Visual Studio Code](https://docs.augmentcode.com/setup-augment/install-visual-studio-code).

Next, clone the SRS code and ensure you open the root directory, which contains the `.augment-guidelines` file:

```bash
git clone https://github.com/ossrs/srs.git
cd srs
code .
```

You can verify the Augment Code settings to ensure the `Context` is correctly configured, then test it by asking Augment Code a question like this:

```
Will you follow any .augment-guidelines and .augmentignore of this project?
```

We've found that Augment Code demonstrates deep familiarity with the SRS codebase, comparable to that of experienced maintainers. For a practical example of using Augment Code to review pull requests and improve code quality, see [AI Agent for SRS](https://medium.com/@winlinam/f9eb12a1ce74).

## GitHub Copilot

GitHub Copilot is an effective AI Agent for reading and writing SRS code. We also utilize it for pull request reviews. While it's a valuable AI tool, it doesn't quite match the expertise level of an experienced maintainer.

## Pull Request

SRS also uses AI to help review pull requests, making it important to structure your pull requests in a way that AI can effectively understand your changes and code. To ensure optimal AI review, please follow these guidelines:

* Avoid renaming variables and functions in your pull request, as this can confuse AI analysis.
* Avoid reordering functions or restructuring code, as this makes it difficult for AI to understand the actual changes.
* Avoid moving or renaming files, as these appear as major changes to AI systems.

If you need to perform such refactoring tasks (renaming variables, functions, or files, or reordering functions), please submit a separate pull request before your main feature pull request. Clearly comment that the refactoring PR contains no logic changes, so we can skip AI review for that specific PR.

## Comments

Adding comments is highly beneficial and recommended, especially for complex logic that might confuse both you and AI. Generally, if you need AI assistance to understand or clarify code, you should also ask AI to add comments for that code.

Comments are always valuable and welcome—think of them as prompts for AI. With accurate and thorough comments, AI can better understand complex code and implicit background knowledge. By maintaining these good practices, AI can continue to help improve project quality and create a better maintenance experience.

You should also leverage AI to generate brief and clear commit messages and pull request descriptions. There's no need for excessive text—just enough to clarify the special context and knowledge that is implicit in the code.

![](https://ossrs.io/gif/v1/sls.gif?site=ossrs.io&path=/lts/doc/en/v7/getting-started-ai)

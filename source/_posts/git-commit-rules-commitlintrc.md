---
title: Git commit rules 守門員 - commitlintrc
date: 2024-08-27 11:16:33
categories: git
tags:
- git
- commit
- commitlintrc
---

{% include_md %}
工程師百百種撰寫的 commit 也百百種，為了明確每個改動的 commit git 以免大家的個人特色太明顯XD (遇過每個 commit 都是 FuXk you 的)，其實有規範的大方向可以依循，以下列舉專案中制定的規則：
<!-- more -->

# Commit type
幾種常用的 commit 類型：
| Commit type                    | Prefix | Description                                       |
|:-------------------------------|:------:|:--------------------------------------------------|
|new feature                     |feat    |✨增加新功能                                       |
|fix bugs                        |fix     |🐛修复BUG                                          |
|add documents                   |docs    |📚文档注释                                         |
|adjust style look               |style   |💎样式修改                                         |
|add test code                   |test    |🚨增加测试                                         |
|revert commit                   |revert  |🗑回退                                              |
|optimize performance            |perf    |🚀性能优化                                         |
|build package                   |build   |🛠打包                                              |
|add ci code                     |ci      |⚙️与持续集成服务有关的改动                           |
|utilities for structure         |chore   |♻️构建过程或辅助工具的变动                           |
|review and clean code           |refactor|📦重构(既不增加新功能，也不是修复bug)                 |

# commitlintrc
制定團隊的 commit 規則可以在 commitlintrc 撰寫細節，提高團隊的工作效率：
```js
/**
 *  提交格式
 *  <类型>(范围): 简短描述
 *  例子 feat(首页): 首页新增xx功能
 */
module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat', // ✨增加新功能
        'fix', // 🐛修复BUG
        'docs', // 📚文档注释
        'style', // 💎样式修改
        'test', // 🚨增加测试
        'revert', // 🗑回退
        'perf', // 🚀性能优化
        'build', // 🛠打包
        'ci', // ⚙️与持续集成服务有关的改动
        'chore', // ♻️构建过程或辅助工具的变动
        'refactor', // 📦重构(既不增加新功能，也不是修复bug)
      ],
    ],
    // 'scope-empty': [2, 'never'],
    // subject 大小写不做校验
    'subject-case': [0],
  },
};

// 跳过eslint commitlint 校验：git commit --no-verify -m xxx
```
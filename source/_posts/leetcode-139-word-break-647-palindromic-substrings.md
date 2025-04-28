---
title: 優化演算法練習 Leetcode X Word Break & Palindromic Substrings
date: 2025-04-18 16:26:24
tags:
---

{% include_md %}
本篇來練習 Leetcode medium 難度的兩大關卡：**Word Break & Palindromic Substrings**，之所以難度偏中是因為題目需搭配多個邏輯片段得出答案，過程的步驟拆解不像 Easy 單純，一起來玩玩看！
<!-- more -->

# 拆解題目
139. Word Break

Given a string `s` and a dictionary of strings `wordDict`, return `true` if s can be segmented into a space-separated **sequence** of one or more dictionary words.

## Example 1:

Input: s = `"leetcode"`, wordDict = `["leet","code"]`
Output: `true`
Explanation: Return true because "leetcode" can be segmented as "leet code".

## Example 2:

Input: s = `"applepenapple"`, wordDict = `["apple","pen"]`
Output: `true`
Explanation: Return true because "applepenapple" can be segmented as "apple pen apple".
Note that you are allowed to reuse a dictionary word.

## Example 3:

Input: s = `"catsandog"`, wordDict = `["cats","dog","sand","and","cat"]`
Output: `false`

> s and wordDict[i] consist of only lowercase English letters.
> All the strings of wordDict are unique.

# 題目解說
給予一個字串 `s` 還有一組不重複的小寫英文字典 `wordDict`，確保該字串可以為字典內的字透過各種組合、按照 `s` 的序列 **從頭切到尾**，如果切不完則不成立。

# 解題開始

## 粗暴解法
由於一開始的我是不懂 DP(Dynamic Programming) 動態規劃的解法的，想測試自己能用什麼方式解出提目，思維是這樣的：

```js
/**
 * @param {string} s
 * @param {string[]} wordDict
 * @return {boolean}
 */
var wordBreak = function(s, wordDict) {
    let currentIndex = 0;
    while(s.length !== 0 && currentIndex < wordDict.length) {
        for(let i = 0; i < wordDict.length ; i++) {
            while(s.indexOf(wordDict[i]) !== -1) {
                const chops =  s.split(wordDict[i]);
                s = chops.join('');
                if (s.length === 0) return true;
            }
            currentIndex ++;
        }
    }

    if (s.length !== 0) return false;
    else return true;
};
```
1. 用字典列表裡的所有字一一跑迴圈將字串 `s` 給切完。
2. 切完的方式通過 `indexOf` 找到字串內是否包含該關鍵字，是的話就將字串內包含的部分移除，直到長度為 0。
3. 沒切完就表示不符合。

然後就遇到卡關：
### Wrong Answer
36 / 47 testcases passed
submitted at Apr 15, 2025 12:34

Editorial
Input
s = `"cars"`
wordDict = `["car","ca","rs"]`

Output
`false`
Expected
`true`

#### 問題關鍵
我的邏輯致命的地方在字串 `s` 切完 `car` 就剩下 `s`，無法從頭驗證 `"ca"`,`"rs"` 而錯過了對的組合，其實是可以被 `"ca"`,`"rs"` 切完的！
所以『保持原始字串不變可被重複查核』是很重要的一環！

<!-- ## 第一版改良
應該用一個變數保持 -->

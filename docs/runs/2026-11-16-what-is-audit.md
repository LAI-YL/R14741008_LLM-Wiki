---
title: 執行紀錄：審計是什麼？從風險到意見
---

# 執行紀錄：審計是什麼？從風險到意見

- 日期：2026-11-16
- 產出：[研究筆記](../../notes/2026-11-16-what-is-audit.md) → [逐頁稿](../../slides/what-is-audit.md) → `decks/what-is-audit/`
- 流程圖：見 [工作流程](../workflow.md)

## 節點 2　Ingest（本次簡報的資料基礎）

| 項目 | 內容 |
|---|---|
| 輸入 | 24 張美國審計準則資料卡（`raw/2026-11-16-rag-audit-cards/`，每張算一篇）、2 份官方資料摘要、1 份入門筆記 |
| 產出 | wiki 37 頁（準則 14、概念 12、機構 4、綜合分析 2、來源 4、總覽 1） |
| 檢查 | lint ＋人工閱讀 |
| 發現的錯誤 | ① 資料卡中的可疑說法被直接寫進 wiki，還用 `[!todo]` 標在概念頁上 ② 金額的 `$` 被當成數學式 ③ 表格裡 wikilink 的「顯示文字」分隔符號把欄位切斷 |
| 修正 | ① 刪掉可疑句，新增規則「不確定內容只寫在 source 頁」，lint 擋下 source 頁以外的 `[!todo]` ② 規則改寫成 `\$`，lint 加警告 ③ 修正表格解析 |
| 退回節點 | ① 退回節點 2 重寫；規則迴圈更新 AGENTS.md 與 lint |

## 節點 3　先討論

| 問題 | 使用者的決定 |
|---|---|
| 簡報主題 | 「審計是什麼？從風險到意見」 |
| 「至少 ingest 5 篇」怎麼算 | 每張資料卡算一篇，共 24 張＋2 份官方摘要 |
| 要不要加教學結構規則 | 加：先想一想 → 學習目標 → 章節 → 小測驗＋解答 → 總結（AGENTS.md 6.6 第 6 點，lint 同步檢查） |
| 流程紀錄放哪裡 | 新增 `docs/`，網站加「專案說明」入口 |

## 節點 4　研究筆記

| 項目 | 內容 |
|---|---|
| 輸入 | wiki 12 頁：[[overview]]、[[pcaob-vs-aicpa-standards]]、[[pcaob]]、[[aicpa]]、[[auditor-independence]]、[[audit-risk-model]]、[[materiality]]、[[fraud-risk]]、[[audit-opinion-types]]、[[au-c-700]]、[[as-3101]]、[[emphasis-of-matter]] |
| 產出 | `notes/2026-11-16-what-is-audit.md`；建議文獻 R001–R004 |
| 檢查 | 每段標註 `[[slug]]`；lint：`0 error(s)，0 warning(s)` |
| 發現的錯誤 | 部分網址用 WebFetch 打不開；AICPA AU-C 200 的 PDF 連結無法確認 |
| 修正 | 改用搜尋結果中的官方頁面；無法確認的 AU-C 200 **不列入**（規則：列入前必須確認可以開啟） |
| 退回節點 | 無 |

缺口（寫進筆記，不寫答案）：審計存在的目的、查核人員一般責任、查核證據與財報聲明、實際案例。

## 節點 5　逐頁稿

| 項目 | 內容 |
|---|---|
| 輸入 | 研究筆記 |
| 產出 | `slides/what-is-audit.md`：28 頁，3 章、3 題小測驗 |
| 檢查 | lint（第 1 次、第 2 次）＋字數腳本＋人工比對筆記 |

**lint 第 1 次：**

```
[error] slides/what-is-audit.md: 缺少播放器 decks/what-is-audit/index.html（請複製 templates/deck.html）
[warn ] slides/what-is-audit.md: 第 5 頁沒有「來源：」
[warn ] slides/what-is-audit.md: 第 15 頁沒有「來源：」
共檢查 wiki 37 頁、筆記 1 篇、簡報 1 份、文獻 4 筆、素材 31 個：1 error(s)，2 warning(s)
```

| 發現的錯誤 | 原因 | 修正 | 退回節點 |
|---|---|---|---|
| 第 5、15 頁「沒有來源」 | AI 打成簡體字「来源」，lint 只認「來源」 | 改成繁體 | 節點 5 |
| 缺少播放器是 error | **流程本身的衝突**：規則要求逐頁稿完成後先停下來給使用者確認，但 lint 要求播放器已存在，兩者不能同時成立 | lint 改成 warning：「尚未產生播放器（確認後依 6.7 建立）」 | 規則迴圈 |
| 第 24 頁寫了「這是最好的結果」 | **筆記裡沒有這句**，是 AI 自己加的評價；lint 抓不到，人工比對才發現 | 改成筆記裡有的內容（AICPA／PCAOB 的用語差異） | 節點 5 |

**lint 第 2 次：**

```
[warn ] slides/what-is-audit.md: 尚未產生播放器 decks/what-is-audit/index.html（逐頁稿經使用者確認後，依 6.7 複製 templates/deck.html）
共檢查 wiki 37 頁、筆記 1 篇、簡報 1 份、文獻 4 筆、素材 31 個：0 error(s)，1 warning(s)
```

字數腳本：22 個內容頁全部符合（正文 ≤ 60 字、要點 ≤ 3、每點 ≤ 20 字），最多的是總結頁 49 字。

## 節點 6　使用者確認

（等待使用者回覆）

## 節點 7　HTML 簡報

（使用者確認後執行）

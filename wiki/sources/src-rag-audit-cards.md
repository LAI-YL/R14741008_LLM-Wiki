---
title: 美國審計準則重點資料卡
type: source
files: 24
tags: [資料來源, 準則資料卡]
sources: []
updated: 2026-11-16
---

# 美國審計準則重點資料卡

## 資料資訊

| 項目 | 內容 |
|---|---|
| 原始檔案 | `raw/2026-11-16-rag-audit-cards/`（24 個 .txt，保留原檔名與內容） |
| 類型 | 考試導向的準則資料卡 |
| 作者／出處 | 使用者整理 |
| 加入日期 | 2026-11-16 |

每張卡的固定欄位：準則編號、中英文名稱、類別、領域、適用對象、對應 PCAOB 準則、核心規範、考試陷阱、TBS 實務要點、關鍵字。

## 重點摘要

- 涵蓋 AU-C（240、315、501、505、560、570、700、705、706）、PCAOB（AS 2110、2201、3101）、職業道德獨立性、GAGAS、單一審計、SSAE（AT-C 205、210、215、320）、SSARS（AR-C 70、80、90）。
- 每張卡附有對應的 PCAOB 準則，可以補齊上市公司與非上市公司的準則對照，例如 AU-C 705 ↔ AS 3105。
- 「考試陷阱」欄位大多轉成 wiki 的 `[!exam]` 提示框。

## 影響到的頁面

| 原始檔 | 新增頁面 | 更新頁面 |
|---|---|---|
| auc-240 | [[fraud-risk]] | — |
| auc-315 | — | [[audit-risk-model]] |
| auc-501 | [[inventory-and-litigation]] | — |
| auc-505 | [[external-confirmations]] | — |
| auc-560 | [[subsequent-events]] | — |
| auc-570 | [[going-concern]] | — |
| auc-700 | [[au-c-700]] | [[aicpa-au-c-standards]] |
| auc-705 | — | [[audit-opinion-types]]、[[as-3101]] |
| auc-706 | [[emphasis-of-matter]] | — |
| ethics-independence | [[auditor-independence]] | [[aicpa]] |
| gagas-financial | [[gagas]] | [[overview]] |
| gagas-independence | [[gagas]]、[[auditor-independence]] | — |
| pcaob-2110 | [[as-2110]] | [[pcaob-auditing-standards]] |
| pcaob-2201 | — | [[as-2201]] |
| pcaob-3101 | — | [[as-3101]]、[[critical-audit-matters]] |
| single-audit-threshold | [[single-audit]] | — |
| single-audit-reporting | [[single-audit]] | — |
| ssae-205／210／215 | [[at-c-205]]、[[at-c-210]]、[[at-c-215]] | — |
| ssae-320 | [[at-c-320]] | — |
| ssars-70／80／90 | [[ar-c-70]]、[[ar-c-80]]、[[ar-c-90]] | — |
| （綜合） | [[engagement-types-comparison]] | [[pcaob-vs-aicpa-standards]] |

## 待查證／疑點

> [!todo] 待查證（以下說法**未寫入** wiki 頁面）
> 這些說法和一般理解可能不同，依規則暫不採用，需以準則原文確認後再決定是否寫入：
> - **auc-570**：卡片說繼續經營重大疑慮以「強調事項段」表達。疑點：較新的 AICPA 報告格式可能改為獨立的 “Substantial Doubt…” 段落。→ 影響 [[going-concern]]、[[emphasis-of-matter]]
> - **pcaob-3101**：卡片說出具否定意見或無法表示意見時「不得」揭露 CAM。疑點：一般理解是無法表示意見時不需揭露，否定意見的情況不確定。官方摘要（[[src-pcaob-official-standards-web]]）只確認了「保留意見要含 CAM」，否定意見與無法表示意見仍待原文確認。→ 影響 [[critical-audit-matters]]
> - **auc-560**：卡片寫上市公司對應準則為 PCAOB AS 2901。疑點：製作研究筆記時查詢 PCAOB 官網，期後事項的準則是 AS 2801、期後始獲知之事實是 AS 2905，AS 2901 則是「報告日後才考慮被遺漏的程序」，與卡片不符。待下載建議文獻 R009、R010 後 ingest 確認。→ 影響 [[subsequent-events]]、[[pcaob-vs-aicpa-standards]]
> - **ssae-215**：卡片說 AUP 報告「必須限制使用」。疑點：較新的 SSAE 修訂可能已不再強制限制使用。→ 影響 [[at-c-215]]
>
> 已解決：
> - **auc-240** 收入認列推定：AICPA 資料指出可以推翻，已在 [[fraud-risk]] 以 `[!conflict]` 並列兩種說法（見 [[src-official-sources-web-2]]）。
> - **single-audit** 金額的生效年度：已確認為 2024-10-01 以後開始的會計年度（見 [[src-official-sources-web-2]]）。

> [!conflict] 與既有資料不同
> CAM 的判斷條件，[[src-us-audit-primer]] 列為三項，本資料列為兩項（把第 2、3 項合併），已在 [[critical-audit-matters]] 並列兩種說法。

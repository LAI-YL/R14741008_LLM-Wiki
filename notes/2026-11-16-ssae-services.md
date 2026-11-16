---
title: SSAE 確信服務：檢查、核閱、協議程序與 SOC 報告
type: note
question: SSAE 的檢查（Examination）、核閱（SSAE Review）、協議程序（Agreed-Upon Procedures）與 SOC 1／SOC 2 報告有什麼不同？請整理成讓初學者也能分辨的比較。
tags: [SSAE, 確信服務, SOC 報告, 確信程度]
wiki_pages: [at-c-205, at-c-210, at-c-215, at-c-320, engagement-types-comparison, ar-c-90, audit-risk-model, aicpa]
references: [R005, R006]
created: 2026-11-16
---

# SSAE 確信服務：檢查、核閱、協議程序與 SOC 報告

## 研究問題

SSAE 的檢查（Examination）、核閱（SSAE Review）、協議程序（Agreed-Upon Procedures）與 SOC 1／SOC 2 報告有什麼不同？請整理成讓初學者也能分辨的比較。

## 摘要

SSAE 是 AICPA 的確信準則，彙編為 AT-C，處理的是**非歷史財務報表**的標的，例如 SOC 報告、法令遵循、溫室氣體排放資訊。三種服務依確信程度由高到低分為：檢查（AT-C 205，合理確信，結論用「In our opinion」）、核閱（AT-C 210，有限確信，結論用「we are not aware of」）、協議程序（AT-C 215，不提供確信，只列出事實發現）。三種服務**都要求獨立性**。SOC 報告（AT-C 320）屬於檢查案件的一種，分為 SOC 1／SOC 2，各有 Type 1／Type 2；只有 Type 2 能讓主查會計師用來降低控制風險。

## 本文

### 1. SSAE 是什麼

SSAE（確信準則）由 [[aicpa|AICPA]] 發布，彙編為 AT-C，適用於非歷史財務報表的標的，例如 SOC 報告、法令遵循、溫室氣體排放資訊。（[[at-c-205]]、[[aicpa]]）

### 2. 檢查（Examination，AT-C 205）

檢查提供 SSAE 體系中最高的**合理確信**，規格相當於財報查核。會計師必須**獨立**、執行充分的程序，並取得管理階層**書面聲明**。結論以正面形式表達：「In our opinion, the subject matter is presented in accordance with the criteria…」。標的有重大不實時出具保留或否定結論；範圍受限時出具保留結論或無法表示意見。（[[at-c-205]]）

### 3. 核閱（SSAE Review，AT-C 210）

核閱提供**有限確信**，程序以**詢問**與**分析性程序**為主，不做深入的證實測試與控制測試。結論以消極形式表達：「Based on our review, we are not aware of any material modifications…」。會計師**必須具備獨立性**。使用者若需要合理確信，就不能委任核閱，應改委任檢查。SSAE 核閱與 SSARS 核閱同樣是有限確信、同樣要求獨立，差別在標的：前者是非歷史財務資訊，後者是非上市公司的歷史財務報表。（[[at-c-210]]、[[ar-c-90]]）

### 4. 協議程序（Agreed-Upon Procedures，AT-C 215）

會計師只執行委任人指定的具體程序，客觀列出**事實發現**。協議程序不提供任何確信、不表示意見，也不評估程序是否適當，程序是否充分適切由**委任人負責**；但會計師**仍必須具備獨立性**。報告**不可出現**「查核無誤」「合理保證」等意見用語。（[[at-c-215]]）

### 5. 三種服務比較

| 項目 | 檢查（AT-C 205） | 核閱（AT-C 210） | 協議程序（AT-C 215） |
|---|---|---|---|
| 確信程度 | 合理確信 | 有限確信 | 不提供 |
| 報告用語 | In our opinion | We are not aware of… | 列出事實發現 |
| 獨立性 | 必須 | 必須 | 必須 |

三個關鍵字對應確信程度：**opinion** → 合理確信；**not aware** → 有限確信；**findings** → 不提供確信。（[[at-c-205]]、[[at-c-210]]、[[at-c-215]]、[[engagement-types-comparison]]）

### 6. SOC 報告（AT-C 320）

服務機構控制報告屬於檢查案件的一種，對象是雲端服務商、薪資代工、SaaS 資料中心等服務機構。（[[at-c-320]]）

- **SOC 1**：聚焦與客戶**財務報導**相關的內部控制。
- **SOC 2**：聚焦**信任服務準則**（安全性、可用性、處理完整性、保密性、隱私）。
- **Type 1**：單一時點，只評估控制**設計**是否適當。
- **Type 2**：涵蓋一段期間（資料卡指至少 6 個月），評估設計並測試**作業有效性**。
- **使用者組織控制考量（UCCs）**：客戶端自己也必須落實的互補控制，例如及時停用離職人員的帳號。

（[[at-c-320]]）

> [!exam] 考點
> 主查會計師要依賴服務機構的內控來降低控制風險（CR），**只有 Type 2 報告有效**。（[[at-c-320]]、[[audit-risk-model]]）

## 知識庫目前的缺口

- 所有確信案件共同適用的概念與規定（例如 AT-C 105）。
- 檢查案件的不同形式，以及 SSAE 近年修訂的方向。
- SOC 2 以外的其他服務機構報告類型。

## 建議參考文獻

> 以下文獻**尚未**整理進 wiki，本篇沒有使用其內容。已登記在 [建議文獻清單](../raw/_reading-list.md)，下載後可進行 wiki 化。

| ID | 文獻 | 機構 | 下載 | 可補足的缺口 |
|---|---|---|---|---|
| R005 | AICPA SSAEs – currently effective（AT-C sections） | AICPA | [網頁](https://www.aicpa-cima.com/resources/download/aicpa-ssaes-currently-effective) | AT-C 105 共同概念、各 AT-C 章節原文 |
| R006 | Issuance of attestation standards completes clarity project（SSAE No. 18） | Journal of Accountancy（AICPA） | [網頁](https://www.journalofaccountancy.com/news/2016/apr/clarified-attestation-standards-issued-201614113/) | SSAE 的架構與 AT-C 章節分工 |

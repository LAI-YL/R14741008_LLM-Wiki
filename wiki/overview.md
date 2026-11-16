---
title: 美國審計知識地圖
type: overview
tags: [總覽]
sources: [src-us-audit-primer, src-rag-audit-cards]
updated: 2026-11-16
---

# 美國審計知識地圖

這是知識庫的入口頁，說明目前對「美國財務報表審計」的整體理解，以及各頁之間的關係。每次 ingest 後如果整體理解有變，AI 會更新本頁。

## 一張圖看懂：誰查誰、用什麼準則

| 受查者 | 準則制定者 | 準則體系 | 監督／依據 |
|---|---|---|---|
| 發行人（上市公司） | [[pcaob]] | [[pcaob-auditing-standards|PCAOB AS]] | [[sec]]、[[sarbanes-oxley-act|SOX]] |
| 非發行人（非上市公司） | [[aicpa]] ASB | [[aicpa-au-c-standards|AICPA SAS / AU-C]] | 各州會計師委員會 |
| 政府、聯邦補助單位 | GAO | [[gagas|GAGAS（Yellow Book）]] | [[single-audit|Uniform Guidance 單一審計]] |

> [!exam] 考點
> 第一步永遠先判斷**受查者是不是 issuer**：是 → PCAOB；不是 → AICPA。兩套準則的差異整理在 [[pcaob-vs-aicpa-standards]]。

## 查核流程主線

1. **承接前提**：確認 [[auditor-independence|獨立性]]。
2. **規劃與風險評估**：用 [[audit-risk-model]] 決定要做多少證實程序；用 [[materiality]] 決定多大的錯誤才算重要；必須考量 [[fraud-risk|舞弊風險]]（上市公司見 [[as-2110]]）。
3. **內部控制**：上市公司需執行整合查核，見 [[as-2201]]；依賴服務機構時看 [[at-c-320|SOC 報告]]。
4. **取得證據**：[[external-confirmations|函證]]、[[inventory-and-litigation|存貨監盤與律師函]]。
5. **完成查核**：[[subsequent-events|期後事項]]、[[going-concern|繼續經營]]評估。
6. **報告**：標準報告見 [[au-c-700]]／[[as-3101]]；依問題性質與影響程度選擇 [[audit-opinion-types|意見類型]]；必要時加 [[emphasis-of-matter|強調事項段]]；上市公司還要揭露 [[critical-audit-matters|CAM]]。

## 查核以外的服務

會計師還提供不同確信程度的服務：SSAE 的 [[at-c-205|檢查]]、[[at-c-210|核閱]]、[[at-c-215|協議程序]]，以及 SSARS 的 [[ar-c-90|核閱]]、[[ar-c-80|代編]]、[[ar-c-70|編製]]。一次比較見 [[engagement-types-comparison]]。

## 目前知識庫的範圍

- 已涵蓋：準則體系與制定機構、風險評估與舞弊、重大性、函證與存貨、期後事項、繼續經營、查核報告與意見類型、CAM、獨立性、GAGAS 與單一審計、SSAE 與 SSARS 服務。
- 尚待補充：查核抽樣、分析性程序、內控缺失的溝通（AU-C 265）、書面聲明、會計估計、集團查核、GAO 機構頁。

尚待確認的說法不寫進 wiki 頁面，統一記在維護用的「待查證」清單，確認後才寫入。

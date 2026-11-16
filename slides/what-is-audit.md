---
title: 審計是什麼？從風險到意見
subtitle: 會計師怎麼判斷一份財報值不值得相信
type: slides
note: 2026-11-16-what-is-audit
author: 美國審計知識資料庫
created: 2026-11-16
---

<!-- slide: cover -->
# 審計是什麼？從風險到意見

會計師怎麼判斷一份財報值不值得相信

<!-- slide: figure -->
![思考中的貓頭鷹](assets/mascot/owl-think.svg)

## 先想一想

財報是公司自己編的。

投資人憑什麼相信它？

::: notes
先讓聽眾想 10 秒。答案在最後揭曉：由**獨立**的查核人員查核後，出具**查核意見**。
:::

來源：[[overview]]、[[audit-opinion-types]]

<!-- slide: agenda -->
## 學習目標

1. 說出誰來查、用哪一套準則
2. 解釋審計風險與重大性
3. 判斷該出哪一種查核意見

<!-- slide: section -->
## 第一章　誰來查？

<!-- slide: figure -->
![準則地圖](assets/diagrams/standards-map.svg)

## 第一步：是不是上市公司？

- 上市公司：用 **PCAOB** 的準則（AS）
- 非上市公司：用 **AICPA** 的準則（AU-C）
- 政府單位：另有 GAGAS

::: notes
上市公司在準則裡叫「發行人（issuer）」。判斷時第一步永遠是先看受查者是不是 issuer。
:::

來源：[[overview]]、[[pcaob-vs-aicpa-standards]]

<!-- slide: points -->
## 兩個訂規則的機構

- **PCAOB**：監督上市公司的查核人員
- PCAOB 本身受 SEC 監督
- **AICPA**：會計師的專業團體

::: notes
PCAOB 依沙賓法案成立，是非營利機構；它管的是「查核人員」，不是公司本身。AICPA 透過審計準則委員會制定非上市公司的審計準則。
:::

來源：[[pcaob]]、[[aicpa]]

<!-- slide: figure-right -->
![獨立性](assets/icons/independence.svg)

## 查核人員的前提：獨立

獨立性：不受被查公司影響。

- 不能查核**自己做的工作**
- 不能擔任客戶的**管理階層**

::: notes
判斷標準：理性投資人知道所有相關事實後，是否仍認為會計師能客觀公正。缺乏獨立性時，只能出具「無法表示意見」。
:::

來源：[[auditor-independence]]

<!-- slide: figure -->
![查核流程](assets/diagrams/audit-process.svg)

## 查核的六個步驟

從確認獨立性開始，

到出具查核報告結束。

::: notes
1 承接（確認獨立性）→ 2 規劃與風險評估 → 3 內部控制 → 4 取得證據（函證、存貨監盤、律師函）→ 5 完成查核（期後事項、繼續經營）→ 6 報告。
:::

來源：[[overview]]

<!-- slide: figure-right -->
![思考中的貓頭鷹](assets/mascot/owl-think.svg)

## 小測驗：查核上市公司，要用哪一套準則？

- A. AICPA 的 AU-C
- B. PCAOB 的 AS
- C. GAGAS

來源：[[pcaob-vs-aicpa-standards]]

<!-- slide: figure -->
![答對了](assets/mascot/owl-correct.svg)

## 解答：B

上市公司由 **PCAOB** 管，

所以用 PCAOB 的審計準則（AS）。

來源：[[pcaob-vs-aicpa-standards]]

<!-- slide: section -->
## 第二章　審計風險與重大性

<!-- slide: key -->
## 審計風險（AR）

財報其實有重大錯誤，查核人員卻出了**不適當的意見**。

::: notes
AR 是 Audit Risk 的縮寫。這個風險不可能是零。
:::

來源：[[audit-risk-model]]

<!-- slide: key -->
## 只能「合理確信」

風險降不到零，只能降到**適當的低水準**。

::: notes
所以查核給的是合理確信，不是絕對保證。
:::

來源：[[audit-risk-model]]

<!-- slide: figure -->
![審計風險模型](assets/diagrams/audit-risk-model.svg)

## 三種風險相乘

- 固有風險：帳目本身容易錯
- 控制風險：內控沒擋住錯誤
- 偵查風險：查核沒找到錯誤

::: notes
IR（Inherent Risk）、CR（Control Risk）、DR（Detection Risk）。
:::

來源：[[audit-risk-model]]

<!-- slide: key -->
## 查核人員只能控制偵查風險

$$
AR = \underbrace{IR \times CR}_{RMM} \times DR
$$

::: notes
IR 與 CR 合稱重大不實表達風險（RMM），是公司本身的風險，查核人員只能「評估」，唯一能「控制」的是 DR。
:::

來源：[[audit-risk-model]]

<!-- slide: points -->
## 公司風險越高，查得越多

- 重大不實表達風險（RMM）越高
- 能接受的偵查風險就越低
- 要做更多、更有效的程序

來源：[[audit-risk-model]]

<!-- slide: figure-right -->
![舞弊三角](assets/diagrams/fraud-triangle.svg)

## 錯誤也可能來自舞弊

舞弊三角：

- 誘因／壓力
- 機會
- 合理化

::: notes
每個查核案件都要推定兩項舞弊風險：收入認列、管理階層凌駕控制。
知識庫的資料對「收入認列的推定能不能推翻」說法不同：資料卡寫不得排除；AICPA 的資料則說可依風險評估推翻，但要記錄理由。
:::

來源：[[fraud-risk]]

<!-- slide: points -->
## 重大性：錯多少才算重要

重大：會影響財報使用者的決策。

- 整體重大性：看財報整體
- 執行重大性：再低一點，留緩衝
- 明顯微小門檻：以下不必累計

::: notes
準則沒有規定固定百分比；重大性同時看金額與性質。PCAOB 引用美國最高法院的「理性投資人」標準。
:::

來源：[[materiality]]

<!-- slide: figure-right -->
![思考中的貓頭鷹](assets/mascot/owl-think.svg)

## 小測驗：哪一種風險是查核人員能控制的？

- A. 固有風險
- B. 控制風險
- C. 偵查風險

來源：[[audit-risk-model]]

<!-- slide: figure -->
![答對了](assets/mascot/owl-correct.svg)

## 解答：C

固有風險、控制風險是**公司本身**的風險，

查核人員只能評估；能控制的只有**偵查風險**。

來源：[[audit-risk-model]]

<!-- slide: section -->
## 第三章　查核意見怎麼選

<!-- slide: figure -->
![意見矩陣](assets/diagrams/opinion-matrix.svg)

## 兩個問題決定意見

- 財報錯了，還是查不到證據？
- 影響廣不廣泛？

來源：[[audit-opinion-types]]

<!-- slide: compare -->
## 有重大問題時的三種意見

| 問題性質 | 重大不廣泛 | 重大且廣泛 |
|---|---|---|
| 財報有錯 | 保留意見 | 否定意見 |
| 查不到證據 | 保留意見 | 無法表示意見 |

來源：[[audit-opinion-types]]

<!-- slide: points -->
## 沒有重大問題：無保留意見

- AICPA 叫 unmodified
- PCAOB 叫 unqualified
- 加強調事項段：意見不變

::: notes
繼續經營疑慮也**不會**改變意見類型。
:::

來源：[[audit-opinion-types]]、[[emphasis-of-matter]]

<!-- slide: points -->
## 查核報告的開頭

- 第一段就是**意見**
- 接著說明意見的依據
- 公司與查核人員的責任分開寫

::: notes
管理階層負責編製財報，查核人員負責查核。上市公司的報告還要揭露關鍵查核事項（CAM）與事務所任期。
:::

來源：[[au-c-700]]、[[as-3101]]

<!-- slide: figure-right -->
![思考中的貓頭鷹](assets/mascot/owl-think.svg)

## 小測驗：財報有錯，而且影響廣泛，該出哪一種意見？

- A. 保留意見
- B. 否定意見
- C. 無法表示意見

來源：[[audit-opinion-types]]

<!-- slide: figure -->
![答對了](assets/mascot/owl-correct.svg)

## 解答：B

問題是「財報錯了」且「影響廣泛」，

所以出**否定意見**。

來源：[[audit-opinion-types]]

<!-- slide: summary -->
## 總結

- 先看是不是上市公司，決定用哪套準則
- 只能控制偵查風險，求的是合理確信
- 依「錯或查不到」與「廣不廣泛」選意見

::: notes
回到開場問題：投資人能相信財報，是因為有獨立的查核人員查核後出具意見。
:::

來源：[[pcaob-vs-aicpa-standards]]、[[audit-risk-model]]、[[audit-opinion-types]]

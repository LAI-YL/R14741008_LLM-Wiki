---
title: SSAE 確信服務：檢查、核閱、協議程序與 SOC 報告
subtitle: 看結論用語分辨三種確信，再搞懂 SOC 報告
type: slides
note: 2026-11-16-ssae-services
author: 美國審計知識資料庫
created: 2026-11-16
---

<!-- slide: cover -->
# SSAE 確信服務：檢查、核閱、協議程序與 SOC 報告

看結論用語分辨三種確信，再搞懂 SOC 報告

<!-- slide: figure -->
![思考中的貓頭鷹](assets/mascot/owl-think.svg)

## 先想一想

公司的薪資交給代工廠處理。

查核人員要怎麼相信代工廠的內控？

::: notes
先讓聽眾想一下。答案在第三章：看服務機構的 SOC 報告，而且要 Type 2。
:::

來源：[[at-c-320]]

<!-- slide: agenda -->
## 學習目標

1. 說出 SSAE 適用在哪些標的
2. 用結論用語分辨三種服務
3. 分辨 SOC 1／2 與 Type 1／2

<!-- slide: section -->
## 第一章　SSAE 是什麼

<!-- slide: points -->
## SSAE：AICPA 的確信準則

- 由 **AICPA** 發布，彙編為 AT-C
- 對象：**非歷史財務報表**的標的
- 例：SOC 報告、法令遵循、溫室氣體

::: notes
完整例子：SOC 報告、法令遵循、溫室氣體排放資訊。
:::

來源：[[at-c-205]]、[[aicpa]]

<!-- slide: key -->
## 三種服務，確信由高到低

![確信程度|1000](assets/diagrams/assurance-levels.svg)

::: notes
檢查：合理確信；核閱：有限確信；協議程序：不提供確信。圖中同一層還列了財報查核與 SSARS 的服務，可以一起對照。
:::

來源：[[engagement-types-comparison]]

<!-- slide: section -->
## 第二章　三種服務

<!-- slide: figure-right -->
![放大鏡](assets/icons/magnifier.svg)

## 檢查（AT-C 205）

Examination

- **合理確信**，規格像財報查核
- 要獨立、要取得**書面聲明**
- 結論：「In our opinion…」

::: notes
修正式結論：標的有重大不實 → 保留或否定；範圍受限 → 保留或無法表示意見。
:::

來源：[[at-c-205]]

<!-- slide: figure -->
![核對清單](assets/icons/checklist.svg)

## 核閱（AT-C 210）

SSAE Review

- **有限確信**
- 以**詢問**＋**分析性程序**為主
- 結論：「we are not aware of…」

::: notes
使用者若需要合理確信，就不能委任核閱，要改委任檢查。SSAE 核閱和 SSARS 核閱都是有限確信、都要獨立；差別在標的：SSAE 是非歷史財務資訊，SSARS 是非上市公司的歷史財務報表。
:::

來源：[[at-c-210]]、[[ar-c-90]]

<!-- slide: figure-right -->
![文件](assets/icons/document.svg)

## 協議程序（AT-C 215）

Agreed-Upon Procedures（AUP）

- 只做**委任人指定**的程序
- 只列**事實發現**，不提供確信
- 程序夠不夠，由委任人負責

::: notes
AUP 是 Agreed-Upon Procedures 的縮寫。會計師不表示意見，也不評估程序是否適當。
:::

來源：[[at-c-215]]

<!-- slide: compare -->
## 看結論用語就能分辨

| 服務 | 確信程度 | 報告用語 |
|---|---|---|
| 檢查 | 合理確信 | In our opinion |
| 核閱 | 有限確信 | We are not aware of… |
| 協議程序 | 不提供 | 列出事實發現 |

來源：[[at-c-205]]、[[at-c-210]]、[[at-c-215]]

<!-- slide: key -->
## 三種服務都要獨立

檢查、核閱、協議程序，會計師都**必須具備獨立性**。

來源：[[at-c-205]]、[[at-c-210]]、[[at-c-215]]

<!-- slide: figure-right -->
![思考中的貓頭鷹](assets/mascot/owl-think.svg)

## 小測驗：報告寫「we are not aware of…」是哪一種？

- A. 檢查
- B. 核閱
- C. 協議程序

來源：[[at-c-210]]

<!-- slide: figure -->
![答對了](assets/mascot/owl-correct.svg)

## 解答：B

「not aware」代表**有限確信**，

也就是**核閱**。

來源：[[at-c-210]]、[[engagement-types-comparison]]

<!-- slide: figure-right -->
![思考中的貓頭鷹](assets/mascot/owl-think.svg)

## 小測驗：AUP 報告可以寫「查核無誤」嗎？

- A. 可以
- B. 不可以

來源：[[at-c-215]]

<!-- slide: figure -->
![答對了](assets/mascot/owl-correct.svg)

## 解答：B

協議程序**不提供確信**，

報告只能列出發現的事實。

來源：[[at-c-215]]

<!-- slide: section -->
## 第三章　SOC 報告

<!-- slide: points -->
## SOC 報告是什麼

- 屬於**檢查案件**的一種（AT-C 320）
- 對象：雲端、薪資代工等服務機構
- 分 SOC 1、SOC 2

::: notes
服務機構的例子：雲端服務商、薪資代工、SaaS 資料中心。
:::

來源：[[at-c-320]]

<!-- slide: key -->
## SOC 報告的四種組合

![SOC 報告類型|1000](assets/diagrams/soc-report-types.svg)

來源：[[at-c-320]]

<!-- slide: points -->
## SOC 1 和 SOC 2

- SOC 1：**財務報導**相關的內控
- SOC 2：**信任服務準則**

::: notes
信任服務準則包括：安全性、可用性、處理完整性、保密性、隱私。
:::

來源：[[at-c-320]]

<!-- slide: points -->
## Type 1 和 Type 2

- Type 1：單一時點，只看**設計**
- Type 2：一段期間，再測**有效性**

::: notes
Type 2 會評估設計，並測試作業有效性；涵蓋期間至少 6 個月。
:::

來源：[[at-c-320]]

<!-- slide: key -->
## 只有 Type 2 能降低控制風險

主查會計師要依賴服務機構的內控時，**只有 Type 2** 報告有效。

::: notes
控制風險（CR）的意思，可以回顧「審計是什麼？從風險到意見」這份簡報。
:::

來源：[[at-c-320]]、[[audit-risk-model]]

<!-- slide: points -->
## 客戶自己也要做控制

- 使用者組織控制考量（UCCs）
- 例：及時停用離職人員帳號

::: notes
UCCs：客戶端自己也必須落實的互補控制。
:::

來源：[[at-c-320]]

<!-- slide: figure-right -->
![思考中的貓頭鷹](assets/mascot/owl-think.svg)

## 小測驗：想靠服務機構內控降低控制風險，要看哪種報告？

- A. Type 1
- B. Type 2

來源：[[at-c-320]]

<!-- slide: figure -->
![答對了](assets/mascot/owl-correct.svg)

## 解答：B

**Type 2** 涵蓋一段期間，

還測試了作業有效性。

來源：[[at-c-320]]

<!-- slide: summary -->
## 總結

- SSAE 處理非歷史財務資訊的確信
- opinion／not aware／findings 分三級
- 降低控制風險，只能靠 Type 2

來源：[[at-c-205]]、[[engagement-types-comparison]]、[[at-c-320]]

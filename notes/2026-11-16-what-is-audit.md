---
title: 審計是什麼？從風險到意見
type: note
question: 審計是什麼？請從風險到意見，整理出讓完全不懂審計的人也能理解的基本概念。
tags: [入門, 教學, 審計風險, 查核意見]
wiki_pages: [overview, pcaob-vs-aicpa-standards, pcaob, aicpa, auditor-independence, audit-risk-model, materiality, fraud-risk, audit-opinion-types, au-c-700, as-3101, emphasis-of-matter]
references: [R001, R002, R003, R004]
created: 2026-11-16
---

# 審計是什麼？從風險到意見

## 研究問題

審計是什麼？請從風險到意見，整理出讓完全不懂審計的人也能理解的基本概念。

## 摘要

財報查核的主角是查核人員：他們必須**獨立**於受查公司，依查核流程規劃與執行查核，最後對財報出具**查核意見**。查核人員無法把風險降到零，只能把**審計風險**降到適當的低水準，取得「合理確信」；其中只有**偵查風險**是查核人員能控制的。判斷「錯多少才算重要」靠**重大性**，而最後要出哪一種意見，取決於「問題的性質」與「影響是否廣泛」。查核哪一家公司、用哪一套準則，則先看它是不是上市公司。

## 本文

### 1. 誰來查？用什麼準則？

美國的財報查核依受查者分成兩條主線：**上市公司（發行人，issuer）**適用 PCAOB 的審計準則（AS），**非上市公司（非發行人）**適用 AICPA 審計準則委員會的 SAS／AU-C；政府與聯邦補助單位另有 GAGAS。判斷時第一步永遠是先看受查者是不是 issuer。（[[overview]]、[[pcaob-vs-aicpa-standards]]）

PCAOB 是依沙賓法案成立、受 SEC 監督的非營利機構，管的是**查核人員**；AICPA 是會計師的專業團體，透過審計準則委員會制定非上市公司的審計準則。（[[pcaob]]、[[aicpa]]）

### 2. 查核人員的前提：獨立

查核人員必須在實質上與形式上都不受客戶影響。上市公司的判斷標準是：理性投資人在知道所有相關事實後，是否仍認為會計師能客觀公正地判斷；例如會計師不能**查核自己的工作**、不能**擔任客戶的管理階層**。查核人員若缺乏獨立性，只能出具無法表示意見。（[[auditor-independence]]）

### 3. 查核怎麼進行：六個步驟

1. 承接前提：確認獨立性。
2. 規劃與風險評估：用審計風險模型決定要做多少程序，用重大性決定多大的錯誤才算重要，並考量舞弊風險。
3. 內部控制：上市公司要做內控與財報的整合查核。
4. 取得證據：例如函證、存貨監盤與律師函。
5. 完成查核：評估期後事項與繼續經營。
6. 報告：依問題性質與影響程度選擇意見類型。

（[[overview]]）

### 4. 審計風險：為什麼只能「合理確信」

審計風險（AR）是指財報其實有重大不實表達，查核人員卻出具了不適當意見的風險。查核人員無法把它降到零，只能降到「適當的低水準」，取得**合理確信**而非絕對保證。（[[audit-risk-model]]）

$$
AR = \underbrace{IR \times CR}_{RMM} \times DR
$$

- **固有風險（IR）**：在不考慮內控前，帳目本身容易出錯的程度。
- **控制風險（CR）**：公司內部控制沒能及時預防或偵出錯誤的風險。
- **偵查風險（DR）**：查核程序沒能找出重大錯誤的風險。

IR 與 CR 合稱**重大不實表達風險（RMM）**，是受查公司本身的風險，查核人員只能**評估**；唯一能**控制**的是 DR。RMM 越高，可接受的 DR 就越低，查核人員就要做更多、更有效的證實程序，取得更多證據。（[[audit-risk-model]]）

重大不實表達也可能來自**舞弊**。舞弊三角包括誘因／壓力、機會與合理化；每個查核案件都要推定「收入認列」與「管理階層凌駕控制」兩項舞弊風險。（[[fraud-risk]]）

> [!conflict] 收入認列的推定能不能推翻？
> 知識庫中的資料卡寫成兩大推定都不得排除；AICPA 的資料則指出收入認列的推定可以依風險評估推翻，但必須記錄理由。（[[fraud-risk]]）

### 5. 重大性：錯多少才算重要

不實表達若可合理預期會影響財報使用者的經濟決策，就是**重大**的；PCAOB 引用美國最高法院的「理性投資人」標準。查核人員會設定：**整體重大性**（財報整體）、**執行重大性**（低於整體重大性，用來留緩衝），以及**明顯微小門檻**（低於此金額不必累計）。準則沒有規定固定百分比，重大性同時看金額與性質。（[[materiality]]）

### 6. 最後的產出：查核意見

查核人員依兩個問題選擇意見：**問題是「財報錯了」還是「查不到證據」？影響「廣不廣泛」？**（[[audit-opinion-types]]）

| 問題性質＼影響程度 | 重大但不廣泛 | 重大且廣泛 |
|---|---|---|
| 財報有不實表達 | 保留意見 | 否定意見 |
| 無法取得足夠適切證據 | 保留意見 | 無法表示意見 |

沒有重大問題時出具**無保留意見**（AICPA 稱 unmodified，PCAOB 稱 unqualified）。強調事項段、繼續經營疑慮都**不會**改變意見類型。（[[audit-opinion-types]]、[[emphasis-of-matter]]）

標準查核報告的第一段就是意見段，接著是意見基礎段，再分別說明**管理階層**的編製責任與**查核人員**的查核責任；上市公司的報告還要揭露關鍵查核事項（CAM）與事務所任期。（[[au-c-700]]、[[as-3101]]）

## 知識庫目前的缺口

- 「審計」本身的定義，以及為什麼投資人與市場需要獨立查核（審計存在的目的）。
- 查核人員整體目標與一般責任（例如專業懷疑態度、應有的專業注意）的完整說明。
- 「查核證據」是什麼、什麼叫「足夠且適切」，以及財報聲明（assertions）的種類。
- 用一個實際案例串起整個查核流程的說明。

## 建議參考文獻

> 以下文獻**尚未**整理進 wiki，本篇沒有使用其內容。已登記在 [建議文獻清單](../raw/_reading-list.md)，下載後可進行 wiki 化。

| ID | 文獻 | 機構 | 下載 | 可補足的缺口 |
|---|---|---|---|---|
| R001 | Investor Bulletin: Why Audits Matter | PCAOB | [網頁](https://pcaobus.org/resources/information-for-investors/investor-advisories/investor-bulletin-why-audits-matter) | 審計存在的目的 |
| R002 | AS 1000: General Responsibilities of the Auditor in Conducting an Audit | PCAOB | [網頁](https://pcaobus.org/oversight/standards/auditing-standards/details/as-1000--general-responsibilities-of-the-auditor-in-conducting-an-audit) | 查核人員的整體目標與一般責任 |
| R003 | AS 1105: Audit Evidence | PCAOB | [網頁](https://pcaobus.org/Standards/Auditing/Pages/AS1105.aspx) | 查核證據與財報聲明 |
| R004 | Investor Bulletin: The Importance of Auditor Professional Responsibilities and Ethics | PCAOB | [網頁](https://pcaobus.org/resources/information-for-investors/investor-advisories/investor-bulletin--the-importance-of-auditor-professional-responsibilities-and-ethics) | 獨立性與專業懷疑的白話說明 |

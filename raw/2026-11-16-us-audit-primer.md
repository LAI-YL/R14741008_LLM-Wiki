# 美國審計架構入門筆記（起始資料）

> 建立專案時寫的入門筆記，整理美國財務報表審計的基本架構，供第一次 ingest 使用。
> 內容為一般性整理，生效日期與最新修訂請以 PCAOB、AICPA 官網為準。

## 一、誰的準則？依受查者區分

- 美國財報審計依「受查者是誰」適用不同的準則：
  - **發行人（Issuer，在 SEC 註冊的上市公司等）**：適用 PCAOB 發布的審計準則（Auditing Standards，編號為 AS xxxx）。
  - **非發行人（Nonissuer，非上市公司、多數非營利組織等）**：適用 AICPA 審計準則委員會（Auditing Standards Board, ASB）發布的審計準則公報（SAS），經「明確化專案（Clarity Project）」後彙編為 AU-C 章節。
  - **政府機關、接受聯邦補助的單位**：除 AICPA 準則外，還要遵循 GAO 發布的政府審計準則 GAGAS（俗稱 Yellow Book）。
- PCAOB 是依據 2002 年《沙賓法案》（Sarbanes-Oxley Act, SOX）成立的非營利機構，受 SEC 監督；它負責制定上市公司審計準則、會計師事務所註冊與檢查（inspection）。
- SEC（美國證券交易委員會）監督 PCAOB，核准 PCAOB 發布的準則，並規範上市公司財報與查核人員獨立性（Regulation S-X Rule 2-01）。
- AICPA（美國會計師公會）除了 ASB 之外，也制定職業道德規範（Code of Professional Conduct），並與 NASBA 共同辦理美國會計師考試（Uniform CPA Examination）。

## 二、PCAOB 準則的編號架構

- PCAOB 在 2016 年底將準則重新編號，依主題分組：
  - AS 1000 系列：一般審計準則（General Auditing Standards）
  - AS 2000 系列：查核程序（Audit Procedures），例如 AS 2105 重大性、AS 2110 風險辨認與評估、AS 2201 內部控制查核
  - AS 3000 系列：查核報告（Auditor Reporting），例如 AS 3101 無保留意見查核報告
  - AS 4000 系列：與聯邦證券法申報相關事項
  - AS 6000 系列：與查核相關的其他事項
- AS 2201 規範「財務報導內部控制（ICFR）查核」，須與財報查核整合執行（integrated audit），源自 SOX 第 404 條。

## 三、AICPA AU-C 常用章節

- AU-C 200：查核人員的整體目標
- AU-C 315：了解受查者並評估重大不實表達風險（SAS No. 145 修訂）
- AU-C 320：規劃與執行查核時的重大性
- AU-C 700：形成意見與財報查核報告
- AU-C 701：關鍵查核事項（KAM）的溝通——只有在法令要求或受委任時才適用
- AU-C 705：修正式意見
- AU-C 706：強調事項段與其他事項段

## 四、審計風險模型

- 審計風險（Audit Risk, AR）＝ 重大不實表達風險（RMM）× 偵查風險（DR）
- RMM 又由固有風險（Inherent Risk, IR）與控制風險（Control Risk, CR）組成，所以常寫成 AR = IR × CR × DR。
- IR 與 CR 是受查者本身的風險，查核人員只能「評估」；DR 是查核人員可以透過調整證實程序的性質、時間與範圍來「控制」的。
- RMM 越高 → 可接受的 DR 越低 → 需要更多、更有效的證實程序。

## 五、重大性

- 重大性（Materiality）：不實表達若可合理預期會影響財報使用者的經濟決策，即屬重大。
- 整體重大性（overall materiality）：針對財報整體設定，常以稅前淨利、營收、總資產等為基準乘上一個百分比（例如稅前淨利 5% 是常見經驗法則，但準則本身沒有規定固定比率）。
- 執行重大性（performance materiality，PCAOB 稱 tolerable misstatement）：低於整體重大性，用來降低「未更正與未偵出的不實表達加總超過重大性」的可能。
- 明顯微小門檻（clearly trivial）：低於此金額的不實表達不需累計。
- PCAOB 對應準則為 AS 2105；AICPA 為 AU-C 320。

## 六、查核意見類型

- 無保留意見（Unmodified；PCAOB 用語為 Unqualified）：財報在所有重大方面允當表達。
- 保留意見（Qualified）：不實表達「重大但不廣泛」，或範圍受限的可能影響「重大但不廣泛」。
- 否定意見（Adverse）：不實表達「重大且廣泛」。
- 無法表示意見（Disclaimer）：無法取得足夠適切的證據，且可能影響「重大且廣泛」。
- 判斷關鍵：問題的性質（不實表達 vs. 範圍受限）× 影響程度（重大 vs. 重大且廣泛）。

## 七、關鍵查核事項（CAM）

- PCAOB AS 3101 要求在上市公司查核報告中揭露關鍵查核事項（Critical Audit Matters, CAM）。
- CAM 的三個條件：(1) 已經或必須與審計委員會溝通的事項；(2) 與財報中重大的科目或揭露有關；(3) 涉及特別具挑戰性、主觀或複雜的查核人員判斷。
- 不適用 CAM 的查核：新興成長公司（EGC）、證券經紀自營商、除 BDC 以外的投資公司、員工福利計畫。
- 分階段適用：大型加速申報公司自 2019-06-30 以後結束的會計年度開始，其他適用公司自 2020-12-15 以後結束的會計年度開始。
- AICPA 對應的是 AU-C 701 的關鍵查核事項（Key Audit Matters, KAM），但非上市公司只有在受委任時才需溝通，並非強制。

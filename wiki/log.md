# 日誌 Log

> 只能附加，最新的在最上面。標題格式：`## [YYYY-MM-DD] 動作 | 標題`，動作為 ingest／query／lint／schema／init。

## [2026-11-16] asset | 網站標誌改為「帳冊＋章節符號」
- 新增 `assets/brand/site-logo.svg`（使用者從 6 個方案中選定方案 B，並調整 § 為約 80% 大小、在右頁水平置中、離書頁底部留白）；§ 轉為路徑，不依賴使用者電腦的字型
- `index.html` 頂欄改用此標誌，`style.css` 移除舊的空心外框樣式；版本號更新為 `20261116i`
- 瀏覽器分頁小圖示維持貓頭鷹頭像；`assets/index.md` 新增「網站標誌 Brand」段落，AGENTS.md 資料夾結構加上 `assets/brand/`

## [2026-11-16] schema | 前台完全不顯示資料來源
- 網站：前台的 wiki 頁、知識庫總覽、研究筆記不再顯示「來源」段落；指向維護者專區的連結（資料來源頁、建議文獻清單等）改為純文字
- 維護者專區：資料來源清單加上「引用頁面」數量；資料來源頁底部列出「引用這份來源的 wiki 頁面」
- 內容：正文中提到資料來源的地方改寫為不指名的說法——[[fraud-risk]]、[[critical-audit-matters]]、[[single-audit]]、[[subsequent-events]]、[[as-3101]]、[[as-2201]]、[[at-c-320]]、[[emphasis-of-matter]]、[[overview]]；研究筆記（what-is-audit、ssae-services、subsequent-events-intro）與逐頁稿（what-is-audit、ssae-services）同步修改
- lint 新增：wiki 正文（「來源」段落以外）、研究筆記、逐頁稿不可連到資料來源頁
- `app.js`、`tools/lint.py` 修改，`index.html` 版本號更新為 `20261116h`；AGENTS.md 第 5、10 節同步更新

## [2026-11-16] lint | AS 2901 改列待查證
- [[subsequent-events]]、[[pcaob-vs-aicpa-standards]]：PCAOB 對應準則由「AS 2901」改為「尚未確認」
- [[pcaob-auditing-standards]]：AS 2000 系列的舉例中刪除「AS 2901 期後始獲知之事實」
- [[src-rag-audit-cards]] 的「待查證／疑點」新增 auc-560 一項：記錄卡片原始說法、與 PCAOB 官網不符之處，以及影響的頁面；待下載 R009、R010 後 ingest 確認
- 研究筆記 `notes/2026-11-16-subsequent-events-intro.md` 的缺口說明同步更新

## [2026-11-16] deck | SSARS、SSAE、期後事項三份簡報
- 新增播放器：`decks/ssars-services/`、`decks/ssae-services/`、`decks/subsequent-events-intro/`（模板原封不動複製）
- `decks/_shared/deck.css`：圖解放在 `key` 頁時可滿版顯示（高度上限 470px），`templates/deck.html` 版本號更新並重新複製到所有播放器
- 執行紀錄：`docs/runs/2026-11-16-ssars-services.md` 等三份

## [2026-11-16] slides | SSARS、SSAE、期後事項三份逐頁稿
- 新增：`slides/ssars-services.md`（24 頁）、`slides/ssae-services.md`（26 頁）、`slides/subsequent-events-intro.md`（24 頁），各含 3 題小測驗
- 先在工作區產出預覽，使用者確認後才寫入

## [2026-11-16] asset | 期後事項時間軸、SOC 報告類型圖解
- 新增：`assets/diagrams/subsequent-events-timeline.svg`（依據 [[subsequent-events]]）、`assets/diagrams/soc-report-types.svg`（依據 [[at-c-320]]）

## [2026-11-16] note | SSARS、SSAE、期後事項三篇研究筆記
- 新增：`notes/2026-11-16-ssars-services.md`、`notes/2026-11-16-ssae-services.md`、`notes/2026-11-16-subsequent-events-intro.md`，本文只引用 wiki
- 建議文獻 R005–R010（皆以 WebFetch 確認可開啟）
- 發現 [[subsequent-events]]、[[pcaob-vs-aicpa-standards]] 記載的 PCAOB 準則編號 AS 2901 與 PCAOB 官網不一致；筆記與簡報不使用該編號，待使用者決定如何修正 wiki

## [2026-11-16] schema | 知識庫側邊欄：分類順序、可折疊、子頁排序
- 側邊欄分類改為「總覽 → 機構 → 概念 → 準則 → 綜合分析」，每個分類可點開／收合（目前所在的分類自動展開）
- 子頁依標題逐字排序：數字依數值遞增 → 英文 A～Z → 中文依筆畫數遞增
- 修正側邊欄標題不完整：`wiki/index.md` 中「查核意見類型」「存貨監盤與律師函」補上英文，與頁面標題一致；lint 新增檢查 index.md 連結文字必須等於頁面 title
- `app.js`、`style.css`、`tools/lint.py` 修改，`index.html` 版本號更新為 `20261116g`；AGENTS.md 第 7、10 節同步更新

## [2026-11-16] schema | 離開維護者專區即自動上鎖
- 在維護者專區內切換頁面不需重輸密碼；一旦切到任何前台頁面就自動上鎖，再次進入要重新輸入
- `app.js` 修改，`index.html` 版本號更新為 `20261116f`；AGENTS.md 第 10 節同步更新

## [2026-11-16] schema | 逐頁稿移到維護者專區
- 講義庫卡片與研究筆記頁拿掉「逐頁稿」按鈕（學習者直接播放簡報即可）
- 逐頁稿頁面（`#/s/…`）改為後台，需維護者密碼；維護者專區新增「簡報逐頁稿」清單
- `app.js` 修改，`index.html` 版本號更新為 `20261116e`；AGENTS.md 第 10 節同步更新

## [2026-11-16] schema | README 連結、資料來源檔數、過時說明修正
- README 加上網站、教學簡報、AGENTS.md、docs/ 連結與前台／後台說明
- source 頁 frontmatter 新增 `files`（原始檔數；資料卡批次為 24，其餘為 1），維護者專區的資料來源標題改為顯示總檔數（27）並逐項列出；「美國審計準則重點資料卡（24 張）」標題去掉括號；`templates/source.md` 同步
- AGENTS.md：批次匯入規則加上 `files` 欄位；第 10 節素材庫位置改為維護者專區；`slides/index.md` 開頭說明改為講義庫
- `app.js` 修改，`index.html` 版本號更新為 `20261116d`

## [2026-11-16] schema | 沙賓法案從「機構」改列「準則」
- 使用者指出 SOX 是法律、不是機構：`wiki/entities/sarbanes-oxley-act.md` 移到 `wiki/standards/sarbanes-oxley-act.md`，改用準則模板（基本資訊、適用對象、核心要求、與 AS 2201 的差異、考點），內容仍只取自既有資料
- `wiki/index.md`：從「機構」移除，加在「準則」最後一行
- AGENTS.md 命名規則：entity 只放組織，法律、法規列為 standard

## [2026-11-16] schema | 維護者專區加密碼、資料來源移出前台
- 前台的知識庫目錄、搜尋、反向連結不再列出資料來源頁；資料來源只從維護者專區進入
- 維護者專區（含日誌、建議文獻清單、專案說明、素材庫、資料來源頁）進入前需輸入密碼；`app.js` 只存雜湊值，同一個分頁內輸入一次即可，可按「鎖上」登出
- `app.js`、`style.css` 修改，`index.html` 版本號更新為 `20261116c`；AGENTS.md 第 10 節同步更新

## [2026-11-16] schema | 網站程式的版本號規則
- AGENTS.md 第 3 節新增：修改網站程式或簡報引擎時，要同步更新 `?v=` 版本號，避免瀏覽器與 GitHub Pages 沿用舊的快取檔案

## [2026-11-16] schema | 網站檔案加上版本號（修正快取問題）
- 問題：GitHub Pages 上首頁仍是舊的總覽、點分頁沒有反應。研判是瀏覽器沿用舊的 `app.js` 快取，搭配新的 `index.html`（新導覽的 `#/wiki` 在舊程式中不存在，全部導回舊總覽）
- 修正：`index.html` 與 `templates/deck.html` 引用的 CSS／JS 加上 `?v=` 版本號；`decks/what-is-audit/index.html` 重新複製模板
- 本機以自動化瀏覽器測試：首頁為講義庫，點「知識庫」「講義庫」「維護者專區」「閱讀筆記」都正常切換，無 JavaScript 錯誤

## [2026-11-16] schema | 網站分前台與後台、講義庫合併
- 使用者決定：後台資訊移到「維護者專區」；研究筆記與簡報合併成「講義庫」；講義庫當首頁（參考老師的講義庫網站）
- 上方導覽改為「講義庫／知識庫」；日誌、建議文獻清單、專案說明、素材庫、資料來源清單移到頁尾的「維護者專區」（`#/admin`）
- 來源頁的「待查證／疑點」在網站上預設收合；講義庫、筆記與維護者專區改用單欄版面
- 修改 `app.js`、`index.html`、`style.css`；AGENTS.md 6.5、6.9、第 10 節同步更新

## [2026-11-16] deck | 審計是什麼？從風險到意見
- 新增播放器：`decks/what-is-audit/index.html`（模板原封不動複製）
- 逐頁截圖檢查發現 3 個畫面問題（章節頁白字白底、封面標題斷行、圖解字太小），修正 `decks/_shared/deck.css` 主題，並把查核流程圖改成 `key` 頁滿版顯示
- 新增 `docs/reflection.md`，更新執行紀錄

## [2026-11-16] slides | 審計是什麼？從風險到意見
- 新增逐頁稿：`slides/what-is-audit.md`（28 頁、3 章、3 題小測驗），內容只取自研究筆記
- lint 第 1 次：1 error、2 warning（簡體字「来源」、播放器尚未建立）；人工比對發現 1 句筆記沒有的評價，已刪改
- 等待使用者確認後再產生 HTML 簡報

## [2026-11-16] schema | 教學結構與流程紀錄（docs/）
- AGENTS.md 6.6 新增第 6 點「教學結構」：先想一想 → 學習目標 → 章節 → 小測驗＋解答 → 總結；`templates/slides.md` 改成這個骨架
- 新增 6.9「流程紀錄」與 `docs/`（workflow、runs、reflection）；網站上方導覽新增「專案說明」
- lint：檢查教學結構；檢查 `docs/` 的連結與圖片；「尚未產生播放器」由 error 改為 warning（逐頁稿要先停下來給使用者確認）

## [2026-11-16] note | 審計是什麼？從風險到意見
- 新增研究筆記：`notes/2026-11-16-what-is-audit.md`，本文只引用 wiki 12 頁（[[overview]]、[[audit-risk-model]]、[[materiality]]、[[audit-opinion-types]] 等）
- 網路搜尋建議文獻 4 筆，皆以 WebFetch 確認可開啟後登記為 R001–R004（`raw/_reading-list.md`）；AICPA AU-C 200 PDF 因連結無法驗證而未列入
- 缺口：審計存在的目的、查核人員一般責任、查核證據與財報聲明、實際案例

## [2026-11-16] schema | 封面副標題客製化
- AGENTS.md 6.6：封面副標題要依主題寫出「讀者會搞懂什麼」，不可用通用句、不可與其他簡報重複；`templates/slides.md` 同步更新
- `tools/lint.py`（使用者同意）：逐頁稿必須有 `subtitle`；通用句或模板文字、與其他簡報重複 → error；封面副標題與 `subtitle` 不一致 → warning

## [2026-11-16] schema | 簡報主題定為「明亮卡片」
- 使用者從三種風格（經典學院、明亮卡片、深色聚焦）中選定明亮卡片，並要求圖片與貓頭鷹背後不加底色框
- 寫入 `decks/_shared/deck.css` 與 AGENTS.md 第 10 節
- 調整：封面改為深色底；貓頭鷹改用新增的貼紙版 `owl-*-sticker.svg`（7 個動作，順著輪廓的米白描邊、圓角收邊、無光暈），已登記於 `assets/index.md`

## [2026-11-16] asset | 吉祥物正式版與「左文右圖」頁型
- 吉祥物「貓頭鷹審計師」正式版 8 張（`assets/mascot/owl-*.svg`：預設、打招呼、思考、講解、答對了、注意、閱讀、頭像），已登記；頭像設為網站與簡報的圖示
- 新增簡報頁型 `figure-right`（左文右圖）
- 修正 `assets/diagrams/opinion-matrix.svg`：「問題性質」欄標改為與欄標題同列置中

## [2026-11-16] asset | 簡報素材庫與吉祥物草稿
- 新增 `assets/`：線條圖示 10 個、概念圖解 6 張（標準地圖、查核流程、審計風險模型、舞弊三角、意見矩陣、確信程度），登記於 `assets/index.md`
- 吉祥物「貓頭鷹審計師」草稿 3 版（`assets/mascot/draft-*.svg`），待使用者選定
- `assets/logos/`：官方 Logo 由使用者放入
- 播放器支援圖片與「左圖右文」頁型 `figure`；網站新增素材庫頁（`#/assets`）
- AGENTS.md 新增 6.8 素材規則；`tools/lint.py` 檢查素材路徑、登記與 figure 頁

## [2026-11-16] lint | 來源頁改名
- [[src-rag-audit-cards]] 改名為「美國審計準則重點資料卡（24 張）」；[[src-pcaob-official-standards-web]] 改名為「PCAOB 官方準則重點摘要」；[[src-official-sources-web-2]] 改名為「審計準則與法規官方資料摘要」
- 各頁「來源」段落移除括號說明

## [2026-11-16] ingest | 官方與權威來源重點摘要（第二輪）
- 使用者同意的一次性例外（同上一筆），補充更多現有主題
- 來源：`raw/2026-11-16-official-sources-web-2.md` → [[src-official-sources-web-2]]
- 更新：[[fraud-risk]]、[[going-concern]]、[[as-2201]]、[[external-confirmations]]、[[single-audit]]、[[auditor-independence]]
- 解決待查證 2 項（[[src-rag-audit-cards]]）；新增差異 1 項（收入認列推定）；新增待查證 2 項

## [2026-11-16] ingest | PCAOB 官方準則重點摘要（網路整理）
- 使用者同意的一次性例外：AI 上網查 PCAOB 官網，只補充現有主題的核心知識點（AGENTS.md 不變）
- 來源：`raw/2026-11-16-pcaob-official-standards-web.md` → [[src-pcaob-official-standards-web]]
- 更新：[[audit-risk-model]]、[[materiality]]、[[fraud-risk]]、[[audit-opinion-types]]、[[critical-audit-matters]]、[[pcaob-auditing-standards]]
- 待查證 3 項（官網部分頁面無法讀取）：見 [[src-pcaob-official-standards-web]]

## [2026-11-16] schema | 簡報讀者與字數規則
- AGENTS.md 6.6：簡報讀者為審計初學者；一頁一個概念、正文不超過 60 字、要點最多 3 點、專有名詞附白話解釋、細節放講者備註；頁數不限

## [2026-11-16] schema | 研究筆記、簡報與建議文獻流程
- AGENTS.md 新增 6.4 研究筆記、6.5 建議文獻 wiki 化、6.6 逐頁稿、6.7 HTML 簡報，以及 LaTeX 寫法
- 新增 `notes/`、`slides/`、`decks/_shared/`（共用簡報引擎）、`raw/_reading-list.md`、`raw/_private/`、`templates/note.md`、`templates/slides.md`、`templates/deck.html`
- 網站新增「研究筆記／簡報／文獻清單」頁；共用 Markdown 渲染器 `md.js` 支援 LaTeX（KaTeX 放在 `vendor/`）
- `tools/lint.py` 擴充：`[!todo]` 只能用在 source 頁、筆記／逐頁稿／播放器 slug 一致、文獻清單格式、金額錢字號
- 格式調整：[[single-audit]]、[[src-rag-audit-cards]] 的金額改寫為 `\$`；[[audit-risk-model]] 加入 LaTeX 公式

## [2026-11-16] schema | 不確定內容只記在 source 頁
- AGENTS.md：不確定或資訊尚缺的內容不寫進 wiki 頁面，只記在 source 頁的「待查證／疑點」；`[!todo]` 只能用在 source 頁
- 依新規則移除可疑說法：[[fraud-risk]]、[[going-concern]]、[[emphasis-of-matter]]、[[critical-audit-matters]]、[[at-c-215]]
- 移除缺資料提示：[[as-2201]]、[[pcaob-auditing-standards]]、[[overview]]；[[single-audit]] 改為一行附註
- 被移除的說法完整記錄於 [[src-rag-audit-cards]]、[[src-us-audit-primer]]

## [2026-11-16] ingest | 上一份作業 RAG 資料卡（24 張）
- 來源：`raw/2026-11-16-rag-audit-cards/`（24 個 .txt，原檔照原樣複製）→ [[src-rag-audit-cards]]
- 新增準則：[[as-2110]]、[[au-c-700]]、[[gagas]]、[[at-c-205]]、[[at-c-210]]、[[at-c-215]]、[[at-c-320]]、[[ar-c-70]]、[[ar-c-80]]、[[ar-c-90]]
- 新增概念：[[fraud-risk]]、[[inventory-and-litigation]]、[[external-confirmations]]、[[subsequent-events]]、[[going-concern]]、[[emphasis-of-matter]]、[[auditor-independence]]、[[single-audit]]
- 新增分析：[[engagement-types-comparison]]
- 更新：[[overview]]、[[audit-risk-model]]、[[audit-opinion-types]]、[[critical-audit-matters]]、[[as-2201]]、[[as-3101]]、[[aicpa-au-c-standards]]、[[pcaob-auditing-standards]]、[[aicpa]]、[[pcaob-vs-aicpa-standards]]
- 解決待查證：AS 2201 缺失定義、AS 3105 編號
- 新增待查證：5 項（見 [[src-rag-audit-cards]]）；新增差異：CAM 條件數目

## [2026-11-16] schema | 新增「批次匯入」命名規則
- AGENTS.md 第 4 節：一批多個原始檔放在 `raw/YYYY-MM-DD-slug/` 子資料夾，保留原檔名，只建一個 source 頁

## [2026-11-16] schema | 新增「貼上文章自動 Ingest」規則
- AGENTS.md 新增 6.0：使用者貼上的文章一律先逐字存到 `raw/`，再建立或更新 wiki 頁面、index.md、log.md

## [2026-11-16] ingest | 美國審計架構入門筆記
- 來源：`raw/2026-11-16-us-audit-primer.md` → [[src-us-audit-primer]]
- 新增機構：[[pcaob]]、[[aicpa]]、[[sec]]、[[sarbanes-oxley-act]]
- 新增準則：[[pcaob-auditing-standards]]、[[aicpa-au-c-standards]]、[[as-2201]]、[[as-3101]]
- 新增概念：[[audit-risk-model]]、[[materiality]]、[[audit-opinion-types]]、[[critical-audit-matters]]
- 新增分析：[[pcaob-vs-aicpa-standards]]
- 更新：[[overview]]
- 待查證：PCAOB 新準則生效日、AS 3105 編號、AS 2201 缺失定義、GAGAS 頁面

## [2026-11-16] init | 建立專案
- 建立 AGENTS.md、資料夾結構、templates/、網站閱讀器與 tools/lint.py

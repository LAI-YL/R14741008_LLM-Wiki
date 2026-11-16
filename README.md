# 美國審計知識資料庫（US Audit LLM Wiki）

一個以 Andrej Karpathy 的 **LLM Wiki** 模式建立的繁體中文美國審計知識庫：
使用者把資料放進 `raw/`，AI 依照 `AGENTS.md` 的規則把它整理成互相連結的 wiki 頁面，網站直接讀取這些 Markdown 呈現。

- 規則：[`AGENTS.md`](AGENTS.md)（Claude Code 使用 `CLAUDE.md`，內容指向同一份規則）
- 資料流：`raw/`（原始資料）→ `wiki/`（知識庫）→ `notes/`（研究筆記）→ `slides/`（逐頁稿）→ `decks/`（HTML 簡報）
- 模板：`templates/`　建議文獻：`raw/_reading-list.md`　LaTeX：KaTeX（`vendor/katex/`）

## 怎麼新增內容

1. 把資料存成 `raw/YYYY-MM-DD-英文-slug.md`（或直接在對話中貼上）。
2. 開一個新的 AI 對話，輸入：「請先讀 AGENTS.md，然後 ingest `raw/檔名`。」
3. AI 會建立或更新 wiki 頁面、登記到 `wiki/index.md`、寫入 `wiki/log.md`，並執行 `python3 tools/lint.py` 自我檢查。

## 研究筆記與簡報

- 「研究：（問題）」→ AI 只根據 wiki 寫成 `notes/YYYY-MM-DD-slug.md`，網路上找到的資料列為建議文獻。
- 「做簡報：slug」→ 逐頁稿 `slides/slug.md` → 確認後產生 `decks/slug/`（← → 翻頁、F 全螢幕、N 講者備註、O 總覽、P 列印／PDF）。
- 建議文獻點「下載」→ 存到 `raw/` → 「ingest R001」→ 進入 wiki。

## 本機預覽

```bash
python3 -m http.server 8000
# 開啟 http://localhost:8000
```

## 部署

推上 GitHub 後，在 Settings → Pages 選擇 `main` 分支的 `/ (root)`。`.nojekyll` 用來讓 GitHub Pages 原樣提供 `.md` 檔。

#!/usr/bin/env python3
"""US Audit LLM Wiki 健康檢查（只用標準函式庫）。

用法：在專案根目錄執行  python3 tools/lint.py

[wiki]
  error  frontmatter 缺欄位或 type 不合法；檔名不是小寫 slug；slug 重複；放錯資料夾
  error  [[wikilink]] 指向不存在的頁面；sources 指向不存在的 source 頁
  error  頁面沒有登記在 wiki/index.md；index.md 連到不存在的檔案；index.md 的標題與頁面 title 不一致
  error  [!todo] 出現在 source 頁以外的 wiki 頁面；正文（「來源」段落以外）或筆記、逐頁稿連到資料來源頁
  warn   孤兒頁；「相關頁面」少於 2 個連結
[notes]
  error  檔名不是 YYYY-MM-DD-slug；frontmatter 缺欄位；沒有登記在 notes/index.md
  error  wikilink 斷掉；wiki_pages 列了不存在的頁面；出現 [!todo]
  error  references 中的 ID 不在 raw/_reading-list.md
  warn   本文用到的 wiki 頁面沒有列在 wiki_pages
[slides / decks]
  error  逐頁稿 frontmatter 缺欄位；note 指向不存在的筆記；slug 與筆記不一致
  error  頁型不合法；wikilink 斷掉；沒有登記在 slides/index.md
  error  缺少教學結構：先想一想、學習目標、小測驗＋解答、最後一頁總結
  error  decks/<slug>/index.html 不存在，或與 templates/deck.html 不同
  error  缺少封面副標題 subtitle；副標題是通用句或模板文字；與其他簡報副標題重複
  warn   封面頁的副標題與 frontmatter 的 subtitle 不一致
  warn   某頁沒有「來源：」
[reading list]
  error  ID 格式或重複；狀態不合法；來自筆記的連結不存在；wikilink 斷掉
[math]
  warn   疑似未跳脫的金額錢字號（請寫成 \\$）
[assets]
  error  圖片路徑不存在；使用了沒登記在 assets/index.md 的素材；使用外部圖片網址
  error  逐頁稿使用吉祥物草稿；figure／figure-right 頁沒有圖片
  error  assets/index.md 登記了不存在的檔案
"""
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
WIKI, NOTES, SLIDES, DECKS = ROOT / "wiki", ROOT / "notes", ROOT / "slides", ROOT / "decks"
READING = ROOT / "raw" / "_reading-list.md"
SPECIAL = {"index", "log"}
TYPE_DIR = {
    "source": "sources", "standard": "standards", "concept": "concepts",
    "entity": "entities", "synthesis": "syntheses", "overview": "",
}
REQUIRED = ["title", "type", "tags", "sources", "updated"]
NOTE_REQUIRED = ["title", "type", "question", "tags", "wiki_pages", "references", "created"]
SLIDES_REQUIRED = ["title", "subtitle", "type", "note", "created"]
GENERIC_SUBTITLES = ["給第一次接觸審計的你", "副標題", "依主題客製化"]
SLIDE_TYPES = {"cover", "agenda", "section", "points", "compare", "key", "figure", "figure-right", "summary"}
STATUSES = {"待下載", "已存 raw", "已 ingest", "不採用"}
SLUG_RE = re.compile(r"^[a-z0-9]+(-[a-z0-9]+)*$")
NOTE_RE = re.compile(r"^(\d{4}-\d{2}-\d{2})-([a-z0-9]+(-[a-z0-9]+)*)$")
WIKILINK_RE = re.compile(r"\[\[([^\]|#]+)(?:#[^\]|]*)?(?:\|[^\]]*)?\]\]")
INDEX_LINK_RE = re.compile(r"^- \[[^\]]+\]\(([^)]+\.md)\)")
TODO_RE = re.compile(r"^>\s*\[!todo\]", re.M)
IMG_RE = re.compile(r"!\[[^\]]*\]\(([^)\s]+)\)")
ASSETS = ROOT / "assets"
MONEY_RE = re.compile(r"(?<![\\`])\$\d[\d,]*(?:\.\d+)?(?!\$)")

errors, warns = [], []


def rel(p):
    return p.relative_to(ROOT).as_posix()


def parse_frontmatter(text):
    if not text.startswith("---\n"):
        return None, text
    end = text.find("\n---", 4)
    if end == -1:
        return None, text
    meta = {}
    for line in text[4:end].splitlines():
        if ":" in line:
            k, v = line.split(":", 1)
            meta[k.strip()] = re.sub(r"\s#.*$", "", v).strip()
    return meta, text[end + 4:]


def parse_list(v):
    v = (v or "").strip()
    if v.startswith("[") and v.endswith("]"):
        return [x.strip() for x in v[1:-1].split(",") if x.strip()]
    return [v] if v else []


def strip_code(text):
    text = re.sub(r"```.*?```", "", text, flags=re.S)
    return re.sub(r"`[^`]*`", "", text)


def check_links(text, where, pages):
    for target in set(m.strip() for m in WIKILINK_RE.findall(strip_code(text))):
        if target not in SPECIAL and target not in pages:
            errors.append(f"{where}: 斷掉的連結 [[{target}]]")


def check_money(text, where):
    body = strip_code(text)
    body = re.sub(r"\$\$.*?\$\$", "", body, flags=re.S)
    if MONEY_RE.search(body):
        warns.append(f"{where}: 疑似未跳脫的金額 `{MONEY_RE.search(body).group(0)}`，請寫成 \\$ 以免被當成數學式")


def registered_assets():
    idx = ASSETS / "index.md"
    if not idx.exists():
        return set()
    regs = set()
    for line in idx.read_text(encoding="utf-8").splitlines():
        m = re.match(r"^\|\s*`(assets/[^`]+)`", line)
        if m:
            regs.add(m.group(1))
    return regs


REGISTERED = registered_assets()


def check_images(text, where, is_slides=False):
    for src in IMG_RE.findall(strip_code(text)):
        if re.match(r"^(https?:|data:)", src):
            errors.append(f"{where}: 不可使用外部圖片網址 {src}")
            continue
        if not (ROOT / src).exists():
            errors.append(f"{where}: 圖片不存在 {src}")
        elif src.startswith("assets/") and src not in REGISTERED:
            errors.append(f"{where}: 素材 {src} 沒有登記在 assets/index.md")
        if is_slides and "/mascot/draft-" in src:
            errors.append(f"{where}: 簡報不可使用吉祥物草稿 {src}")


SRC_LINK_RE = re.compile(r"\[\[src-[^\]]*\]\]")


def src_links_outside_sources(text):
    """回傳「## 來源」段落以外出現的 [[src-…]]（資料來源屬於後台，前台頁面的正文不可提到）。"""
    body = re.sub(r"(?ms)^## 來源\s*$.*?(?=^## |\Z)", "", strip_code(text))
    return SRC_LINK_RE.findall(body)


def index_entries(path):
    if not path.exists():
        return set()
    return {Path(m.group(1)).stem for line in path.read_text(encoding="utf-8").splitlines()
            if (m := INDEX_LINK_RE.match(line.strip()))}


# ================= wiki =================
pages = {}
for p in sorted(WIKI.rglob("*.md")):
    slug = p.stem
    if slug in SPECIAL and p.parent == WIKI:
        continue
    if not SLUG_RE.match(slug):
        errors.append(f"{rel(p)}: 檔名不是小寫英文 slug")
    if slug in pages:
        errors.append(f"{rel(p)}: slug 與 {rel(pages[slug])} 重複")
    pages[slug] = p

links_in = {s: set() for s in pages}
for slug, p in pages.items():
    where = rel(p)
    text = p.read_text(encoding="utf-8")
    meta, body = parse_frontmatter(text)
    if meta is None:
        errors.append(f"{where}: 缺少 YAML frontmatter")
        continue
    for k in REQUIRED:
        if k not in meta:
            errors.append(f"{where}: frontmatter 缺少 `{k}`")
    t = meta.get("type", "")
    if t not in TYPE_DIR:
        errors.append(f"{where}: type `{t}` 不合法")
    else:
        folder = p.parent.relative_to(WIKI).as_posix()
        if folder != (TYPE_DIR[t] or "."):
            errors.append(f"{where}: type 為 {t}，應放在 wiki/{TYPE_DIR[t]}")
    if t != "source" and (bad := src_links_outside_sources(text)):
        errors.append(f"{where}: 正文提到資料來源 {bad[0]}；資料來源只能寫在最後的「來源」段落（網站前台不顯示）")
    if t != "source" and TODO_RE.search(text):
        errors.append(f"{where}: [!todo] 只能用在 source 頁；不確定的內容請移到 source 頁的「待查證／疑點」")
    for s in parse_list(meta.get("sources", "")):
        if s not in pages:
            errors.append(f"{where}: sources 中的 `{s}` 不存在")
    check_links(text, where, pages)
    check_money(body, where)
    check_images(body, where)
    for target in set(m.strip() for m in WIKILINK_RE.findall(text)):
        if target in pages and target != slug:
            links_in[target].add(slug)
    related = re.search(r"^## 相關頁面\n(.*?)(?=^## |\Z)", text, re.S | re.M)
    if t not in ("source", "overview") and (not related or len(WIKILINK_RE.findall(related.group(1))) < 2):
        warns.append(f"{where}: 「相關頁面」少於 2 個連結")

for line in (WIKI / "index.md").read_text(encoding="utf-8").splitlines():
    m = INDEX_LINK_RE.match(line.strip())
    if m and not (WIKI / m.group(1)).exists():
        errors.append(f"wiki/index.md: 連到不存在的檔案 {m.group(1)}")
    elif m:
        # 側邊欄顯示的是 index.md 的連結文字，必須與頁面 frontmatter 的 title 完全一致
        shown = re.match(r"- \[([^\]]+)\]", line.strip())
        fm, _ = parse_frontmatter((WIKI / m.group(1)).read_text(encoding="utf-8"))
        if shown and fm and fm.get("title") and shown.group(1) != fm["title"]:
            errors.append(f"wiki/index.md: 「{shown.group(1)}」與頁面標題「{fm['title']}」不一致（側邊欄會顯示不完整）")
indexed = index_entries(WIKI / "index.md")
for slug, p in pages.items():
    if slug not in indexed:
        errors.append(f"{rel(p)}: 沒有登記在 wiki/index.md")
    if slug != "overview" and not links_in[slug]:
        warns.append(f"{rel(p)}: 孤兒頁（沒有其他頁面連入）")
check_links((WIKI / "log.md").read_text(encoding="utf-8"), "wiki/log.md", pages)

# ================= reading list =================
reading_ids = set()
if READING.exists():
    rtext = READING.read_text(encoding="utf-8")
    check_links(rtext, "raw/_reading-list.md", pages)
    for line in rtext.splitlines():
        cells = [c.strip() for c in line.strip().strip("|").split("|")]
        if not line.strip().startswith("|") or len(cells) < 8 or cells[0] in ("ID", "") or set(cells[0]) <= set("-:"):
            continue
        rid, status = cells[0], cells[4]
        if not re.fullmatch(r"R\d{3}", rid):
            errors.append(f"raw/_reading-list.md: ID `{rid}` 格式應為 R001")
        if rid in reading_ids:
            errors.append(f"raw/_reading-list.md: ID `{rid}` 重複")
        reading_ids.add(rid)
        if status not in STATUSES:
            errors.append(f"raw/_reading-list.md: {rid} 狀態 `{status}` 不合法（{'／'.join(sorted(STATUSES))}）")
        if not re.search(r"\]\(https?://", cells[3]):
            errors.append(f"raw/_reading-list.md: {rid} 的「下載」欄沒有 http(s) 連結")
        for m in re.findall(r"\]\(\.\./notes/([^)]+)\.md\)", cells[5]):
            if not (NOTES / f"{m}.md").exists():
                errors.append(f"raw/_reading-list.md: {rid} 來自的筆記 {m} 不存在")
else:
    errors.append("raw/_reading-list.md 不存在")

# ================= notes =================
note_stems = {}
if NOTES.exists():
    note_index = index_entries(NOTES / "index.md")
    for p in sorted(NOTES.glob("*.md")):
        if p.stem == "index":
            continue
        where = rel(p)
        m = NOTE_RE.match(p.stem)
        if not m:
            errors.append(f"{where}: 檔名應為 YYYY-MM-DD-slug.md")
        note_stems[p.stem] = p
        text = p.read_text(encoding="utf-8")
        if SRC_LINK_RE.search(text):
            errors.append(f"{where}: 研究筆記不可連到資料來源頁（[[src-…]]），請改連 wiki 頁面")
        meta, body = parse_frontmatter(text)
        if meta is None:
            errors.append(f"{where}: 缺少 YAML frontmatter")
            continue
        for k in NOTE_REQUIRED:
            if k not in meta:
                errors.append(f"{where}: frontmatter 缺少 `{k}`")
        if meta.get("type") != "note":
            errors.append(f"{where}: type 應為 note")
        if TODO_RE.search(text):
            errors.append(f"{where}: 研究筆記不可使用 [!todo]，缺少的資訊請寫在「知識庫目前的缺口」")
        check_links(text, where, pages)
        check_money(body, where)
        check_images(body, where)
        listed = set(parse_list(meta.get("wiki_pages")))
        for s in listed - set(pages):
            errors.append(f"{where}: wiki_pages 中的 `{s}` 不存在")
        used = {t.strip() for t in WIKILINK_RE.findall(strip_code(body))} & set(pages)
        for s in sorted(used - listed):
            warns.append(f"{where}: 本文用到 [[{s}]] 但沒有列在 wiki_pages")
        for rid in parse_list(meta.get("references")):
            if rid not in reading_ids:
                errors.append(f"{where}: references 中的 `{rid}` 不在 raw/_reading-list.md")
        if p.stem not in note_index:
            errors.append(f"{where}: 沒有登記在 notes/index.md")
    for s in note_index - set(note_stems):
        errors.append(f"notes/index.md: 連到不存在的筆記 {s}.md")

# ================= slides & decks =================
template = (ROOT / "templates" / "deck.html").read_text(encoding="utf-8") if (ROOT / "templates" / "deck.html").exists() else None
slide_slugs = set()
subtitles = {}
if SLIDES.exists():
    slides_index = index_entries(SLIDES / "index.md")
    for p in sorted(SLIDES.glob("*.md")):
        if p.stem == "index":
            continue
        where, slug = rel(p), p.stem
        slide_slugs.add(slug)
        if not SLUG_RE.match(slug):
            errors.append(f"{where}: 檔名不是小寫英文 slug")
        text = p.read_text(encoding="utf-8")
        if SRC_LINK_RE.search(text):
            errors.append(f"{where}: 逐頁稿不可連到資料來源頁（[[src-…]]），請改連 wiki 頁面")
        meta, body = parse_frontmatter(text)
        if meta is None:
            errors.append(f"{where}: 缺少 YAML frontmatter")
            continue
        for k in SLIDES_REQUIRED:
            if k not in meta:
                errors.append(f"{where}: frontmatter 缺少 `{k}`")
        sub = meta.get("subtitle", "").strip()
        if sub:
            if any(g in sub for g in GENERIC_SUBTITLES):
                errors.append(f"{where}: 副標題「{sub}」是通用句或模板文字，請依主題客製化")
            if sub in subtitles:
                errors.append(f"{where}: 副標題與 {subtitles[sub]} 重複")
            subtitles.setdefault(sub, where)
            cover = re.search(r"<!--\s*slide:\s*cover\s*-->(.*?)(?=<!--\s*slide:|\Z)", body, re.S)
            if cover:
                lines = [l.strip() for l in cover.group(1).splitlines()
                         if l.strip() and not l.strip().startswith(("#", "!", "來源", ":::"))]
                if lines and lines[0] != sub:
                    warns.append(f"{where}: 封面副標題「{lines[0]}」與 frontmatter subtitle「{sub}」不一致")
        note = meta.get("note", "")
        if note and note not in note_stems:
            errors.append(f"{where}: note `{note}` 不存在於 notes/")
        elif note and NOTE_RE.match(note) and NOTE_RE.match(note).group(2) != slug:
            errors.append(f"{where}: 檔名應與筆記 slug 一致（應為 slides/{NOTE_RE.match(note).group(2)}.md）")
        check_links(text, where, pages)
        check_money(body, where)
        check_images(body, where, is_slides=True)
        parts = re.split(r"^<!--\s*slide:\s*([\w-]+)\s*-->\s*$", body, flags=re.M)
        if len(parts) < 3:
            errors.append(f"{where}: 沒有任何 <!-- slide: 頁型 --> 標記")
        for i in range(1, len(parts), 2):
            n = (i + 1) // 2
            if parts[i] not in SLIDE_TYPES:
                errors.append(f"{where}: 第 {n} 頁頁型 `{parts[i]}` 不合法（{'、'.join(sorted(SLIDE_TYPES))}）")
            if parts[i] in ("figure", "figure-right") and not re.search(r"^\s*!\[[^\]]*\]\([^)\s]+\)\s*$", parts[i + 1], re.M):
                errors.append(f"{where}: 第 {n} 頁是 {parts[i]}，但沒有獨立一行的圖片")
            if parts[i] not in ("cover", "agenda", "section") and not re.search(r"^來源[:：]", parts[i + 1], re.M):
                warns.append(f"{where}: 第 {n} 頁沒有「來源：」")
        # 教學結構：先想一想 → 學習目標 → … → 小測驗＋解答 → 總結
        heads = []
        for i in range(1, len(parts), 2):
            m = re.search(r"^#{1,2}\s+(.+)$", parts[i + 1], re.M)
            heads.append((parts[i], m.group(1).strip() if m else ""))
        if heads:
            if not any(h.startswith("先想一想") for _, h in heads):
                errors.append(f"{where}: 缺少開場問題頁（標題「先想一想」）")
            if not any(t == "agenda" and h.startswith("學習目標") for t, h in heads):
                errors.append(f"{where}: 缺少學習目標頁（agenda，標題「學習目標」）")
            quiz = [k for k, (_, h) in enumerate(heads) if h.startswith("小測驗")]
            if not quiz:
                errors.append(f"{where}: 至少要有一題小測驗（標題以「小測驗」開頭）")
            for k in quiz:
                if k + 1 >= len(heads) or not heads[k + 1][1].startswith("解答"):
                    errors.append(f"{where}: 第 {k + 1} 頁小測驗的下一頁必須是「解答」")
            if heads[-1][0] != "summary":
                errors.append(f"{where}: 最後一頁必須是 summary（總結）")
        if slug not in slides_index:
            errors.append(f"{where}: 沒有登記在 slides/index.md")
        deck = DECKS / slug / "index.html"
        if not deck.exists():
            warns.append(f"{where}: 尚未產生播放器 decks/{slug}/index.html（逐頁稿經使用者確認後，依 6.7 複製 templates/deck.html）")
        elif template is not None and deck.read_text(encoding="utf-8") != template:
            errors.append(f"decks/{slug}/index.html: 內容與 templates/deck.html 不同（播放器不可個別修改）")
    for s in slides_index - slide_slugs:
        errors.append(f"slides/index.md: 連到不存在的逐頁稿 {s}.md")
if DECKS.exists():
    for d in sorted(DECKS.iterdir()):
        if d.is_dir() and d.name != "_shared" and d.name not in slide_slugs:
            errors.append(f"decks/{d.name}/: 沒有對應的 slides/{d.name}.md")

# ================= docs =================
DOCS = ROOT / "docs"
if DOCS.exists():
    for p in sorted(DOCS.rglob("*.md")):
        t = p.read_text(encoding="utf-8")
        check_links(t, rel(p), pages)
        check_images(t, rel(p))

# ================= assets =================
for src in sorted(REGISTERED):
    if not (ROOT / src).exists():
        errors.append(f"assets/index.md: 登記的素材不存在 {src}")
if (ASSETS / "index.md").exists():
    check_links((ASSETS / "index.md").read_text(encoding="utf-8"), "assets/index.md", pages)

for e in errors:
    print(f"[error] {e}")
for w in warns:
    print(f"[warn ] {w}")
print(f"\n共檢查 wiki {len(pages)} 頁、筆記 {len(note_stems)} 篇、簡報 {len(slide_slugs)} 份、文獻 {len(reading_ids)} 筆、素材 {len(REGISTERED)} 個："
      f"{len(errors)} error(s)，{len(warns)} warning(s)")
sys.exit(1 if errors else 0)

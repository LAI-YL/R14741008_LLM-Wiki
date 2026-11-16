/* 美國審計知識資料庫 — 網站閱讀器
 * 只負責「讀取並呈現」Markdown；新增內容不需要修改本檔。
 *   wiki/index.md    → 知識庫目錄（左側欄）
 *   notes/index.md   → 研究筆記清單
 *   slides/index.md  → 簡報清單（播放器在 decks/<slug>/）
 *   raw/_reading-list.md → 建議文獻清單
 * Markdown 與 LaTeX 渲染在 md.js。
 */
(() => {
  "use strict";

  const TYPE_LABEL = {
    overview: "總覽", standard: "準則", concept: "概念", entity: "機構",
    synthesis: "綜合分析", source: "資料來源", note: "研究筆記", slides: "簡報逐頁稿",
  };

  const pages = new Map();   // wiki slug -> { slug, path, title, summary, category }
  const notes = new Map();   // note stem -> { stem, path, title, summary }
  const decks = new Map();   // slides slug -> { slug, path, title, summary }
  const cache = new Map();   // path -> { meta, body }
  let sections = [];
  let allLoaded = false;

  const $ = (sel) => document.querySelector(sel);
  const content = $("#content");
  const esc = MD.esc;

  // ---------- 工具 ----------
  async function fetchText(path) {
    const res = await fetch(path, { cache: "no-cache" });
    if (!res.ok) throw new Error(`${res.status} ${path}`);
    return res.text();
  }
  async function loadDoc(path) {
    if (cache.has(path)) return cache.get(path);
    const doc = MD.parseFrontmatter(await fetchText(path));
    cache.set(path, doc);
    return doc;
  }
  const stemOf = (p) => p.split("/").pop().replace(/\.md$/, "");
  const deckSlugOfNote = (stem) => stem.replace(/^\d{4}-\d{2}-\d{2}-/, "");

  function joinPath(baseDir, href) {
    const parts = (baseDir + href).split("/");
    const out = [];
    parts.forEach((p) => { if (p === "..") out.pop(); else if (p !== "." && p !== "") out.push(p); });
    return out.join("/") + (href.endsWith("/") ? "/" : "");
  }

  // Markdown 內一般連結的轉換：依檔案所在資料夾決定要去哪個畫面
  function linkResolver(baseDir) {
    return (href) => {
      if (href.startsWith("#")) return href;
      const p = joinPath(baseDir, href);
      if (/^wiki\/index\.md$/.test(p)) return "#/";
      if (/^wiki\/log\.md$/.test(p)) return "#/log";
      if (/^wiki\/.+\.md$/.test(p)) return `#/p/${stemOf(p)}`;
      if (/^notes\/index\.md$/.test(p)) return "#/notes";
      if (/^notes\/.+\.md$/.test(p)) return `#/n/${stemOf(p)}`;
      if (/^slides\/index\.md$/.test(p)) return "#/decks";
      if (/^slides\/.+\.md$/.test(p)) return `#/s/${stemOf(p)}`;
      if (/^raw\/_reading-list\.md$/.test(p)) return "#/reading";
      if (/^docs\/.+\.md$/.test(p)) return `#/d/${p.slice(5).replace(/\.md$/, "")}`;
      return p;
    };
  }
  const wikiResolver = (slug) => {
    const p = pages.get(slug);
    return p ? { href: `#/p/${slug}`, title: p.title } : null;
  };
  const ctxFor = (baseDir) => ({ wiki: wikiResolver, link: linkResolver(baseDir) });
  const renderInto = (el, html) => { el.innerHTML = html; MD.typeset(el); };

  // ---------- 目錄載入 ----------
  function parseList(text, cb) {
    text.split("\n").forEach((line) => {
      const sec = line.match(/^##\s+(.*)$/);
      if (sec) { cb({ section: sec[1].trim() }); return; }
      const item = line.match(/^- \[([^\]]+)\]\(([^)]+\.md)\)\s*(?:—\s*(.*))?$/);
      if (item) cb({ title: item[1], href: item[2], summary: item[3] || "" });
    });
  }

  async function loadIndexes() {
    const text = await fetchText("wiki/index.md");
    let current = null;
    parseList(text, (e) => {
      if (e.section) { current = { name: e.section, slugs: [] }; sections.push(current); return; }
      if (!current) return;
      const slug = stemOf(e.href);
      pages.set(slug, { slug, path: "wiki/" + e.href, title: e.title, summary: e.summary, category: current.name });
      current.slugs.push(slug);
    });
    const [n, s] = await Promise.all([
      fetchText("notes/index.md").catch(() => ""),
      fetchText("slides/index.md").catch(() => ""),
    ]);
    parseList(n, (e) => { if (e.title) notes.set(stemOf(e.href), { stem: stemOf(e.href), path: "notes/" + e.href, title: e.title, summary: e.summary }); });
    parseList(s, (e) => { if (e.title) decks.set(stemOf(e.href), { slug: stemOf(e.href), path: "slides/" + e.href, title: e.title, summary: e.summary }); });
  }

  async function loadAll() {
    const paths = [...pages.values(), ...notes.values(), ...decks.values()].map((x) => x.path);
    await Promise.all(paths.map((p) => loadDoc(p).catch(() => null)));
    allLoaded = true;
  }

  const linkRe = (slug) => new RegExp(`\\[\\[${slug.replace(/[-]/g, "\\-")}(\\||#|\\]\\])`);
  function wikiBacklinks(slug) {
    const re = linkRe(slug);
    return [...pages.values()].filter((p) => p.slug !== slug && cache.get(p.path) && re.test(cache.get(p.path).body));
  }
  function noteBacklinks(slug) {
    const re = linkRe(slug);
    return [...notes.values()].filter((n) => cache.get(n.path) && re.test(cache.get(n.path).body));
  }

  // ---------- 畫面零件 ----------
  function renderToc(active) {
    $("#toc").innerHTML = sections.map((sec) => `
      <h3>${esc(sec.name)}</h3>
      <ul>${sec.slugs.map((s) => {
        const p = pages.get(s);
        return `<li><a href="#/p/${s}" class="${s === active ? "active" : ""}" title="${esc(p.summary)}">${esc(p.title)}</a></li>`;
      }).join("")}</ul>`).join("");
  }
  function setNav(name) {
    document.querySelectorAll(".top-links a").forEach((a) => a.classList.toggle("active", a.dataset.nav === name));
  }
  function metaBar(meta, extra = "") {
    const type = meta.type || "";
    const tags = Array.isArray(meta.tags) ? meta.tags : [];
    const date = meta.updated || meta.created || "";
    return `<div class="page-meta">
      <span class="badge type-${esc(type)}">${TYPE_LABEL[type] || esc(type)}</span>
      ${tags.map((t) => `<span class="tag">${esc(t)}</span>`).join(" ")}
      ${extra}
      ${date ? `<span class="updated">${meta.updated ? "更新" : "建立"}：${esc(date)}</span>` : ""}
    </div>`;
  }
  const chip = (href, text, newTab) => `<a class="chip" href="${href}"${newTab ? ' target="_blank" rel="noopener"' : ""}>${text}</a>`;
  const notFound = (what) => `<h1>找不到${what}</h1><p class="muted">可能尚未登記在目錄中。</p><p><a href="#/">回到首頁</a></p>`;

  // ---------- 各畫面 ----------
  async function showWikiPage(slug) {
    renderToc(slug); setNav("");
    const p = pages.get(slug);
    if (!p) { content.innerHTML = notFound("頁面"); return; }
    const { meta, body } = await loadDoc(p.path);
    if (!allLoaded) await loadAll();
    const back = wikiBacklinks(slug);
    const nback = noteBacklinks(slug);
    renderInto(content, `${metaBar(meta)}<article class="md">${MD.render(body, ctxFor("wiki/"))}</article>
      <section class="backlinks"><h4>反向連結（${back.length}）— 哪些頁面提到這一頁</h4>
      ${back.length ? back.map((b) => chip(`#/p/${b.slug}`, esc(b.title))).join("") : '<span class="muted">目前沒有其他頁面連到這裡</span>'}
      ${nback.length ? `<h4 class="sub">引用這一頁的研究筆記（${nback.length}）</h4>${nback.map((n) => chip(`#/n/${n.stem}`, esc(n.title))).join("")}` : ""}
      </section>`);
    document.title = `${meta.title || p.title}｜美國審計知識資料庫`;
  }

  async function showNotes() {
    renderToc(null); setNav("notes");
    const list = [...notes.values()].sort((a, b) => b.stem.localeCompare(a.stem));
    content.innerHTML = `<div class="page-meta"><span class="badge type-note">研究筆記</span></div>
      <article class="md"><h1>研究筆記 Notes</h1>
      <p>針對一個問題或研究主題，<strong>只根據知識庫（wiki）已有的內容</strong>整理而成。網路上找到、但還沒放進 wiki 的資料，只會列在每篇最後的「建議參考文獻」，並登記到 <a href="#/reading">建議文獻清單</a>。</p></article>
      ${list.length ? `<div class="cards">${list.map((n) => {
        const d = deckSlugOfNote(n.stem);
        return `<div class="card"><a class="card-title" href="#/n/${n.stem}">${esc(n.title)}</a>
          <p>${esc(n.summary)}</p><div class="card-meta">${esc(n.stem.slice(0, 10))}
          ${decks.has(d) ? chip(`decks/${d}/`, "▶ 播放簡報", true) : ""}</div></div>`;
      }).join("")}</div>` : '<p class="empty">目前還沒有研究筆記。對 AI 說「研究：（你的問題）」就會產生第一篇。</p>'}`;
    document.title = "研究筆記｜美國審計知識資料庫";
  }

  async function showNote(stem) {
    renderToc(null); setNav("notes");
    const n = notes.get(stem);
    if (!n) { content.innerHTML = notFound("研究筆記"); return; }
    const { meta, body } = await loadDoc(n.path);
    const d = deckSlugOfNote(stem);
    const actions = decks.has(d) ? `<div class="actions">${chip(`decks/${d}/`, "▶ 播放簡報", true)}${chip(`#/s/${d}`, "逐頁稿")}</div>` : "";
    const used = Array.isArray(meta.wiki_pages) ? meta.wiki_pages.length : 0;
    renderInto(content, `${metaBar(meta, `<span class="tag-plain">依據 ${used} 個 wiki 頁面</span>`)}${actions}
      <article class="md">${MD.render(body, ctxFor("notes/"))}</article>`);
    document.title = `${meta.title || n.title}｜研究筆記`;
  }

  function splitSlides(body) {
    const parts = body.split(/^<!--\s*slide:\s*([\w-]+)\s*-->\s*$/m);
    const slides = [];
    for (let i = 1; i < parts.length; i += 2) slides.push({ type: parts[i], md: parts[i + 1] || "" });
    return slides;
  }

  async function showDecks() {
    renderToc(null); setNav("decks");
    if (!allLoaded) await loadAll();
    const list = [...decks.values()];
    content.innerHTML = `<div class="page-meta"><span class="badge type-slides">簡報</span></div>
      <article class="md"><h1>簡報 Slides</h1>
      <p>每份簡報都由一篇研究筆記產生：先寫逐頁稿（<code>slides/</code>），再由共用的簡報引擎播放（<code>decks/</code>）。簡報可用的圖示與圖解見 <a href="#/assets">素材庫</a>。</p></article>
      ${list.length ? `<div class="cards">${list.map((s) => {
        const doc = cache.get(s.path);
        const note = doc && doc.meta.note;
        const count = doc ? splitSlides(doc.body).length : 0;
        return `<div class="card"><a class="card-title" href="decks/${s.slug}/" target="_blank" rel="noopener">${esc(s.title)}</a>
          <p>${esc(s.summary)}</p><div class="card-meta">${count} 頁
          ${chip(`decks/${s.slug}/`, "▶ 播放", true)}${chip(`#/s/${s.slug}`, "逐頁稿")}
          ${note && notes.has(note) ? chip(`#/n/${note}`, "研究筆記") : ""}</div></div>`;
      }).join("")}</div>` : '<p class="empty">目前還沒有簡報。對 AI 說「做簡報：（研究筆記名稱）」就會產生逐頁稿。</p>'}`;
    document.title = "簡報｜美國審計知識資料庫";
  }

  async function showSlides(slug) {
    renderToc(null); setNav("decks");
    const s = decks.get(slug);
    if (!s) { content.innerHTML = notFound("簡報"); return; }
    const { meta, body } = await loadDoc(s.path);
    const slides = splitSlides(body);
    const ctx = ctxFor("slides/");
    renderInto(content, `${metaBar(meta)}
      <div class="actions">${chip(`decks/${slug}/`, "▶ 播放簡報", true)}${meta.note && notes.has(meta.note) ? chip(`#/n/${meta.note}`, "研究筆記") : ""}</div>
      <article class="md"><h1>${esc(meta.title || s.title)}｜逐頁稿</h1>
      ${slides.map((sl, i) => `<section class="slide-card"><div class="slide-card-head">第 ${i + 1} 頁 <span class="badge">${esc(sl.type)}</span></div>${MD.render(sl.md, ctx)}</section>`).join("")}
      </article>`);
    document.title = `${meta.title || s.title}｜逐頁稿`;
  }

  async function showReading() {
    renderToc(null); setNav("reading");
    const text = await fetchText("raw/_reading-list.md").catch(() => "# 建議文獻清單\n\n目前沒有資料。");
    renderInto(content, `<div class="page-meta"><span class="badge type-source">文獻清單</span></div>
      <article class="md reading">${MD.render(MD.parseFrontmatter(text).body, ctxFor("raw/"))}</article>`);
    document.title = "建議文獻清單｜美國審計知識資料庫";
  }

  async function showAssets() {
    renderToc(null); setNav("decks");
    const text = await fetchText("assets/index.md");
    renderInto(content, `<div class="page-meta"><span class="badge type-slides">素材庫</span></div>
      <article class="md">${MD.render(text, ctxFor("assets/"))}</article>`);
    document.title = "素材庫｜美國審計知識資料庫";
  }

  // 專案說明（docs/）：工作流程、執行紀錄、反思；與審計知識分開
  async function showDoc(path) {
    renderToc(null); setNav("docs");
    if (!/^[\w\/-]+$/.test(path)) { content.innerHTML = notFound("專案說明"); return; }
    let text;
    try { text = await fetchText(`docs/${path}.md`); } catch (e) { content.innerHTML = notFound("專案說明"); return; }
    const { meta, body } = MD.parseFrontmatter(text);
    const dir = "docs/" + (path.includes("/") ? path.slice(0, path.lastIndexOf("/") + 1) : "");
    renderInto(content, `<div class="page-meta"><span class="badge">專案說明</span>${path !== "index" ? ' <a href="#/d/index">← 專案說明首頁</a>' : ""}</div><article class="md">${MD.render(body, ctxFor(dir))}</article>`);
    document.title = `${(meta && meta.title) || "專案說明"}｜美國審計知識資料庫`;
  }
  async function showLog() {
    renderToc(null); setNav("log");
    const text = await fetchText("wiki/log.md");
    renderInto(content, `<div class="page-meta"><span class="badge">日誌</span></div><article class="md">${MD.render(text, ctxFor("wiki/"))}</article>`);
    document.title = "日誌｜美國審計知識資料庫";
  }

  async function showHome() {
    renderToc("overview"); setNav("home");
    const { body } = await loadDoc("wiki/overview.md");
    if (!allLoaded) await loadAll();
    const count = (name) => (sections.find((s) => s.name.includes(name)) || { slugs: [] }).slugs.length;
    const logText = await fetchText("wiki/log.md").catch(() => "");
    const recent = (logText.match(/^## \[.*$/gm) || []).slice(0, 5)
      .map((l) => `<li>${MD.inline(l.replace(/^##\s+/, ""), ctxFor("wiki/"))}</li>`).join("");
    renderInto(content, `
      <div class="hero">
        <h1>美國審計知識資料庫</h1>
        <p>一個由 AI 持續維護的 LLM Wiki：放入資料 → AI 摘要、歸檔、交叉連結 → 知識不斷累積 → 產生研究筆記與簡報。</p>
      </div>
      <div class="stats">
        <div class="stat"><b>${pages.size}</b><span>wiki 頁面</span></div>
        <div class="stat"><b>${count("準則")}</b><span>準則</span></div>
        <div class="stat"><b>${count("概念")}</b><span>概念</span></div>
        <div class="stat"><b>${count("資料來源")}</b><span>資料來源</span></div>
        <a class="stat" href="#/notes"><b>${notes.size}</b><span>研究筆記</span></a>
        <a class="stat" href="#/decks"><b>${decks.size}</b><span>簡報</span></a>
      </div>
      <article class="md">${MD.render(body.replace(/^#\s+.*\n/, ""), ctxFor("wiki/"))}</article>
      <section class="recent md"><h2>最近更新</h2><ul>${recent}</ul><p><a href="#/log">查看完整日誌 →</a></p></section>`);
    document.title = "美國審計知識資料庫｜US Audit LLM Wiki";
  }

  async function route() {
    const hash = decodeURIComponent(location.hash || "#/");
    $("#sidebar").classList.remove("open");
    window.scrollTo(0, 0);
    try {
      if (hash.startsWith("#/p/")) return await showWikiPage(hash.slice(4));
      if (hash.startsWith("#/n/")) return await showNote(hash.slice(4));
      if (hash.startsWith("#/s/")) return await showSlides(hash.slice(4));
      if (hash === "#/notes") return await showNotes();
      if (hash === "#/decks") return await showDecks();
      if (hash === "#/reading") return await showReading();
      if (hash === "#/assets") return await showAssets();
      if (hash === "#/log") return await showLog();
      if (hash === "#/docs") return await showDoc("index");
      if (hash.startsWith("#/d/")) return await showDoc(hash.slice(4));
      return await showHome();
    } catch (e) {
      content.innerHTML = `<h1>載入失敗</h1><p class="muted">${esc(e.message)}</p>`;
    }
  }

  // ---------- 搜尋（wiki ＋ 研究筆記） ----------
  function search(q) {
    const box = $("#searchResults");
    q = q.trim().toLowerCase();
    if (!q) { box.hidden = true; $("#toc").hidden = false; return; }
    const items = [
      ...[...pages.values()].map((p) => ({ href: `#/p/${p.slug}`, title: p.title, summary: p.summary, path: p.path, kind: "" })),
      ...[...notes.values()].map((n) => ({ href: `#/n/${n.stem}`, title: n.title, summary: n.summary, path: n.path, kind: "筆記" })),
    ];
    const reQ = new RegExp(esc(q).replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "ig");
    const hits = [];
    items.forEach((it) => {
      const doc = cache.get(it.path);
      const body = doc ? doc.body : "";
      const inTitle = it.title.toLowerCase().includes(q);
      const idx = body.toLowerCase().indexOf(q);
      if (inTitle || idx >= 0 || it.summary.toLowerCase().includes(q)) {
        let snippet = esc(it.summary);
        if (idx >= 0) {
          const raw = body.slice(Math.max(0, idx - 20), idx + q.length + 30).replace(/[#>*|\[\]`$]/g, " ");
          snippet = esc(raw).replace(reQ, (m) => `<mark>${m}</mark>`);
        }
        hits.push({ score: inTitle ? 0 : 1, html: `<a href="${it.href}">${it.kind ? `<span class="kind">${it.kind}</span>` : ""}${esc(it.title)}<span class="snippet">…${snippet}…</span></a>` });
      }
    });
    hits.sort((a, b) => a.score - b.score);
    box.innerHTML = hits.length ? hits.map((h) => h.html).join("") : '<p class="muted">找不到符合的頁面</p>';
    box.hidden = false;
    $("#toc").hidden = true;
  }

  // ---------- 啟動 ----------
  async function init() {
    try {
      await loadIndexes();
    } catch (e) {
      content.innerHTML = `<h1>無法載入 wiki/index.md</h1>
        <p>如果你是直接雙擊開啟 index.html，瀏覽器會擋住讀取本機檔案。請在專案資料夾執行：</p>
        <pre><code>python3 -m http.server 8000</code></pre><p>再開啟 <code>http://localhost:8000</code>。</p>`;
      return;
    }
    $("#searchInput").addEventListener("input", (e) => search(e.target.value));
    $("#menuBtn").addEventListener("click", () => $("#sidebar").classList.toggle("open"));
    window.addEventListener("hashchange", route);
    route();
    loadAll();
  }

  init();
})();

/* 美國審計知識資料庫 — 網站閱讀器
 * 只負責「讀取並呈現」Markdown；新增內容不需要修改本檔。
 *   wiki/index.md    → 知識庫目錄（左側欄）
 *   notes/index.md   → 研究筆記清單
 *   slides/index.md  → 簡報清單（播放器在 decks/<slug>/）
 *   raw/_reading-list.md → 建議文獻清單
 * 前台（給學習者）：講義庫 #/、知識庫 #/wiki、#/p/…、筆記 #/n/…、逐頁稿 #/s/…
 * 後台（給維護者）：維護者專區 #/admin → 日誌、建議文獻、專案說明、素材庫
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
      if (/^wiki\/index\.md$/.test(p)) return "#/wiki";
      if (/^wiki\/log\.md$/.test(p)) return "#/log";
      if (/^wiki\/.+\.md$/.test(p)) return `#/p/${stemOf(p)}`;
      if (/^notes\/index\.md$/.test(p)) return "#/";
      if (/^notes\/.+\.md$/.test(p)) return `#/n/${stemOf(p)}`;
      if (/^slides\/index\.md$/.test(p)) return "#/";
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
    return [...pages.values()].filter((p) => p.slug !== slug && !isSourceSection(p.category) && cache.get(p.path) && re.test(cache.get(p.path).body));
  }
  function noteBacklinks(slug) {
    const re = linkRe(slug);
    return [...notes.values()].filter((n) => cache.get(n.path) && re.test(cache.get(n.path).body));
  }

  // ---------- 前台／後台 ----------
  // 資料來源頁屬於後台：前台的目錄、搜尋、反向連結都不列出
  const isSourceSection = (name) => name.includes("資料來源");
  const isSource = (slug) => { const p = pages.get(slug); return !!p && isSourceSection(p.category); };
  // 維護者專區密碼：只存 SHA-256 雜湊值。這是靜態網站上的簡易門檻，不是真正的權限控管
  // （GitHub 上的原始檔仍是公開的）。
  const ADMIN_HASH = "420dcd632bde6df72babf3bd372689f6a30d55344ed966f865c2f1811330489a";
  let adminOk = false;
  try { adminOk = sessionStorage.getItem("admin-ok") === ADMIN_HASH; } catch (e) { /* 無法使用 sessionStorage 時只記在記憶體 */ }
  const isAdminRoute = (h) => h === "#/admin" || h === "#/log" || h === "#/reading" || h === "#/assets" ||
    h === "#/docs" || h.startsWith("#/d/") || (h.startsWith("#/p/") && isSource(h.slice(4)));
  async function sha256(text) {
    const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
    return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");
  }
  function showLock() {
    renderToc(null); setNav("admin");
    content.innerHTML = `<div class="lock">
      <h1>維護者專區</h1>
      <p class="muted">這裡是維護知識庫用的後台資訊，請輸入密碼。</p>
      <form id="lockForm"><input id="lockInput" type="password" placeholder="密碼" autocomplete="current-password" autofocus>
      <button type="submit" class="btn primary">進入</button></form>
      <p id="lockMsg" class="lock-msg" role="alert"></p>
      <p><a href="#/">← 回講義庫</a></p></div>`;
    $("#lockForm").addEventListener("submit", async (e) => {
      e.preventDefault();
      let ok = false;
      try { ok = (await sha256($("#lockInput").value.trim())) === ADMIN_HASH; }
      catch (err) { $("#lockMsg").textContent = "這個瀏覽器無法驗證密碼（需要 https 或 localhost）。"; return; }
      if (!ok) { $("#lockMsg").textContent = "密碼不正確，請再試一次。"; $("#lockInput").select(); return; }
      adminOk = true;
      try { sessionStorage.setItem("admin-ok", ADMIN_HASH); } catch (err) { /* 忽略 */ }
      route();
    });
    document.title = "維護者專區｜美國審計知識資料庫";
  }

  // ---------- 畫面零件 ----------
  function renderToc(active) {
    $("#toc").innerHTML = sections.filter((sec) => !isSourceSection(sec.name)).map((sec) => `
      <h3>${esc(sec.name)}</h3>
      <ul>${sec.slugs.map((s) => {
        const p = pages.get(s);
        return `<li><a href="#/p/${s}" class="${s === active ? "active" : ""}" title="${esc(p.summary)}">${esc(p.title)}</a></li>`;
      }).join("")}</ul>`).join("");
  }
  function setNav(name) {
    document.querySelectorAll(".top-links a, .mobile-nav a").forEach((a) => a.classList.toggle("active", a.dataset.nav === name));
    // 只有知識庫頁面需要左側目錄；講義庫與維護者專區用單欄版面
    $(".layout").classList.toggle("solo", name !== "wiki");
  }
  const backTo = (href, text) => `<a class="back" href="${href}">← ${text}</a>`;
  // 來源頁的「待查證／疑點」是維護用資訊：網站上預設收合（Markdown 原檔不變）
  function foldTodo(root) {
    root.querySelectorAll("h2").forEach((h) => {
      if (!h.textContent.includes("待查證")) return;
      const d = document.createElement("details");
      d.className = "maint";
      d.innerHTML = `<summary>${esc(h.textContent)}（維護用資訊，點開查看）</summary>`;
      let n = h.nextElementSibling;
      while (n && n.tagName !== "H2") { const next = n.nextElementSibling; d.appendChild(n); n = next; }
      h.replaceWith(d);
    });
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
    const src = isSource(slug);
    renderToc(slug); setNav(src ? "admin" : "wiki");
    const p = pages.get(slug);
    if (!p) { content.innerHTML = notFound("頁面"); return; }
    const { meta, body } = await loadDoc(p.path);
    if (!allLoaded) await loadAll();
    const back = wikiBacklinks(slug);
    const nback = noteBacklinks(slug);
    renderInto(content, `${src ? backTo("#/admin", "維護者專區") : ""}${metaBar(meta)}<article class="md">${MD.render(body, ctxFor("wiki/"))}</article>
      <section class="backlinks"><h4>反向連結（${back.length}）— 哪些頁面提到這一頁</h4>
      ${back.length ? back.map((b) => chip(`#/p/${b.slug}`, esc(b.title))).join("") : '<span class="muted">目前沒有其他頁面連到這裡</span>'}
      ${nback.length ? `<h4 class="sub">引用這一頁的研究筆記（${nback.length}）</h4>${nback.map((n) => chip(`#/n/${n.stem}`, esc(n.title))).join("")}` : ""}
      </section>`);
    foldTodo(content);
    document.title = `${meta.title || p.title}｜美國審計知識資料庫`;
  }


  async function showNote(stem) {
    renderToc(null); setNav("lessons");
    const n = notes.get(stem);
    if (!n) { content.innerHTML = notFound("研究筆記"); return; }
    const { meta, body } = await loadDoc(n.path);
    const d = deckSlugOfNote(stem);
    const actions = decks.has(d) ? `<div class="actions">${chip(`decks/${d}/`, "▶ 播放簡報", true)}${chip(`#/s/${d}`, "逐頁稿")}</div>` : "";
    const used = Array.isArray(meta.wiki_pages) ? meta.wiki_pages.length : 0;
    renderInto(content, `${backTo("#/", "講義庫")}${metaBar(meta, `<span class="tag-plain">依據 ${used} 個 wiki 頁面</span>`)}${actions}
      <article class="md">${MD.render(body, ctxFor("notes/"))}</article>`);
    document.title = `${meta.title || n.title}｜研究筆記`;
  }

  function splitSlides(body) {
    const parts = body.split(/^<!--\s*slide:\s*([\w-]+)\s*-->\s*$/m);
    const slides = [];
    for (let i = 1; i < parts.length; i += 2) slides.push({ type: parts[i], md: parts[i + 1] || "" });
    return slides;
  }


  async function showSlides(slug) {
    renderToc(null); setNav("lessons");
    const s = decks.get(slug);
    if (!s) { content.innerHTML = notFound("簡報"); return; }
    const { meta, body } = await loadDoc(s.path);
    const slides = splitSlides(body);
    const ctx = ctxFor("slides/");
    renderInto(content, `${backTo("#/", "講義庫")}${metaBar(meta)}
      <div class="actions">${chip(`decks/${slug}/`, "▶ 播放簡報", true)}${meta.note && notes.has(meta.note) ? chip(`#/n/${meta.note}`, "研究筆記") : ""}</div>
      <article class="md"><h1>${esc(meta.title || s.title)}｜逐頁稿</h1>
      ${slides.map((sl, i) => `<section class="slide-card"><div class="slide-card-head">第 ${i + 1} 頁 <span class="badge">${esc(sl.type)}</span></div>${MD.render(sl.md, ctx)}</section>`).join("")}
      </article>`);
    document.title = `${meta.title || s.title}｜逐頁稿`;
  }

  async function showReading() {
    renderToc(null); setNav("admin");
    const text = await fetchText("raw/_reading-list.md").catch(() => "# 建議文獻清單\n\n目前沒有資料。");
    renderInto(content, `${backTo("#/admin", "維護者專區")}<div class="page-meta"><span class="badge type-source">文獻清單</span></div>
      <article class="md reading">${MD.render(MD.parseFrontmatter(text).body, ctxFor("raw/"))}</article>`);
    document.title = "建議文獻清單｜美國審計知識資料庫";
  }

  async function showAssets() {
    renderToc(null); setNav("admin");
    const text = await fetchText("assets/index.md");
    renderInto(content, `${backTo("#/admin", "維護者專區")}<div class="page-meta"><span class="badge type-slides">素材庫</span></div>
      <article class="md">${MD.render(text, ctxFor("assets/"))}</article>`);
    document.title = "素材庫｜美國審計知識資料庫";
  }

  // 專案說明（docs/）：工作流程、執行紀錄、反思；與審計知識分開
  async function showDoc(path) {
    renderToc(null); setNav("admin");
    if (!/^[\w\/-]+$/.test(path)) { content.innerHTML = notFound("專案說明"); return; }
    let text;
    try { text = await fetchText(`docs/${path}.md`); } catch (e) { content.innerHTML = notFound("專案說明"); return; }
    const { meta, body } = MD.parseFrontmatter(text);
    const dir = "docs/" + (path.includes("/") ? path.slice(0, path.lastIndexOf("/") + 1) : "");
    renderInto(content, `${path !== "index" ? backTo("#/d/index", "專案說明") : backTo("#/admin", "維護者專區")}<div class="page-meta"><span class="badge">專案說明</span></div><article class="md">${MD.render(body, ctxFor(dir))}</article>`);
    document.title = `${(meta && meta.title) || "專案說明"}｜美國審計知識資料庫`;
  }
  async function showLog() {
    renderToc(null); setNav("admin");
    const text = await fetchText("wiki/log.md");
    renderInto(content, `${backTo("#/admin", "維護者專區")}<div class="page-meta"><span class="badge">日誌</span></div><article class="md">${MD.render(text, ctxFor("wiki/"))}</article>`);
    document.title = "日誌｜美國審計知識資料庫";
  }

  // ---------- 前台：講義庫（首頁） ----------
  async function showLessons() {
    renderToc(null); setNav("lessons");
    if (!allLoaded) await loadAll();
    const list = [...notes.values()].sort((a, b) => b.stem.localeCompare(a.stem));
    const card = (n) => {
      const d = deckSlugOfNote(n.stem);
      const sd = decks.has(d) ? cache.get(decks.get(d).path) : null;
      const count = sd ? splitSlides(sd.body).length : 0;
      const sub = sd && sd.meta.subtitle ? sd.meta.subtitle : n.summary;
      return `<article class="lesson">
        <div class="lesson-tag">${esc(n.stem.slice(0, 10))}${count ? `・簡報 ${count} 頁` : ""}</div>
        <h2>${esc(n.title)}</h2>
        <p class="lesson-sub">${esc(sub)}</p>
        <p class="lesson-sum">${esc(n.summary)}</p>
        <div class="lesson-actions">
          ${decks.has(d) ? `<a class="btn primary" href="decks/${d}/" target="_blank" rel="noopener">▶ 播放簡報</a>` : ""}
          <a class="btn" href="#/n/${n.stem}">閱讀筆記</a>
          ${decks.has(d) ? `<a class="btn ghost" href="#/s/${d}">逐頁稿</a>` : ""}
        </div></article>`;
    };
    renderInto(content, `
      <div class="hero hero-lessons">
        <div><h1>審計，從零開始看懂。</h1>
        <p>每份講義都來自同一個知識庫：先播放簡報快速入門，再讀研究筆記看完整說明。</p></div>
        <img src="assets/mascot/owl-wave-sticker.svg" alt="揮手的貓頭鷹審計師">
      </div>
      <h2 class="lib-title">講義庫</h2>
      ${list.length ? `<div class="lessons">${list.map(card).join("")}</div>` : '<p class="empty">目前還沒有講義。對 AI 說「研究：（你的問題）」就會產生第一篇。</p>'}
      <p class="more muted">更多講義，陸續加入中…　想查準則與概念，請到 <a href="#/wiki">知識庫</a>。</p>`);
    document.title = "講義庫｜美國審計知識資料庫";
  }

  // ---------- 前台：知識庫總覽 ----------
  async function showWikiHome() {
    renderToc("overview"); setNav("wiki");
    const { body } = await loadDoc("wiki/overview.md");
    if (!allLoaded) await loadAll();
    const count = (name) => (sections.find((s) => s.name.includes(name)) || { slugs: [] }).slugs.length;
    renderInto(content, `
      <div class="hero">
        <h1>美國審計知識庫</h1>
        <p>由 AI 持續維護的 LLM Wiki：每加入一份資料，就整合進既有頁面、互相連結。左側目錄可瀏覽所有準則、概念與機構。</p>
      </div>
      <div class="stats">
        <div class="stat"><b>${count("準則")}</b><span>準則</span></div>
        <div class="stat"><b>${count("概念")}</b><span>概念</span></div>
        <div class="stat"><b>${count("機構")}</b><span>機構</span></div>
        <div class="stat"><b>${count("綜合分析")}</b><span>綜合分析</span></div>
        <a class="stat" href="#/"><b>${notes.size}</b><span>講義</span></a>
      </div>
      <article class="md">${MD.render(body.replace(/^#\s+.*\n/, ""), ctxFor("wiki/"))}</article>`);
    document.title = "知識庫｜美國審計知識資料庫";
  }

  // ---------- 後台：維護者專區 ----------
  async function showAdmin() {
    renderToc(null); setNav("admin");
    const logText = await fetchText("wiki/log.md").catch(() => "");
    const recent = (logText.match(/^## \[.*$/gm) || []).slice(0, 5)
      .map((l) => `<li>${MD.inline(l.replace(/^##\s+/, ""), ctxFor("wiki/"))}</li>`).join("");
    const reading = await fetchText("raw/_reading-list.md").catch(() => "");
    const pending = (reading.match(/\|\s*待下載\s*\|/g) || []).length;
    const srcs = (sections.find((s) => s.name.includes("資料來源")) || { slugs: [] }).slugs;
    if (!allLoaded) await loadAll();
    // 每份來源的原始檔數取自 frontmatter 的 files（批次匯入時為整批檔案數，預設 1）
    const nFiles = (sl) => { const d = cache.get(pages.get(sl).path); const n = d && parseInt(d.meta.files, 10); return n > 0 ? n : 1; };
    const totalFiles = srcs.reduce((a, sl) => a + nFiles(sl), 0);
    const tile = (href, title, desc) => `<a class="admin-tile" href="${href}"><b>${title}</b><span>${desc}</span></a>`;
    renderInto(content, `<div class="page-meta"><span class="badge">維護者專區</span></div>
      <article class="md"><h1>維護者專區</h1>
      <p>給維護這個知識庫的人（使用者與 AI）看的後台資訊。學習者只需要使用上方的「講義庫」與「知識庫」。</p>
      <p><a href="#/admin" id="lockBtn">🔒 鎖上維護者專區</a></p></article>
      <div class="admin-grid">
        ${tile("#/d/index", "專案說明", "工作流程圖、執行紀錄、反思")}
        ${tile("#/reading", "建議文獻清單", `研究筆記列出的官方文獻；待下載 ${pending} 筆`)}
        ${tile("#/log", "日誌", "所有 ingest、筆記、簡報、規則變更的紀錄")}
        ${tile("#/assets", "素材庫", "簡報可用的圖示、圖解與吉祥物")}
      </div>
      <section class="md"><h2>資料來源（${totalFiles}）</h2><p class="muted">每份原始資料的摘要與「待查證／疑點」。</p>
      <ul>${srcs.map((sl) => `<li><a href="#/p/${sl}">${esc(pages.get(sl).title)}</a>（${nFiles(sl)}）</li>`).join("")}</ul>
      <h2>最近更新</h2><ul>${recent}</ul></section>`);
    $("#lockBtn").addEventListener("click", (e) => {
      e.preventDefault(); adminOk = false;
      try { sessionStorage.removeItem("admin-ok"); } catch (err) { /* 忽略 */ }
      location.hash = "#/";
    });
    document.title = "維護者專區｜美國審計知識資料庫";
  }

  async function route() {
    const hash = decodeURIComponent(location.hash || "#/");
    $("#sidebar").classList.remove("open");
    window.scrollTo(0, 0);
    try {
      if (isAdminRoute(hash) && !adminOk) return showLock();
      if (hash.startsWith("#/p/")) return await showWikiPage(hash.slice(4));
      if (hash.startsWith("#/n/")) return await showNote(hash.slice(4));
      if (hash.startsWith("#/s/")) return await showSlides(hash.slice(4));
      if (hash === "#/wiki") return await showWikiHome();
      if (hash === "#/admin") return await showAdmin();
      if (hash === "#/reading") return await showReading();
      if (hash === "#/assets") return await showAssets();
      if (hash === "#/log") return await showLog();
      if (hash === "#/docs") return await showDoc("index");
      if (hash.startsWith("#/d/")) return await showDoc(hash.slice(4));
      return await showLessons();  // #/、舊網址 #/notes、#/decks 都導向講義庫
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
      ...[...pages.values()].filter((p) => !isSourceSection(p.category)).map((p) => ({ href: `#/p/${p.slug}`, title: p.title, summary: p.summary, path: p.path, kind: "" })),
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

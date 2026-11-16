/* 美國審計知識資料庫 — 共用簡報引擎
 * 讀取 slides/<slug>.md（逐頁稿），依 <!-- slide: 頁型 --> 分頁並播放。
 * slug 預設取自所在資料夾名稱（decks/<slug>/index.html），也可用 <body data-slug="..."> 指定。
 * 頁型 figure（左圖右文）／figure-right（左文右圖）：該頁第一張獨立一行的圖片放在圖的那一側，其餘內容放另一側。
 * 操作：← → 空白鍵 翻頁｜Home/End 首末頁｜F 全螢幕｜N 講者備註｜O 總覽｜P 列印／存 PDF
 * 新增簡報不需要修改本檔。
 */
(() => {
  "use strict";

  const ROOT = "../../";
  const TYPES = ["cover", "agenda", "section", "points", "compare", "key", "figure", "figure-right", "summary"];
  const W = 1280, H = 720;

  const slug = document.body.dataset.slug ||
    decodeURIComponent(location.pathname.replace(/\/index\.html$/, "").replace(/\/$/, "").split("/").pop());

  const deckEl = document.getElementById("deck");
  let slides = [];
  let cur = 0;
  let wikiTitles = new Map();

  const esc = MD.esc;

  async function fetchText(p) {
    const r = await fetch(p, { cache: "no-cache" });
    if (!r.ok) throw new Error(`${r.status} ${p}`);
    return r.text();
  }

  // 連結一律回到主網站（另開分頁）
  const ctx = {
    wiki: (s) => (wikiTitles.has(s) ? { href: `${ROOT}index.html#/p/${s}`, title: wikiTitles.get(s), target: "_blank" } : null),
    link: (href) => {
      const m = href.match(/(?:^|\/)(wiki|notes)\/(.+)\.md$/);
      if (m) return `${ROOT}index.html#/${m[1] === "wiki" ? "p" : "n"}/${m[2].split("/").pop()}`;
      return href;
    },
    asset: (src) => ROOT + src,
  };

  function parseSlides(body) {
    const parts = body.split(/^<!--\s*slide:\s*([\w-]+)\s*-->\s*$/m);
    const out = [];
    for (let i = 1; i < parts.length; i += 2) {
      let md = parts[i + 1] || "";
      let notes = "";
      md = md.replace(/^:::\s*notes\s*\n([\s\S]*?)^:::\s*$/m, (_, n) => { notes = n.trim(); return ""; });
      let source = "";
      md = md.replace(/^來源[:：]\s*(.+)$/m, (_, s) => { source = s.trim(); return ""; });
      const type = TYPES.includes(parts[i]) ? parts[i] : "points";
      let figure = "";
      if (type === "figure" || type === "figure-right") {
        md = md.replace(/^\s*(!\[[^\]]*\]\([^)\s]+\))\s*$/m, (_, img) => { figure = img; return ""; });
      }
      out.push({ type, md: md.trim(), notes, source, figure });
    }
    return out;
  }

  function build(meta) {
    const total = slides.length;
    deckEl.innerHTML = `
      <div class="stage" id="stage">${slides.map((s, i) => `
        <section class="slide slide-${s.type}" data-i="${i}">
          ${s.figure !== undefined && (s.type === "figure" || s.type === "figure-right")
            ? `<div class="slide-body figure-wrap"><div class="fig-img">${MD.inline(s.figure, ctx)}</div><div class="fig-text">${MD.render(s.md, ctx)}</div></div>`
            : `<div class="slide-body">${MD.render(s.md, ctx)}</div>`}
          ${s.type === "cover" ? `<div class="cover-meta">${esc(meta.author || "")}${meta.author && meta.created ? "｜" : ""}${esc(meta.created || "")}</div>` : ""}
          <footer class="slide-foot">
            <span class="foot-source">${s.source ? "來源：" + MD.inline(s.source, ctx) : ""}</span>
            <span class="foot-title">${esc(meta.title || "")}</span>
            <span class="foot-num">${i + 1} / ${total}</span>
          </footer>
        </section>`).join("")}
      </div>
      <div class="progress"><div class="bar" id="bar"></div></div>
      <aside class="notes-panel" id="notesPanel" hidden></aside>
      <div class="overview" id="overview" hidden></div>
      <div class="help" id="help">← → 翻頁　F 全螢幕　N 講者備註　O 總覽　P 列印／PDF</div>`;
    MD.typeset(deckEl);
    // 列印用：每頁講者備註
    document.title = `${meta.title || slug}｜簡報`;
  }

  function fit() {
    const stage = document.getElementById("stage");
    if (!stage) return;
    const scale = Math.min(window.innerWidth / W, window.innerHeight / H);
    stage.style.transform = `translate(-50%, -50%) scale(${scale})`;
  }

  function go(i) {
    cur = Math.max(0, Math.min(slides.length - 1, i));
    document.querySelectorAll(".slide").forEach((el, k) => el.classList.toggle("active", k === cur));
    document.getElementById("bar").style.width = `${((cur + 1) / slides.length) * 100}%`;
    const np = document.getElementById("notesPanel");
    np.innerHTML = `<b>講者備註（第 ${cur + 1} 頁）</b>${slides[cur].notes ? MD.render(slides[cur].notes, ctx) : '<p class="muted">（本頁沒有備註）</p>'}`;
    MD.typeset(np);
    history.replaceState(null, "", `#${cur + 1}`);
  }

  function toggleOverview() {
    const ov = document.getElementById("overview");
    if (ov.hidden) {
      ov.innerHTML = slides.map((s, i) => {
        const h = (s.md.match(/^#{1,2}\s+(.+)$/m) || [, s.type])[1];
        return `<button data-i="${i}" class="${i === cur ? "cur" : ""}"><span>${i + 1}</span>${esc(h.replace(/[*`$\[\]]/g, ""))}</button>`;
      }).join("");
      ov.querySelectorAll("button").forEach((b) => b.addEventListener("click", () => { go(+b.dataset.i); ov.hidden = true; }));
    }
    ov.hidden = !ov.hidden;
  }

  function bind() {
    document.addEventListener("keydown", (e) => {
      if (["ArrowRight", "PageDown", " ", "Enter"].includes(e.key)) { e.preventDefault(); go(cur + 1); }
      else if (["ArrowLeft", "PageUp", "Backspace"].includes(e.key)) { e.preventDefault(); go(cur - 1); }
      else if (e.key === "Home") go(0);
      else if (e.key === "End") go(slides.length - 1);
      else if (e.key === "f" || e.key === "F") {
        if (document.fullscreenElement) document.exitFullscreen(); else document.documentElement.requestFullscreen().catch(() => {});
      } else if (e.key === "n" || e.key === "N") { const p = document.getElementById("notesPanel"); p.hidden = !p.hidden; }
      else if (e.key === "o" || e.key === "O") toggleOverview();
      else if (e.key === "p" || e.key === "P") window.print();
      else if (e.key === "Escape") document.getElementById("overview").hidden = true;
    });
    document.getElementById("stage").addEventListener("click", (e) => {
      if (e.target.closest("a")) return;
      go(e.clientX > window.innerWidth / 2 ? cur + 1 : cur - 1);
    });
    let x0 = null;
    document.addEventListener("touchstart", (e) => { x0 = e.touches[0].clientX; }, { passive: true });
    document.addEventListener("touchend", (e) => {
      if (x0 === null) return;
      const dx = e.changedTouches[0].clientX - x0;
      if (Math.abs(dx) > 40) go(dx < 0 ? cur + 1 : cur - 1);
      x0 = null;
    });
    window.addEventListener("resize", fit);
    setTimeout(() => document.getElementById("help").classList.add("fade"), 3500);
  }

  async function init() {
    try {
      const [text, index] = await Promise.all([
        fetchText(`${ROOT}slides/${slug}.md`),
        fetchText(`${ROOT}wiki/index.md`).catch(() => ""),
      ]);
      index.split("\n").forEach((l) => {
        const m = l.match(/^- \[([^\]]+)\]\(([^)]+)\.md\)/);
        if (m) wikiTitles.set(m[2].split("/").pop(), m[1]);
      });
      const { meta, body } = MD.parseFrontmatter(text);
      slides = parseSlides(body);
      if (!slides.length) throw new Error("逐頁稿中沒有任何 <!-- slide: 頁型 --> 標記");
      build(meta);
      fit();
      bind();
      const start = parseInt(location.hash.slice(1), 10);
      go(Number.isFinite(start) ? start - 1 : 0);
    } catch (e) {
      deckEl.innerHTML = `<div class="deck-error"><h1>無法載入簡報「${esc(slug)}」</h1><p>${esc(e.message)}</p>
        <p>請確認 <code>slides/${esc(slug)}.md</code> 存在，並用本機伺服器或 GitHub Pages 開啟。</p></div>`;
    }
  }

  init();
})();

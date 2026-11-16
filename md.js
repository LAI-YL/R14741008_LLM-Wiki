/* 美國審計知識資料庫 — 共用 Markdown 渲染器（網站與簡報共用）
 * 支援：標題、段落、清單（巢狀、核取方塊）、表格、引用、提示框 [!type]、程式碼區塊、
 *       ::: notes 講者備註、[[wikilink]]、一般連結、粗體、斜體、行內程式碼、
 *       LaTeX 數學式：行內 $...$ 或 \(...\)，獨立區塊 $$...$$ 或 \[...\]（以 KaTeX 渲染）
 * 金額的錢字號請寫成 \$（例：US\$1,000,000），避免被當成數學式。
 * HTML 註解行（<!-- ... -->）不會顯示。
 * 圖片：![說明](assets/icons/scale.svg)，路徑一律從專案根目錄寫起；
 *       指定寬度用 ![說明|240](路徑)（單位 px）。
 */
(function (global) {
  "use strict";

  const CALLOUT_LABEL = { exam: "考點", conflict: "差異／矛盾", stale: "可能過時", todo: "待查證" };

  const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

  function parseFrontmatter(text) {
    const meta = {};
    text = text.replace(/\r/g, "");
    if (!text.startsWith("---")) return { meta, body: text };
    const end = text.indexOf("\n---", 3);
    if (end === -1) return { meta, body: text };
    text.slice(3, end).split("\n").forEach((line) => {
      const i = line.indexOf(":");
      if (i < 0) return;
      const k = line.slice(0, i).trim();
      let v = line.slice(i + 1).replace(/\s#.*$/, "").trim();
      if (v.startsWith("[") && v.endsWith("]")) {
        v = v.slice(1, -1).split(",").map((x) => x.trim()).filter(Boolean);
      }
      meta[k] = v;
    });
    return { meta, body: text.slice(end + 4).replace(/^\n+/, "") };
  }

  const mathSpan = (tex, display) =>
    `<span class="math${display ? " math-display" : ""}" data-display="${display ? 1 : 0}">${esc(tex)}</span>`;

  function imgTag(alt, src, ctx) {
    let width = "";
    const m = alt.match(/^(.*)\|(\d+)$/);
    if (m) { alt = m[1]; width = m[2]; }
    const url = /^(https?:|data:)/.test(src) ? src : (ctx && ctx.asset ? ctx.asset(src) : src);
    return `<img src="${esc(url)}" alt="${esc(alt)}"${width ? ` style="width:${width}px"` : ""} loading="lazy">`;
  }

  // ctx = { wiki(slug) -> {href, title} | null, link(href) -> href, asset(src) -> url }
  function inline(src, ctx) {
    const store = [];
    const keep = (html) => { store.push(html); return `\u0000${store.length - 1}\u0000`; };
    let s = src;
    s = s.replace(/`([^`]+)`/g, (_, c) => keep(`<code>${esc(c)}</code>`));
    s = s.replace(/\\\$/g, () => keep("$"));
    s = s.replace(/!\[([^\]]*)\]\(([^)\s]+)\)/g, (_, alt, src) => keep(imgTag(alt, src, ctx)));
    s = s.replace(/\\\((.+?)\\\)/g, (_, t) => keep(mathSpan(t, false)));
    // 行內數學式（pandoc 規則）：$ 後不能是空白；結尾 $ 前不能是空白、後面不能是數字
    s = s.replace(/\$(?=\S)([^$\n]*?\S)\$(?!\d)/g, (_, t) => keep(mathSpan(t, false)));
    s = esc(s);
    s = s.replace(/\[\[([^\]|#]+)(?:#[^\]|]*)?(?:\|([^\]]+))?\]\]/g, (_, slug, label) => {
      slug = slug.trim();
      const p = ctx && ctx.wiki ? ctx.wiki(slug) : null;
      const text = label || (p ? p.title : slug);
      return p
        ? `<a class="wikilink" href="${p.href}"${p.target ? ` target="${p.target}"` : ""}>${text}</a>`
        : `<a class="wikilink broken" title="頁面不存在">${text}</a>`;
    });
    s = s.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (_, text, href) => {
      if (/^https?:/.test(href)) return `<a href="${href}" target="_blank" rel="noopener">${text}</a>`;
      const h = ctx && ctx.link ? ctx.link(href) : href;
      return `<a class="wikilink" href="${h}">${text}</a>`;
    });
    s = s.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
    s = s.replace(/(^|[^*])\*([^*\s][^*]*)\*/g, "$1<em>$2</em>");
    return s.replace(/\u0000(\d+)\u0000/g, (_, i) => store[+i]);
  }

  function splitCells(line) {
    // 保護 [[slug|文字]]、`code`、$math$ 裡的 |
    const prot = line.trim()
      .replace(/\[\[[^\]]*\]\]/g, (m) => m.replace(/\|/g, "\u0001"))
      .replace(/!\[[^\]]*\]/g, (m) => m.replace(/\|/g, "\u0001"))
      .replace(/`[^`]*`/g, (m) => m.replace(/\|/g, "\u0001"))
      .replace(/\$[^$]*\$/g, (m) => m.replace(/\|/g, "\u0001"));
    return prot.replace(/^\||\|$/g, "").split("|").map((c) => c.replace(/\u0001/g, "|").trim());
  }

  function renderTable(lines, ctx) {
    const head = splitCells(lines[0]);
    const rows = lines.slice(2).map(splitCells);
    return `<div class="table-wrap"><table><thead><tr>${head.map((c) => `<th>${inline(c, ctx)}</th>`).join("")}</tr></thead><tbody>${
      rows.map((r) => `<tr>${r.map((c) => `<td>${inline(c, ctx)}</td>`).join("")}</tr>`).join("")
    }</tbody></table></div>`;
  }

  function renderList(lines, ctx) {
    let html = "";
    const stack = [];
    lines.forEach((line) => {
      const m = line.match(/^(\s*)([-*]|\d+\.)\s+(.*)$/);
      const indent = m[1].replace(/\t/g, "  ").length;
      const tag = /\d/.test(m[2]) ? "ol" : "ul";
      let item = m[3];
      const task = item.match(/^\[( |x)\]\s+(.*)$/i);
      item = task
        ? `<input type="checkbox" disabled ${task[1] !== " " ? "checked" : ""}> ${inline(task[2], ctx)}`
        : inline(item, ctx);
      while (stack.length && indent < stack[stack.length - 1].indent) html += `</li></${stack.pop().tag}>`;
      const top = stack[stack.length - 1];
      if (!top || indent > top.indent) { stack.push({ indent, tag }); html += `<${tag}><li>${item}`; }
      else html += `</li><li>${item}`;
    });
    while (stack.length) html += `</li></${stack.pop().tag}>`;
    return html;
  }

  const BLOCK_START = /^(#{1,4}\s|>|```|\$\$|\\\[|:::|<!--|\s*([-*]|\d+\.)\s+|\s*\|)/;

  function render(md, ctx) {
    const lines = String(md).replace(/\r/g, "").split("\n");
    let html = "";
    let i = 0;
    while (i < lines.length) {
      const line = lines[i];
      const t = line.trim();
      if (!t) { i++; continue; }

      if (/^<!--.*-->$/.test(t)) { i++; continue; }

      if (line.startsWith("```")) {
        const buf = []; i++;
        while (i < lines.length && !lines[i].startsWith("```")) buf.push(lines[i++]);
        i++;
        html += `<pre><code>${esc(buf.join("\n"))}</code></pre>`;
        continue;
      }
      // 獨立數學式區塊
      if (t.startsWith("$$") || t.startsWith("\\[")) {
        const close = t.startsWith("$$") ? "$$" : "\\]";
        let body = t.slice(2);
        if (body.trim().endsWith(close) && body.trim().length >= close.length) {
          body = body.trim().slice(0, -close.length); i++;
        } else {
          const buf = [body]; i++;
          while (i < lines.length && !lines[i].trim().endsWith(close)) buf.push(lines[i++]);
          if (i < lines.length) { buf.push(lines[i].trim().slice(0, -close.length)); i++; }
          body = buf.join("\n");
        }
        html += `<div class="math-block">${mathSpan(body.trim(), true)}</div>`;
        continue;
      }
      // ::: notes（講者備註）或其他 ::: 區塊
      const fence = t.match(/^:::\s*(\w+)/);
      if (fence) {
        const buf = []; i++;
        while (i < lines.length && lines[i].trim() !== ":::") buf.push(lines[i++]);
        i++;
        const cls = fence[1] === "notes" ? "speaker-notes" : `block-${fence[1]}`;
        html += `<div class="${cls}">${render(buf.join("\n"), ctx)}</div>`;
        continue;
      }
      const h = line.match(/^(#{1,4})\s+(.*)$/);
      if (h) { html += `<h${h[1].length}>${inline(h[2], ctx)}</h${h[1].length}>`; i++; continue; }
      if (/^(-{3,}|\*{3,})\s*$/.test(line)) { html += "<hr>"; i++; continue; }

      if (t.startsWith("|") && lines[i + 1] && /^\s*\|?\s*:?-{3,}/.test(lines[i + 1])) {
        const buf = [];
        while (i < lines.length && lines[i].trim().startsWith("|")) buf.push(lines[i++]);
        html += renderTable(buf, ctx);
        continue;
      }
      if (line.startsWith(">")) {
        const buf = [];
        while (i < lines.length && lines[i].startsWith(">")) buf.push(lines[i++].replace(/^>\s?/, ""));
        const c = buf[0].match(/^\[!(\w+)\]\s*(.*)$/);
        if (c) {
          const type = c[1].toLowerCase();
          const title = c[2] || CALLOUT_LABEL[type] || type;
          html += `<div class="callout callout-${type}"><div class="callout-title">${inline(title, ctx)}</div>${render(buf.slice(1).join("\n"), ctx)}</div>`;
        } else {
          html += `<blockquote>${render(buf.join("\n"), ctx)}</blockquote>`;
        }
        continue;
      }
      if (/^\s*([-*]|\d+\.)\s+/.test(line)) {
        const buf = [];
        while (i < lines.length && /^\s*([-*]|\d+\.)\s+/.test(lines[i])) buf.push(lines[i++]);
        html += renderList(buf, ctx);
        continue;
      }
      const buf = [];
      while (i < lines.length && lines[i].trim() && !BLOCK_START.test(lines[i])) buf.push(lines[i++]);
      if (!buf.length) buf.push(lines[i++]);
      html += `<p>${inline(buf.join(" "), ctx)}</p>`;
    }
    return html;
  }

  // 把 .math 元素交給 KaTeX 渲染（沒有載入 KaTeX 時保留原始 TeX）
  function typeset(root) {
    if (!global.katex) return;
    root.querySelectorAll(".math").forEach((el) => {
      if (el.dataset.done) return;
      const tex = el.textContent;
      try {
        global.katex.render(tex, el, { displayMode: el.dataset.display === "1", throwOnError: false, strict: "ignore" });
      } catch (e) { el.classList.add("math-error"); el.title = e.message; }
      el.dataset.done = "1";
    });
  }

  global.MD = { render, inline, parseFrontmatter, typeset, esc };
})(window);

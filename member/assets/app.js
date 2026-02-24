/* app.js
 * Các chức năng JS dùng chung:
 * - Dark mode + đổi palette (lưu localStorage)
 * - Back-to-top
 * - Toast notifications
 * - Scroll reveal animation
 * - Trang danh sách: search/sort/grid-list
 * - Trang cá nhân: progress đọc, scrollspy, lightbox ảnh, copy nhanh liên hệ
 */
(() => {
  const $ = (sel, el = document) => el.querySelector(sel);
  const $$ = (sel, el = document) => Array.from(el.querySelectorAll(sel));

  const STORAGE = {
    palette: "site:palette",
    mode: "site:mode"
  };

  const state = {
    paletteName: null,
    mode: null
  };

  function safeGet(key, fallback) { /* Đọc localStorage an toàn */
    try { return localStorage.getItem(key) ?? fallback; } catch { return fallback; }
  }
  function safeSet(key, val) { /* Ghi localStorage an toàn */
    try { localStorage.setItem(key, val); } catch {}
  }

  function getConfig() { /* Hàm getConfig */
    return window.BRAND_CONFIG || { defaultPalette: "corporate", palettes: {} };
  }

  function applyVars(vars) { /* Hàm applyVars */
    const r = document.documentElement;
    Object.entries(vars).forEach(([k, v]) => r.style.setProperty(`--${k}`, v));
  }

  function applyTheme(paletteName, mode) { /* Áp bảng màu + dark/light vào CSS variables */
    const cfg = getConfig();
    const palette = (cfg.palettes && cfg.palettes[paletteName]) ? cfg.palettes[paletteName] : cfg.palettes[cfg.defaultPalette];
    const m = mode === "dark" ? "dark" : "light";
    const vars = palette?.[m] || palette?.light || {};
    applyVars(vars);
    document.documentElement.dataset.mode = m;
    state.paletteName = paletteName;
    state.mode = m;
  }

  function getInitialMode() { /* Hàm getInitialMode */
    const saved = safeGet(STORAGE.mode, "");
    if (saved === "light" || saved === "dark") return saved;
    return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }

  function initTheme() { /* Khởi tạo theme khi tải trang */
    const cfg = getConfig();
    const palette = safeGet(STORAGE.palette, cfg.defaultPalette || "corporate");
    const mode = getInitialMode();
    applyTheme(palette, mode);
  }

  // Toast
  let toastWrap = null;
  function ensureToastWrap() { /* Hàm ensureToastWrap */
    if (toastWrap) return toastWrap;
    toastWrap = document.createElement("div");
    toastWrap.className = "toastWrap";
    document.body.appendChild(toastWrap);
    return toastWrap;
  }
  function toast(msg, type = "info", ms = 2200) { /* Hiện thông báo nhỏ (toast) */
    ensureToastWrap();
    const el = document.createElement("div");
    el.className = `toast toast--${type}`;
    el.textContent = msg;
    toastWrap.appendChild(el);
    requestAnimationFrame(() => el.classList.add("in"));
    window.setTimeout(() => {
      el.classList.remove("in");
      window.setTimeout(() => el.remove(), 220);
    }, ms);
  }

  // Back to top
  function initBackToTop() { /* Nút cuộn lên đầu trang */
    const btn = document.createElement("button");
    btn.className = "backTop";
    btn.type = "button";
    btn.title = "Lên đầu trang";
    btn.innerHTML = "↑";
    btn.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
    document.body.appendChild(btn);

    const onScroll = () => {
      const show = window.scrollY > 320;
      btn.classList.toggle("show", show);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  // Floating tools
  function initFloatingTools() { /* Hàm initFloatingTools */
    const cfg = getConfig();
    const paletteNames = Object.keys(cfg.palettes || {});
    if (!paletteNames.length) return;

    const wrap = document.createElement("div");
    wrap.className = "tools";

    const modeBtn = document.createElement("button");
    modeBtn.className = "toolBtn";
    modeBtn.type = "button";
    modeBtn.title = "Đổi sáng/tối (phím D)";
    modeBtn.innerHTML = "☾";
    modeBtn.addEventListener("click", () => {
      const next = state.mode === "dark" ? "light" : "dark";
      safeSet(STORAGE.mode, next);
      applyTheme(state.paletteName, next);
      toast(next === "dark" ? "Đã bật dark mode" : "Đã tắt dark mode", "info");
    });

    const palBtn = document.createElement("button");
    palBtn.className = "toolBtn";
    palBtn.type = "button";
    palBtn.title = "Đổi màu giao diện";
    palBtn.innerHTML = "🎨";
    palBtn.addEventListener("click", () => {
      const idx = Math.max(0, paletteNames.indexOf(state.paletteName));
      const nextName = paletteNames[(idx + 1) % paletteNames.length];
      safeSet(STORAGE.palette, nextName);
      applyTheme(nextName, state.mode);
      const label = cfg.palettes[nextName]?.label || nextName;
      toast(`Đổi màu: ${label}`, "info");
    });

    const helpBtn = document.createElement("button");
    helpBtn.className = "toolBtn";
    helpBtn.type = "button";
    helpBtn.title = "Phím tắt";
    helpBtn.innerHTML = "?";
    helpBtn.addEventListener("click", () => {
      toast("Phím tắt: D (dark), / (tìm), Esc (thoát tìm)", "info", 3200);
    });

    wrap.append(modeBtn, palBtn, helpBtn);
    document.body.appendChild(wrap);

    // keyboard
    window.addEventListener("keydown", (e) => {
      if (e.key.toLowerCase() === "d" && !isTyping()) {
        e.preventDefault();
        modeBtn.click();
      }
      if (e.key === "/" && !isTyping()) {
        const inp = $("#memberSearch");
        if (inp) { e.preventDefault(); inp.focus(); inp.select(); }
      }
      if (e.key === "Escape") {
        const inp = $("#memberSearch");
        if (inp && document.activeElement === inp) { inp.blur(); }
      }
    });
  }

  function isTyping() { /* Hàm isTyping */
    const a = document.activeElement;
    if (!a) return false;
    const tag = (a.tagName || "").toLowerCase();
    return tag === "input" || tag === "textarea" || a.isContentEditable;
  }

  // Scroll reveal
  function initReveal() { /* Hiệu ứng hiện dần khi cuộn */
    const targets = $$(".reveal");
    if (!targets.length) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) {
          en.target.classList.add("in");
          io.unobserve(en.target);
        }
      });
    }, { threshold: 0.12 });
    targets.forEach(t => io.observe(t));
  }

  // Members page: search/sort/view
  function initMembersPage() { /* Hàm initMembersPage */
    const list = $("[data-member-list]");
    if (!list) return;

    const items = $$("[data-member-item]", list);

    const search = $("#memberSearch");
    const count = $("#memberCount");
    const sortBtn = $("#sortBtn");
    const viewBtn = $("#viewBtn");

    function renderCount(n) { /* Hàm renderCount */
      if (!count) return;
      count.textContent = `${n}/${items.length} thành viên`;
    }

    function filter() { /* Hàm filter */
      const q = (search?.value || "").trim().toLowerCase();
      let shown = 0;
      items.forEach((it) => {
        const name = (it.getAttribute("data-name") || it.textContent || "").toLowerCase();
        const ok = !q || name.includes(q);
        it.style.display = ok ? "" : "none";
        if (ok) shown++;
      });
      renderCount(shown);
    }

    function sortAZ() { /* Hàm sortAZ */
      const visible = items.slice().sort((a, b) => {
        const na = (a.getAttribute("data-name") || "").toLowerCase();
        const nb = (b.getAttribute("data-name") || "").toLowerCase();
        return na.localeCompare(nb, "vi");
      });
      visible.forEach(n => list.appendChild(n));
      toast("Đã sắp xếp A → Z", "info");
    }

    function toggleView() { /* Hàm toggleView */
      const isGrid = list.classList.toggle("listView");
      viewBtn.textContent = isGrid ? "Grid" : "List";
      toast(isGrid ? "Chế độ danh sách" : "Chế độ lưới", "info");
    }

    search?.addEventListener("input", filter);
    sortBtn?.addEventListener("click", sortAZ);
    viewBtn?.addEventListener("click", toggleView);

    // init
    filter();
  }

  // Personal page: progress + scrollspy + lightbox + copy contact
  function initPersonalPage() { /* Tính năng trang cá nhân (scrollspy/progress/lightbox) */
    const menu = $(".menu");
    const sections = $$(".section[id]");
    if (!menu || !sections.length) return;

    // progress bar
    const bar = document.createElement("div");
    bar.className = "readProgress";
    bar.innerHTML = `<div class="readProgress__bar"></div>`;
    document.body.appendChild(bar);
    const barInner = $(".readProgress__bar", bar);

    function updateProgress() { /* Hàm updateProgress */
      const doc = document.documentElement;
      const max = (doc.scrollHeight - window.innerHeight) || 1;
      const p = Math.min(1, Math.max(0, window.scrollY / max));
      barInner.style.transform = `scaleX(${p})`;
    }

    // scrollspy
    const links = $$("a[href^='#']", menu).filter(a => a.getAttribute("href") !== "#");
    const byId = new Map(links.map(a => [a.getAttribute("href").slice(1), a]));
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) {
          links.forEach(a => a.classList.remove("active"));
          const a = byId.get(en.target.id);
          if (a) a.classList.add("active");
        }
      });
    }, { rootMargin: "-25% 0px -60% 0px", threshold: 0.01 });
    sections.forEach(s => io.observe(s));

    window.addEventListener("scroll", updateProgress, { passive: true });
    updateProgress();

    // lightbox
    const imgs = $$("img", document).filter(img => !img.closest(".tools") && img.naturalWidth !== 0);
    imgs.forEach(img => {
      img.style.cursor = "zoom-in";
      img.addEventListener("click", () => openLightbox(img.src, img.alt || "Ảnh"));
    });

    // copy contact
    $$("a[href^='tel:'],a[href^='mailto:'],a[href*='facebook'],a[href*='zalo'],a[href*='instagram']", document)
      .forEach(a => {
        a.addEventListener("dblclick", (e) => {
          e.preventDefault();
          const val = a.getAttribute("href");
          copyText(val);
          toast("Đã copy liên hệ", "good");
        });
      });
  }

  function openLightbox(src, alt) { /* Hàm openLightbox */
    let overlay = $("#lightbox");
    if (!overlay) {
      overlay = document.createElement("div");
      overlay.id = "lightbox";
      overlay.className = "lightbox";
      overlay.innerHTML = `
        <div class="lightbox__inner" role="dialog" aria-modal="true">
          <button class="lightbox__close" type="button" aria-label="Đóng">×</button>
          <img class="lightbox__img" alt="">
          <div class="lightbox__cap"></div>
        </div>`;
      document.body.appendChild(overlay);
      overlay.addEventListener("click", (e) => {
        if (e.target === overlay) closeLightbox();
      });
      $(".lightbox__close", overlay).addEventListener("click", closeLightbox);
      window.addEventListener("keydown", (e) => {
        if (e.key === "Escape") closeLightbox();
      });
    }
    $(".lightbox__img", overlay).src = src;
    $(".lightbox__img", overlay).alt = alt || "";
    $(".lightbox__cap", overlay).textContent = alt || "";
    overlay.classList.add("show");
    document.body.classList.add("noScroll");
  }

  function closeLightbox() { /* Hàm closeLightbox */
    const overlay = $("#lightbox");
    if (!overlay) return;
    overlay.classList.remove("show");
    document.body.classList.remove("noScroll");
  }

  async function copyText(txt) {
    try {
      await navigator.clipboard.writeText(txt);
      return true;
    } catch {
      // fallback
      const ta = document.createElement("textarea");
      ta.value = txt;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand("copy"); } catch {}
      ta.remove();
      return false;
    }
  }

  function init() { /* Hàm init */
    initTheme();
    initFloatingTools();
    initBackToTop();
    initReveal();
    initMembersPage();
    initPersonalPage();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
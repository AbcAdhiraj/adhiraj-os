/* storage that never throws (private mode, embedded previews, etc.) */
window.SAFE = (function () {
  const mem = {};
  const wrap = (area) => ({
    get(k) { try { return window[area].getItem(k); } catch (e) { return mem[area + k] ?? null; } },
    set(k, v) { try { window[area].setItem(k, v); } catch (e) { mem[area + k] = String(v); } },
    del(k) { try { window[area].removeItem(k); } catch (e) { delete mem[area + k]; } },
  });
  const s = wrap("sessionStorage"), l = wrap("localStorage");
  return { sget: s.get, sset: s.set, sdel: s.del, lget: l.get, lset: l.set };
})();

/* The "operating system": windows, dock, menu bar, overlays, settings */
(function () {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const h = (html) => { const t = document.createElement("template"); t.innerHTML = html.trim(); return t.content.firstElementChild; };
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const isMobile = () => window.innerWidth <= 760;

  const WALLPAPERS = [
    { id: "hills", name: "Hills", url: "wallpaper-hills.svg" },
    { id: "dusk", name: "Dusk", url: "wallpaper-dusk.svg" },
    { id: "midnight", name: "Midnight", url: "wallpaper-midnight.svg" },
    { id: "pastel", name: "Pastel", url: "wallpaper-pastel.svg" },
  ];
  const ACCENTS = ["#0a84ff", "#a550a7", "#f74f9e", "#ff5257", "#f7821b", "#ffc600", "#62ba46", "#8c8c8c"];

  /* ---------- persisted settings ---------- */
  const defaults = { theme: "light", wallpaper: "hills", accent: "#0a84ff", wifi: true, bluetooth: true, magnify: true, dockSize: 58, brightness: 100, volume: 0.8 };
  let S = Object.assign({}, defaults);
  try { Object.assign(S, JSON.parse(SAFE.lget("mac-settings") || "{}")); } catch (e) {}
  const save = () => SAFE.lset("mac-settings", JSON.stringify(S));

  function applySettings() {
    const dark = S.theme === "dark" || (S.theme === "auto" && matchMedia("(prefers-color-scheme: dark)").matches);
    document.body.classList.toggle("dark", dark);
    const wp = WALLPAPERS.find((w) => w.id === S.wallpaper) || WALLPAPERS[0];
    $("#desktop").style.backgroundImage = `url(${wp.url})`;
    $("#lock").style.backgroundImage = `url(${wp.url})`;
    document.documentElement.style.setProperty("--accent", S.accent);
    document.documentElement.style.setProperty("--dock-size", isMobile() ? Math.min(46, Math.floor((window.innerWidth - 40) / 10.2)) + "px" : S.dockSize + "px");
    $("#desktop").style.filter = S.brightness < 100 ? `brightness(${S.brightness / 100})` : "";
    renderMenubarRight();
  }
  function set(k, v) { S[k] = v; save(); applySettings(); OS.emit("settings"); }

  /* ---------- tiny event bus ---------- */
  const listeners = {};
  const OS = {
    S, set, WALLPAPERS, ACCENTS, h, esc, $, $$, isMobile,
    on(ev, fn) { (listeners[ev] = listeners[ev] || []).push(fn); },
    emit(ev, d) { (listeners[ev] || []).forEach((fn) => fn(d)); },
    apps: {},
    wins: {},
    z: 100,
    focused: null,
  };
  window.OS = OS;

  /* ---------- toasts ---------- */
  OS.toast = function (title, msg, icon = "finder") {
    const t = h(`<div class="toast"><div class="ti">${ICONS[icon] || ""}</div><div><b>${esc(title)}</b><small>${esc(msg)}</small></div></div>`);
    $("#toast").appendChild(t);
    setTimeout(() => { t.style.transition = "opacity .3s"; t.style.opacity = 0; setTimeout(() => t.remove(), 300); }, 3200);
  };

  /* ---------- windows ---------- */
  function desktopRect() {
    const top = parseInt(getComputedStyle(document.documentElement).getPropertyValue("--menubar-h")) || 30;
    return { top, left: 0, width: window.innerWidth, height: window.innerHeight - top - (isMobile() ? 70 : 0) };
  }

  let cascade = 0;
  OS.open = function (id, arg) {
    const app = OS.apps[id];
    if (!app) return;
    let w = OS.wins[id];
    if (w) {
      w.el.classList.remove("minimized");
      OS.focus(id);
      if (arg !== undefined && app.route) app.route(w, arg);
      return w;
    }
    const el = h(`<div class="window app-${id}">
      <div class="traffic">
        <button class="tl close" title="Close"><svg viewBox="0 0 8 8"><path d="M1.5 1.5l5 5M6.5 1.5l-5 5" stroke="currentColor" stroke-width="1.2"/></svg></button>
        <button class="tl min" title="Minimize"><svg viewBox="0 0 8 8"><path d="M1 4h6" stroke="currentColor" stroke-width="1.2"/></svg></button>
        <button class="tl max" title="Zoom"><svg viewBox="0 0 8 8"><path d="M1.5 4.5V1.5h3M6.5 3.5v3h-3" stroke="currentColor" stroke-width="1.2" fill="none"/></svg></button>
      </div>
      <div class="win-body"></div><div class="resize"></div></div>`);
    const d = desktopRect();
    const ww = Math.min(app.w || 900, d.width - 40), wh = Math.min(app.h || 560, d.height - (isMobile() ? 0 : 100));
    let x = Math.max(10, (d.width - ww) / 2 + cascade * 26), y = Math.max(d.top + 10, d.top + (d.height - 90 - wh) / 2 + cascade * 22);
    cascade = (cascade + 1) % 5;
    Object.assign(el.style, { left: x + "px", top: y + "px", width: ww + "px", height: wh + "px" });
    $("#windows").appendChild(el);
    w = { id, el, body: $(".win-body", el), app, state: {} };
    OS.wins[id] = w;
    if (isMobile()) maximize(w, true);
    wireWindow(w);
    app.mount(w, arg);
    OS.focus(id);
    const di = $(`.dock-item[data-app="${id}"]`);
    if (di) { di.classList.add("bounce"); setTimeout(() => di.classList.remove("bounce"), 700); }
    updateDock();
    return w;
  };

  OS.close = function (id) {
    const w = OS.wins[id];
    if (!w) return;
    w.el.classList.add("closing");
    if (w.app.unmount) w.app.unmount(w);
    delete OS.wins[id];
    setTimeout(() => w.el.remove(), 180);
    if (OS.focused === id) { OS.focused = null; const top = topWindow(); if (top) OS.focus(top); else renderMenubarLeft(); }
    updateDock();
    if (location.hash.startsWith("#" + id)) history.replaceState(null, "", location.pathname);
  };

  OS.minimize = function (id) {
    const w = OS.wins[id];
    if (!w) return;
    w.el.classList.add("minimized");
    w.el.classList.remove("focused");
    const top = topWindow(id);
    OS.focused = null;
    if (top) OS.focus(top); else renderMenubarLeft();
  };

  function topWindow(except) {
    return Object.values(OS.wins).filter((w) => w.id !== except && !w.el.classList.contains("minimized"))
      .sort((a, b) => b.el.style.zIndex - a.el.style.zIndex)[0]?.id;
  }

  OS.focus = function (id) {
    const w = OS.wins[id];
    if (!w) return;
    Object.values(OS.wins).forEach((o) => o.el.classList.toggle("focused", o.id === id));
    w.el.style.zIndex = ++OS.z;
    OS.focused = id;
    renderMenubarLeft();
  };

  function maximize(w, force) {
    const d = desktopRect();
    if (w.el.classList.contains("maximized") && !force) {
      const r = w.prev; w.el.classList.remove("maximized");
      Object.assign(w.el.style, r);
    } else {
      w.prev = { left: w.el.style.left, top: w.el.style.top, width: w.el.style.width, height: w.el.style.height };
      w.el.classList.add("maximized");
      const bottom = isMobile() ? 70 : 0;
      Object.assign(w.el.style, { left: "0px", top: d.top + "px", width: d.width + "px", height: window.innerHeight - d.top - bottom + "px" });
    }
    OS.emit("resize", w.id);
  }
  OS.maximize = (id) => OS.wins[id] && maximize(OS.wins[id]);

  function wireWindow(w) {
    const el = w.el;
    $(".tl.close", el).onclick = (e) => { e.stopPropagation(); OS.close(w.id); };
    $(".tl.min", el).onclick = (e) => { e.stopPropagation(); OS.minimize(w.id); };
    $(".tl.max", el).onclick = (e) => { e.stopPropagation(); if (!isMobile()) maximize(w); };
    el.addEventListener("pointerdown", () => { if (OS.focused !== w.id) OS.focus(w.id); }, true);

    // drag from the top 48px of a window (unless on an interactive element)
    el.addEventListener("pointerdown", (e) => {
      if (isMobile() || e.button !== 0) return;
      const r = el.getBoundingClientRect();
      if (e.clientY - r.top > 48) return;
      if (e.target.closest("button, input, textarea, a, select, .no-drag, .resize")) return;
      e.preventDefault();
      if (el.classList.contains("maximized")) return;
      const sx = e.clientX, sy = e.clientY, ox = r.left, oy = r.top;
      el.classList.add("dragging");
      const top = desktopRect().top;
      const mv = (ev) => {
        el.style.left = ox + ev.clientX - sx + "px";
        el.style.top = Math.max(top, oy + ev.clientY - sy) + "px";
      };
      const up = () => { el.classList.remove("dragging"); removeEventListener("pointermove", mv); removeEventListener("pointerup", up); };
      addEventListener("pointermove", mv); addEventListener("pointerup", up);
    });
    el.addEventListener("dblclick", (e) => {
      const r = el.getBoundingClientRect();
      if (e.clientY - r.top <= 48 && !e.target.closest("button, input, a, .no-drag")) maximize(w);
    });

    $(".resize", el).addEventListener("pointerdown", (e) => {
      e.preventDefault(); e.stopPropagation();
      const sx = e.clientX, sy = e.clientY, ow = el.offsetWidth, oh = el.offsetHeight;
      el.classList.add("resizing");
      const mv = (ev) => {
        el.style.width = Math.max(w.app.minW || 480, ow + ev.clientX - sx) + "px";
        el.style.height = Math.max(w.app.minH || 320, oh + ev.clientY - sy) + "px";
      };
      const up = () => { el.classList.remove("resizing"); removeEventListener("pointermove", mv); removeEventListener("pointerup", up); OS.emit("resize", w.id); };
      addEventListener("pointermove", mv); addEventListener("pointerup", up);
    });
  }

  /* ---------- dock ---------- */
  OS.dockOrder = ["finder", "notes", "music", "tv", "safari", "mail", "terminal", "settings"];
  function buildDock() {
    const dock = $("#dock");
    dock.innerHTML = "";
    OS.dockOrder.forEach((id) => {
      const app = OS.apps[id];
      const it = h(`<button class="dock-item" data-app="${id}" aria-label="Open ${esc(app.title)}"><span class="tip">${esc(app.title)}</span><span class="ic">${ICONS[app.icon || id]}</span><span class="run"></span></button>`);
      it.onclick = () => {
        const w = OS.wins[id];
        if (w && OS.focused === id && !w.el.classList.contains("minimized") && !isMobile()) OS.minimize(id);
        else OS.open(id);
      };
      dock.appendChild(it);
    });
    dock.appendChild(h(`<span class="dock-sep"></span>`));
    const tr = h(`<button class="dock-item" data-app="trash" aria-label="Open Trash"><span class="tip">Trash</span><span class="ic">${ICONS.trash}</span><span class="run"></span></button>`);
    tr.onclick = () => OS.open("finder", "trash");
    dock.appendChild(tr);

    // magnification
    dock.addEventListener("mousemove", (e) => {
      if (!S.magnify || isMobile()) return;
      $$(".dock-item", dock).forEach((it) => {
        const r = it.getBoundingClientRect();
        const d = Math.abs(e.clientX - (r.left + r.width / 2));
        const s = 1 + 0.55 * Math.max(0, 1 - d / 140);
        it.style.width = it.style.height = S.dockSize * s + "px";
      });
    });
    dock.addEventListener("mouseleave", () => $$(".dock-item", dock).forEach((it) => (it.style.width = it.style.height = "")));
  }
  function updateDock() {
    $$(".dock-item").forEach((it) => {
      const id = it.dataset.app;
      it.classList.toggle("running", !!OS.wins[id] || (id === "music" && OS.music && OS.music.active()));
    });
  }
  OS.updateDock = updateDock;

  /* ---------- menu bar ---------- */
  let openMenu = null;
  function closeMenu() { if (openMenu) { openMenu.el.remove(); openMenu.anchor.classList.remove("open"); openMenu = null; } }
  OS.closeMenu = closeMenu;
  function showMenu(anchor, items, cls = "") {
    const same = openMenu && openMenu.anchor === anchor;
    closeMenu();
    if (same) return;
    const el = h(`<div class="menu ${cls}"></div>`);
    if (typeof items === "function") items(el);
    else items.forEach((it) => {
      if (it === "-") return el.appendChild(h(`<div class="sep"></div>`));
      const mi = h(`<div class="mi ${it.disabled ? "disabled" : ""}"><span>${esc(it.label)}</span><span class="k">${esc(it.key || "")}</span></div>`);
      if (!it.disabled) mi.onclick = () => { closeMenu(); it.action(); };
      el.appendChild(mi);
    });
    document.body.appendChild(el);
    const r = anchor.getBoundingClientRect();
    let left = r.left;
    if (left + el.offsetWidth > innerWidth - 6) left = innerWidth - el.offsetWidth - 6;
    Object.assign(el.style, { left: Math.max(6, left) + "px", top: r.bottom + 4 + "px" });
    anchor.classList.add("open");
    openMenu = { el, anchor };
  }
  OS.showMenu = showMenu;
  document.addEventListener("pointerdown", (e) => {
    if (openMenu && !openMenu.el.contains(e.target) && !openMenu.anchor.contains(e.target)) closeMenu();
  });

  function appMenus() {
    const id = OS.focused;
    const app = id ? OS.apps[id] : OS.apps.finder;
    const name = id ? app.title : "Finder";
    return {
      name,
      menus: {
        [name]: [
          { label: `About ${name}`, action: () => OS.toast(name, app.about || "part of adhiraj's mac", app.icon || id || "finder") },
          "-",
          { label: `Quit ${name}`, key: "⌘Q", disabled: !id, action: () => { if (id === "music") OS.music.stop(); OS.close(id); } },
        ],
        File: [
          { label: "New Finder Window", key: "⌘N", action: () => OS.open("finder") },
          { label: "Open Notes", action: () => OS.open("notes") },
          "-",
          { label: "Close Window", key: "⌘W", disabled: !id, action: () => OS.close(id) },
        ],
        Edit: [
          { label: "Copy Email Address", action: () => { navigator.clipboard?.writeText(PROFILE.email); OS.toast("Copied", PROFILE.email, "mail"); } },
          { label: "Copy Link to This Page", action: () => { navigator.clipboard?.writeText(location.href); OS.toast("Copied", "link copied to clipboard", "safari"); } },
        ],
        View: [
          { label: S.theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode", action: () => set("theme", document.body.classList.contains("dark") ? "light" : "dark") },
          { label: "Enter Full Screen", disabled: !id, action: () => OS.maximize(id) },
          { label: "Spotlight Search", key: "⌘K", action: () => OS.spotlight() },
        ],
        Window: [
          { label: "Minimize", key: "⌘M", disabled: !id, action: () => OS.minimize(id) },
          { label: "Zoom", disabled: !id, action: () => OS.maximize(id) },
          "-",
          ...Object.values(OS.wins).map((w) => ({ label: w.app.title, action: () => OS.open(w.id) })),
          ...(Object.keys(OS.wins).length ? ["-"] : []),
          { label: "Close All Windows", disabled: !Object.keys(OS.wins).length, action: () => Object.keys(OS.wins).forEach(OS.close) },
        ],
        Help: [
          { label: "How does this work?", action: () => OS.open("notes", "about-me") },
          { label: "Contact Adhiraj", action: () => OS.open("mail", "compose") },
          { label: "View Source on GitHub", action: () => window.open(SITE_REPO, "_blank") },
        ],
      },
    };
  }

  function renderMenubarLeft() {
    const left = $("#mb-left-menus");
    const { name, menus } = appMenus();
    left.innerHTML = "";
    Object.keys(menus).forEach((m, i) => {
      const b = h(`<button class="mb-item ${i === 0 ? "app-name" : "hide-m"}">${esc(m)}</button>`);
      b.onclick = () => showMenu(b, appMenus().menus[i === 0 ? appMenus().name : m]);
      b.onmouseenter = () => { if (openMenu && openMenu.anchor !== b && openMenu.anchor.closest("#mb-left-menus, #mb-apple")) showMenu(b, appMenus().menus[i === 0 ? appMenus().name : m]); };
      left.appendChild(b);
    });
  }

  function appleMenu() {
    return [
      { label: "About This Mac", action: () => OS.open("settings", "about") },
      "-",
      { label: "System Settings…", action: () => OS.open("settings") },
      "-",
      { label: "Sleep", action: sleep },
      { label: "Restart…", action: () => { SAFE.sdel("booted"); location.hash = ""; location.reload(); } },
      { label: "Shut Down…", action: shutdown },
      "-",
      { label: "Lock Screen", key: "⌃⌘Q", action: lock },
    ];
  }

  function renderMenubarRight() {
    const wifi = $("#mb-wifi");
    if (!wifi) return;
    wifi.innerHTML = S.wifi ? GLYPH.wifi : GLYPH.wifiOff;
  }

  function controlCenter(el) {
    el.classList.add("cc");
    const m = OS.music;
    const cur = m && m.current();
    el.innerHTML = `
      <div class="tile">
        <div class="row"><button class="dot ${S.wifi ? "on" : ""}" data-k="wifi">${GLYPH.wifi}</button><div><b>Wi-Fi</b><small>${S.wifi ? "Bengaluru_5G" : "Off"}</small></div></div>
        <div class="row"><button class="dot ${S.bluetooth ? "on" : ""}" data-k="bluetooth">${GLYPH.bt}</button><div><b>Bluetooth</b><small>${S.bluetooth ? "On" : "Off"}</small></div></div>
        <div class="row"><button class="dot ${document.body.classList.contains("dark") ? "on" : ""}" data-k="theme">${GLYPH.moon}</button><div><b>Dark Mode</b><small>${document.body.classList.contains("dark") ? "On" : "Off"}</small></div></div>
      </div>
      <div class="tile"><label>Display</label><input type="range" min="40" max="100" value="${S.brightness}" data-r="brightness"></div>
      <div class="tile"><label>Sound</label><input type="range" min="0" max="100" value="${Math.round(S.volume * 100)}" data-r="volume"></div>
      <div class="tile np">${cur ? `<img src="${esc(cur.art)}" alt=""><div class="t"><b>${esc(cur.title)}</b><small>${esc(cur.artist)}</small></div>
        <button data-p="prev">${GLYPH.prev}</button><button data-p="toggle">${m.playing() ? GLYPH.pause : GLYPH.play}</button><button data-p="next">${GLYPH.next}</button>`
        : `<div class="t"><b>Not Playing</b><small>open Music to play something</small></div><button data-p="open">${GLYPH.play}</button>`}</div>`;
    $$("[data-k]", el).forEach((b) => (b.onclick = () => {
      const k = b.dataset.k;
      if (k === "theme") set("theme", document.body.classList.contains("dark") ? "light" : "dark");
      else set(k, !S[k]);
      closeMenu(); showMenu($("#mb-cc"), controlCenter);
    }));
    $$("[data-r]", el).forEach((r) => (r.oninput = () => {
      if (r.dataset.r === "volume") { set("volume", r.value / 100); OS.music && OS.music.setVolume(r.value / 100); }
      else set("brightness", +r.value);
    }));
    $$("[data-p]", el).forEach((b) => (b.onclick = () => {
      const p = b.dataset.p;
      if (p === "open") { closeMenu(); OS.open("music"); OS.music.play(0); return; }
      OS.music[p]();
      setTimeout(() => { closeMenu(); showMenu($("#mb-cc"), controlCenter); }, 60);
    }));
  }

  function buildMenubar() {
    const mb = $("#menubar");
    mb.innerHTML = `
      <div class="mb-left"><button class="mb-item" id="mb-apple" aria-label="Apple menu">${ICONS.apple}</button><div id="mb-left-menus" class="mb-left"></div></div>
      <div class="mb-right">
        <span class="mb-item hide-m">100% <span class="bat">${GLYPH.battery}</span></span>
        <button class="mb-item" id="mb-wifi" aria-label="Wi-Fi"></button>
        <button class="mb-item hide-m" id="mb-search" aria-label="Spotlight">${GLYPH.search}</button>
        <button class="mb-item" id="mb-cc" aria-label="Control Center">${GLYPH.control}</button>
        <button class="mb-item" id="mb-clock"></button>
      </div>`;
    $("#mb-apple").onclick = () => showMenu($("#mb-apple"), appleMenu());
    $("#mb-wifi").onclick = () => showMenu($("#mb-wifi"), [
      { label: `Wi-Fi: ${S.wifi ? "On" : "Off"}`, disabled: true },
      { label: S.wifi ? "Turn Wi-Fi Off" : "Turn Wi-Fi On", action: () => set("wifi", !S.wifi) },
      "-",
      ...(S.wifi ? [{ label: "✓ Bengaluru_5G", disabled: true }, { label: "chai_point_guest", action: () => OS.toast("Wi-Fi", "nice try. the chai point wifi needs an otp", "settings") }, "-"] : []),
      { label: "Wi-Fi Settings…", action: () => OS.open("settings", "wifi") },
    ]);
    $("#mb-cc").onclick = () => showMenu($("#mb-cc"), controlCenter);
    $("#mb-search").onclick = () => OS.spotlight();
    $("#mb-clock").onclick = () => showMenu($("#mb-clock"), [{ label: new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" }), disabled: true }, { label: "Open Calendar? (that's a different portfolio)", disabled: true }]);
    tick(); setInterval(tick, 1000 * 15);
    renderMenubarLeft();
  }
  function tick() {
    const d = new Date();
    const day = d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" }).replace(",", "");
    const t = d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
    $("#mb-clock").textContent = isMobile() ? t : `${day}  ${t}`;
    const lt = $("#lock .lt"); if (lt) { lt.textContent = d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }).replace(/ ?[AP]M/, ""); $("#lock .ld").textContent = d.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" }); }
  }

  /* ---------- overlays: boot, lock, sleep, shutdown ---------- */
  function boot() {
    if (SAFE.sget("booted")) { $("#boot").remove(); return Promise.resolve(); }
    return new Promise((res) => {
      requestAnimationFrame(() => ($("#boot .pb i").style.width = "100%"));
      setTimeout(() => { $("#boot").style.opacity = 0; SAFE.sset("booted", 1); setTimeout(() => { $("#boot").remove(); res(); }, 500); }, 1500);
    });
  }
  function lock() {
    const l = $("#lock"); l.hidden = false; tick();
    const un = () => { l.hidden = true; l.removeEventListener("click", un); removeEventListener("keydown", un); };
    setTimeout(() => { l.addEventListener("click", un); addEventListener("keydown", un); }, 300);
  }
  function sleep() {
    const s = $("#sleep"); s.hidden = false; requestAnimationFrame(() => s.classList.add("on"));
    OS.music && OS.music.playing() && OS.music.toggle();
    const wake = () => { s.classList.remove("on"); setTimeout(() => (s.hidden = true), 600); s.removeEventListener("click", wake); removeEventListener("keydown", wake); };
    setTimeout(() => { s.addEventListener("click", wake); addEventListener("keydown", wake); }, 400);
  }
  function shutdown() {
    Object.keys(OS.wins).forEach(OS.close);
    OS.music && OS.music.stop();
    const s = $("#sleep"); s.hidden = false; s.innerHTML = `<div style="position:absolute;inset:0;display:grid;place-items:center;color:#777;font-size:14px">it's off. click anywhere to turn it back on</div>`;
    requestAnimationFrame(() => s.classList.add("on"));
    setTimeout(() => s.addEventListener("click", () => { SAFE.sdel("booted"); location.hash = ""; location.reload(); }), 500);
  }
  OS.lock = lock;

  /* ---------- spotlight ---------- */
  OS.spotlight = function () {
    if ($("#spot-back")) return;
    const back = h(`<div id="spot-back"><div class="spot"><div class="si">${GLYPH.search}<input placeholder="Spotlight Search" autocomplete="off"></div><div class="res"></div></div></div>`);
    document.body.appendChild(back);
    const input = $("input", back), res = $(".res", back);
    let items = [], sel = 0;
    const all = () => [
      ...Object.entries(OS.apps).map(([id, a]) => ({ g: "Applications", t: a.title, icon: ICONS[a.icon || id], go: () => OS.open(id) })),
      ...NOTES.map((n) => ({ g: "Notes", t: n.title, sub: n.preview, icon: ICONS.notes, go: () => OS.open("notes", n.slug) })),
      ...PROJECTS.map((p) => ({ g: "Projects", t: p.name, sub: p.role, icon: ICONS.folder, go: () => OS.open("finder", "projects/" + p.id) })),
      ...SONGS.map((s, i) => ({ g: "Music", t: s.title, sub: s.artist, img: s.art, go: () => { OS.open("music"); OS.music.play(i); } })),
      ...SHOWS.map((s, i) => ({ g: "TV", t: s.title, sub: s.network, img: s.poster, go: () => OS.open("tv", i) })),
    ];
    const draw = () => {
      const q = input.value.trim().toLowerCase();
      items = q ? all().filter((x) => (x.t + " " + (x.sub || "") + " " + x.g).toLowerCase().includes(q)).slice(0, 14) : [];
      sel = 0;
      res.style.display = items.length ? "" : "none";
      let lastG = "";
      res.innerHTML = items.map((x, i) => {
        const gh = x.g !== lastG ? `<div class="grp">${x.g}</div>` : ""; lastG = x.g;
        return `${gh}<button class="r ${i === 0 ? "on" : ""}" data-i="${i}"><span class="ri">${x.img ? `<img src="${esc(x.img)}" alt="">` : x.icon}</span>${esc(x.t)}<small>${esc(x.sub || "")}</small></button>`;
      }).join("");
      $$(".r", res).forEach((b) => (b.onclick = () => go(+b.dataset.i)));
    };
    const go = (i) => { const it = items[i]; back.remove(); it && it.go(); };
    input.oninput = draw;
    input.onkeydown = (e) => {
      if (e.key === "Escape") back.remove();
      if (e.key === "Enter") go(sel);
      if (e.key === "ArrowDown" || e.key === "ArrowUp") {
        e.preventDefault();
        sel = Math.max(0, Math.min(items.length - 1, sel + (e.key === "ArrowDown" ? 1 : -1)));
        $$(".r", res).forEach((b, i) => b.classList.toggle("on", i === sel));
        $$(".r", res)[sel]?.scrollIntoView({ block: "nearest" });
      }
    };
    back.onclick = (e) => { if (e.target === back) back.remove(); };
    draw(); input.focus();
  };

  addEventListener("keydown", (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") { e.preventDefault(); OS.spotlight(); }
    if (e.key === "Escape") closeMenu();
  });

  /* ---------- routing: #notes/about-me, #music, #finder/projects/kissa ---------- */
  function route() {
    const hsh = decodeURIComponent(location.hash.slice(1));
    if (!hsh) return;
    const [id, ...rest] = hsh.split("/");
    if (OS.apps[id]) OS.open(id, rest.length ? rest.join("/") : undefined);
  }
  addEventListener("hashchange", route);
  OS.setHash = (s) => history.replaceState(null, "", "#" + s);

  addEventListener("resize", () => {
    applySettings();
    Object.values(OS.wins).forEach((w) => { if (isMobile() || w.el.classList.contains("maximized")) maximize(w, true); });
  });

  /* ---------- start ---------- */
  OS.start = async function () {
    applySettings();
    buildMenubar();
    buildDock();
    $("#lock .lu img").src = PROFILE.photo;
    $("#lock .lu b").textContent = PROFILE.name;
    applySettings();
    await boot();
    if (location.hash) route();
    else OS.open("notes", "about-me");
    if (!SAFE.sget("welcomed")) {
      SAFE.sset("welcomed", 1);
      setTimeout(() => OS.toast("welcome to adhiraj's mac", isMobile() ? "tap the dock to open apps" : "click around. everything works. ⌘K to search", "finder"), 700);
    }
  };
})();

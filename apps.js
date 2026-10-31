/* All the apps */
(function () {
  const { h, esc, $, $$, isMobile } = OS;
  const P = PROFILE;

  /* ---------- helpers ---------- */
  function md(src) {
    const inline = (s) => esc(s)
      .replace(/\*\*(.+?)\*\*/g, "<b>$1</b>")
      .replace(/\[(.+?)\]\((.+?)\)/g, (m, t, u) => u.startsWith("#") ? `<a href="${u}">${t}</a>` : `<a href="${u}" target="_blank" rel="noopener">${t}</a>`);
    let out = "", list = false;
    src.trim().split("\n").forEach((line) => {
      const l = line.trim();
      if (l.startsWith("- ")) { if (!list) { out += "<ul>"; list = true; } out += `<li>${inline(l.slice(2))}</li>`; return; }
      if (list) { out += "</ul>"; list = false; }
      if (!l) return;
      const im = l.match(/^!\[(.*?)\]\((.+?)\)$/);
      if (im) { out += `<figure class="note-photo"><img src="${esc(im[2])}" alt="${esc(im[1])}" loading="lazy"><figcaption>${esc(im[1])}</figcaption></figure>`; return; }
      if (l.startsWith("## ")) out += `<h2>${inline(l.slice(3))}</h2>`;
      else if (l.startsWith("# ")) out += `<h1>${inline(l.slice(2))}</h1>`;
      else out += `<p>${inline(l)}</p>`;
    });
    if (list) out += "</ul>";
    return out;
  }
  const fmtDate = (d) => { const x = new Date(d); return `${String(x.getDate()).padStart(2, "0")}/${String(x.getMonth() + 1).padStart(2, "0")}/${String(x.getFullYear()).slice(2)}`; };
  const longDate = (d) => new Date(d).toLocaleString("en-GB", { day: "numeric", month: "long", year: "numeric", hour: "numeric", minute: "2-digit", hour12: true });
  const readMin = (s) => Math.max(1, Math.round(s.split(/\s+/).length / 200));
  const mmss = (s) => { s = Math.max(0, Math.floor(s || 0)); return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`; };
  const thumb = (u, n = 200) => String(u || "").replace("600x600", n + "x" + n);
  const mtabs = (items, cur, cls = "") => `<div class="m-tabs ${cls}">${items.map(([k, l]) => `<button data-nav="${k}" class="${k === cur ? "on" : ""}">${esc(l)}</button>`).join("")}</div>`;
  const wireNav = (root, fn) => $$("[data-nav]", root).forEach((b) => (b.onclick = () => fn(b.dataset.nav)));
  // in-note hash links (#finder/projects/x) open apps without reload
  document.addEventListener("click", (e) => {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;
    e.preventDefault();
    const [id, ...rest] = a.getAttribute("href").slice(1).split("/");
    OS.open(id, rest.join("/") || undefined);
  });

  /* =====================================================================
     NOTES
     ===================================================================== */
  OS.apps.notes = {
    title: "Notes", w: 1060, h: 640, about: "my whole life, in lowercase",
    mount(w, slug) {
      w.state = { slug: slug || "about-me", q: "" };
      w.body.innerHTML = `
        <aside class="sidebar">
          <button class="sb-i">${GLYPH.person}<span>Shared</span><span class="count">0</span></button>
          <div class="sb-h">Category</div>
          <button class="sb-i active" data-f="all">${GLYPH.folder}<span>All iCloud</span><span class="count">${NOTES.length}</span></button>
          <button class="sb-i" data-f="notes">${GLYPH.folder}<span>Notes</span><span class="count">${NOTES.length}</span></button>
        </aside>
        <div class="notes-list">
          <div class="hd"><h3>All iCloud</h3><small>${NOTES.length} notes</small></div>
          <div style="padding:0 12px 6px"><div class="search">${GLYPH.search}<input placeholder="Search" class="nq"></div></div>
          <div class="scroll nl"></div>
        </div>
        <div class="note-view">
          <div class="toolbar"><button class="tb-btn m-back" title="Back">${GLYPH.back}</button><button class="tb-btn share" title="Copy link to this note">${GLYPH.share}</button></div>
          <div class="scroll"><article class="note-doc"></article></div>
        </div>`;
      $(".nq", w.body).oninput = (e) => { w.state.q = e.target.value.toLowerCase(); this.list(w); };
      $(".m-back", w.body).onclick = () => w.body.classList.remove("m-detail");
      $(".share", w.body).onclick = () => {
        const url = location.href.split("#")[0] + "#notes/" + w.state.slug;
        navigator.clipboard?.writeText(url);
        OS.toast("Link copied", "go spread the lore", "notes");
      };
      this.list(w); this.show(w);
      if (slug) w.body.classList.add("m-detail");
    },
    route(w, slug) { w.state.slug = slug; this.list(w); this.show(w); w.body.classList.add("m-detail"); },
    list(w) {
      const q = w.state.q;
      const items = NOTES.filter((n) => !q || (n.title + n.body).toLowerCase().includes(q));
      const pinned = items.filter((n) => n.pinned), rest = items.filter((n) => !n.pinned);
      const card = (n) => `<button class="note-card ${n.slug === w.state.slug ? "active" : ""}" data-s="${n.slug}"><b>${esc(n.title)}</b><div class="meta"><strong>${fmtDate(n.date)}</strong>${esc(n.preview)}</div></button>`;
      const month = (n) => new Date(n.date).toLocaleString("en-US", { month: "long" });
      let html = "";
      if (pinned.length) html += `<div class="grp">${GLYPH.pin}Pinned</div>` + pinned.map(card).join("");
      let lastM = "";
      rest.forEach((n) => { const m = month(n); if (m !== lastM) { html += `<div class="grp">${m}</div>`; lastM = m; } html += card(n); });
      $(".nl", w.body).innerHTML = html || `<div class="empty">no notes match "${esc(q)}"</div>`;
      $$(".note-card", w.body).forEach((b) => (b.onclick = () => { w.state.slug = b.dataset.s; this.list(w); this.show(w); w.body.classList.add("m-detail"); }));
    },
    show(w) {
      const n = NOTES.find((x) => x.slug === w.state.slug) || NOTES[0];
      $(".note-doc", w.body).innerHTML = `<div class="stamp">${longDate(n.date)} · ${readMin(n.body)} min read</div>` + md(n.body);
      $(".note-view .scroll", w.body).scrollTop = 0;
      OS.setHash("notes/" + n.slug);
    },
  };

  /* =====================================================================
     FINDER
     ===================================================================== */
  const fsRoot = () => ({
    recents: { name: "Recents", glyph: "clock", items: () => [...NOTES.slice(0, 3).map(noteFile), ...PROJECTS.slice(0, 3).map(projFolder)] },
    applications: { name: "Applications", glyph: "apps", items: () => Object.entries(OS.apps).map(([id, a]) => ({ name: a.title, kind: "Application", icon: ICONS[a.icon || id], mod: "Today", size: "--", open: () => OS.open(id) })) },
    desktop: { name: "Desktop", glyph: "desktop", items: () => [] , empty: "a clean desktop. rare footage. (everything is in downloads, obviously)" },
    documents: { name: "Documents", glyph: "docs", items: () => NOTES.map(noteFile) },
    downloads: { name: "Downloads", glyph: "download", items: () => (window.DOWNLOADS || []).map(jokeFile) },
    projects: { name: "Projects", glyph: "folder", items: () => PROJECTS.map(projFolder) },
    trash: { name: "Trash", glyph: "trash", items: () => (window.TRASH || []).map(jokeFile), empty: "trash is empty. character development." },
  });
  const jokeFile = (f) => ({
    name: f.name, kind: f.kind || "Document", size: f.size || "--", mod: f.mod || "--",
    icon: f.kind === "Folder" ? ICONS.folder : /web/i.test(f.kind || "") ? ICONS.link : ICONS.doc,
    open: (w) => (f.note ? OS.open("notes", f.note) : filePreview(w, f)),
  });
  function filePreview(w, f) {
    const ql = h(`<div class="ql-back"><div class="ql">
      <div class="ql-hd"><div class="badge" style="background:#8e8e93">${ICONS.doc}</div><div><h3 style="word-break:break-all">${esc(f.name)}</h3><small>${esc(f.kind || "")} · ${esc(f.size || "")} · ${esc(f.mod || "")}</small></div></div>
      <div class="ql-bd" style="white-space:pre-wrap">${esc(f.preview || "this file is too powerful to preview.")}</div>
      <div class="ql-ft"><button class="btn primary" data-a="x">Close</button></div>
    </div></div>`);
    (w ? w.body : document.body).appendChild(ql);
    const close = () => ql.remove();
    ql.onclick = (e) => { if (e.target === ql) close(); };
    $('[data-a="x"]', ql).onclick = close;
  }
  const noteFile = (n) => ({ name: n.slug + ".txt", kind: "Plain Text", icon: ICONS.doc, mod: fmtDate(n.date), size: (n.body.length / 1000).toFixed(1) + " KB", open: () => OS.open("notes", n.slug) });
  const projFolder = (p) => ({ name: p.name, kind: "Folder", icon: ICONS.folder, mod: p.modified, size: "--", open: (w) => quickLook(w, p), id: p.id });

  function quickLook(w, p) {
    const ql = h(`<div class="ql-back"><div class="ql">
      <div class="ql-hd"><div class="badge" style="background:${p.color}">${esc(p.name[0].toUpperCase())}</div><div><h3>${esc(p.name)}</h3><small>${esc(p.role)} · ${esc(p.dates)}</small></div></div>
      <div class="ql-bd"><p style="margin:0">${esc(p.summary)}</p><ul>${p.bullets.map((b) => `<li>${esc(b)}</li>`).join("")}</ul></div>
      <div class="ql-ft">${p.link ? `<a class="btn" href="${esc(p.link)}" target="_blank" rel="noopener">Visit ${GLYPH.ext}</a>` : ""}<button class="btn" data-a="note">Read the lore</button><button class="btn primary" data-a="x">Done</button></div>
    </div></div>`);
    w.body.appendChild(ql);
    const close = () => ql.remove();
    ql.onclick = (e) => { if (e.target === ql) close(); };
    $('[data-a="x"]', ql).onclick = close;
    $('[data-a="note"]', ql).onclick = () => { close(); OS.open("notes", "about-me"); };
    OS.setHash("finder/projects/" + p.id);
  }

  OS.apps.finder = {
    title: "Finder", w: 920, h: 540, about: "where the projects (and bad decisions) live",
    mount(w, arg) {
      w.state = { loc: "projects", hist: [], fwd: [], view: "list", sel: -1, q: "" };
      const root = fsRoot();
      const sb = (k) => `<button class="sb-i" data-loc="${k}">${GLYPH[root[k].glyph]}<span>${root[k].name}</span></button>`;
      w.body.innerHTML = `
        <aside class="sidebar">
          ${sb("recents")}
          <div class="sb-h">Favorites</div>${["applications", "desktop", "documents", "downloads", "projects"].map(sb).join("")}
          <div class="sb-h">Locations</div>
          <button class="sb-i alias" data-loc="projects">${GLYPH.cloud}<span>iCloud Drive</span></button>
          <button class="sb-i alias" data-loc="documents">${GLYPH.home}<span>${esc(P.handle)}</span></button>
          <button class="sb-i alias" data-loc="recents">${GLYPH.laptop}<span>${esc(P.first)}'s MacBook</span></button>
          ${sb("trash")}
        </aside>
        <div class="main">
          <div class="toolbar">
            <div class="seg"><button class="tb-btn bk">${GLYPH.back}</button><button class="tb-btn fw">${GLYPH.fwd}</button></div>
            <h2 class="ttl"></h2>
            <div class="seg"><button class="tb-btn vl" title="List">${GLYPH.list}</button><button class="tb-btn vg" title="Icons">${GLYPH.grid}</button></div>
            <div class="search" style="width:170px">${GLYPH.search}<input placeholder="Search" class="fq"></div>
          </div>
          ${mtabs([["recents", "Recents"], ["projects", "Projects"], ["documents", "Documents"], ["applications", "Apps"], ["downloads", "Downloads"], ["trash", "Trash"]], "", "ft")}
          <div class="scroll content"></div>
          <div class="pathbar"></div>
          <div class="statusbar"></div>
        </div>`;
      $$("[data-loc]", w.body).forEach((b) => (b.onclick = () => this.go(w, b.dataset.loc)));
      wireNav(w.body, (k) => this.go(w, k));
      $(".bk", w.body).onclick = () => { if (!w.state.hist.length) return; w.state.fwd.push(w.state.loc); w.state.loc = w.state.hist.pop(); this.draw(w); };
      $(".fw", w.body).onclick = () => { if (!w.state.fwd.length) return; w.state.hist.push(w.state.loc); w.state.loc = w.state.fwd.pop(); this.draw(w); };
      $(".vl", w.body).onclick = () => { w.state.view = "list"; this.draw(w); };
      $(".vg", w.body).onclick = () => { w.state.view = "grid"; this.draw(w); };
      $(".fq", w.body).oninput = (e) => { w.state.q = e.target.value.toLowerCase(); this.draw(w); };
      this.route(w, arg);
    },
    route(w, arg) {
      if (!arg) return this.draw(w);
      const [loc, item] = String(arg).split("/");
      if (fsRoot()[loc]) { if (loc !== w.state.loc) w.state.hist.push(w.state.loc); w.state.loc = loc; }
      this.draw(w);
      if (item) { const p = PROJECTS.find((x) => x.id === item); if (p) quickLook(w, p); }
    },
    go(w, loc) { if (loc === w.state.loc) return; w.state.hist.push(w.state.loc); w.state.fwd = []; w.state.loc = loc; w.state.q = ""; $(".fq", w.body).value = ""; this.draw(w); },
    draw(w) {
      const root = fsRoot(), loc = root[w.state.loc];
      const items = loc.items().filter((i) => !w.state.q || i.name.toLowerCase().includes(w.state.q));
      w.state.items = items; w.state.sel = -1;
      $(".ttl", w.body).textContent = loc.name;
      $$("[data-loc]", w.body).forEach((b) => b.classList.toggle("active", b.dataset.loc === w.state.loc && !b.classList.contains("alias")));
      $$(".ft [data-nav]", w.body).forEach((b) => b.classList.toggle("on", b.dataset.nav === w.state.loc));
      $(".bk", w.body).disabled = !w.state.hist.length; $(".fw", w.body).disabled = !w.state.fwd.length;
      $(".vl", w.body).classList.toggle("on", w.state.view === "list"); $(".vg", w.body).classList.toggle("on", w.state.view === "grid");
      const c = $(".content", w.body);
      if (!items.length) c.innerHTML = `<div class="empty">${esc(w.state.q ? "no results" : loc.empty || "empty")}</div>`;
      else if (w.state.view === "list") {
        c.innerHTML = `<table class="finder-table"><thead><tr><th>Name</th><th>Date Modified</th><th>Size</th><th>Kind</th></tr></thead><tbody>${items.map((it, i) =>
          `<tr class="row" data-i="${i}"><td class="name"><span class="fi">${it.icon}</span>${esc(it.name)}</td><td>${esc(it.mod)}</td><td>${esc(it.size)}</td><td>${esc(it.kind)}</td></tr>`).join("")}</tbody></table>`;
      } else {
        c.innerHTML = `<div class="finder-grid">${items.map((it, i) => `<button class="fg-item" data-i="${i}"><span class="fi">${it.icon}</span><span>${esc(it.name)}</span></button>`).join("")}</div>`;
      }
      $$("[data-i]", c).forEach((r) => {
        const i = +r.dataset.i;
        r.onclick = () => { $$("[data-i]", c).forEach((x) => x.classList.toggle("sel", x === r)); w.state.sel = i; if (isMobile()) items[i].open(w); };
        r.ondblclick = () => items[i].open(w);
      });
      $(".pathbar", w.body).innerHTML = `${GLYPH.laptop} Macintosh HD › ${esc(P.handle)} › ${esc(loc.name)}`;
      $(".statusbar", w.body).textContent = `${items.length} item${items.length === 1 ? "" : "s"}, double-click to open`;
      OS.setHash("finder/" + w.state.loc);
    },
  };

  /* =====================================================================
     MUSIC (global player keeps playing when the window closes)
     ===================================================================== */
  const audio = new Audio();
  audio.preload = "none";
  audio.volume = OS.S.volume;
  let cur = -1, shuffle = false, repeat = false;

  // fill in missing art/preview from the iTunes Search API (JSONP, no key needed)
  function itunes(term) {
    return new Promise((res) => {
      const cb = "it_" + Math.random().toString(36).slice(2);
      const s = document.createElement("script");
      window[cb] = (d) => { res(d.results && d.results[0]); delete window[cb]; s.remove(); };
      s.onerror = () => { res(null); s.remove(); };
      s.src = `https://itunes.apple.com/search?media=music&entity=song&limit=1&term=${encodeURIComponent(term)}&callback=${cb}`;
      document.head.appendChild(s);
    });
  }
  SONGS.forEach((s) => {
    if (s.art && s.preview) return;
    itunes(s.title + " " + s.artist).then((r) => {
      if (!r) return;
      s.art = s.art || r.artworkUrl100.replace("100x100", "600x600");
      s.preview = s.preview || r.previewUrl;
      s.album = s.album || r.collectionName;
      s.ms = s.ms || r.trackTimeMillis;
      OS.emit("music");
    });
  });

  OS.music = {
    current: () => SONGS[cur],
    index: () => cur,
    active: () => cur >= 0,
    playing: () => !audio.paused,
    play(i) {
      if (i === undefined) i = cur < 0 ? 0 : cur;
      const s = SONGS[i]; if (!s) return;
      if (i !== cur) { cur = i; audio.src = s.preview; }
      audio.play().catch(() => OS.toast("Music", "apple said no to this one. try another song", "music"));
      if ("mediaSession" in navigator) navigator.mediaSession.metadata = new MediaMetadata({ title: s.title, artist: s.artist, album: s.album, artwork: [{ src: s.art, sizes: "600x600" }] });
      OS.emit("music"); OS.updateDock();
    },
    toggle() { if (cur < 0) return this.play(0); audio.paused ? audio.play() : audio.pause(); OS.emit("music"); },
    next() { const n = shuffle ? Math.floor(Math.random() * SONGS.length) : (cur + 1) % SONGS.length; this.play(n); },
    prev() { if (audio.currentTime > 3) { audio.currentTime = 0; return; } this.play((cur - 1 + SONGS.length) % SONGS.length); },
    stop() { audio.pause(); audio.removeAttribute("src"); cur = -1; OS.emit("music"); OS.updateDock(); },
    setVolume(v) { audio.volume = v; OS.emit("music-vol"); },
  };
  audio.addEventListener("ended", () => (repeat ? OS.music.play(cur) : OS.music.next()));
  ["play", "pause"].forEach((ev) => audio.addEventListener(ev, () => OS.emit("music")));
  if ("mediaSession" in navigator) {
    navigator.mediaSession.setActionHandler("nexttrack", () => OS.music.next());
    navigator.mediaSession.setActionHandler("previoustrack", () => OS.music.prev());
  }

  OS.apps.music = {
    title: "Music", w: 1080, h: 680, minW: 600, about: "the soundtrack to my questionable decisions",
    mount(w, arg) {
      w.state = { tab: arg || "home" };
      w.body.innerHTML = `
        <aside class="sidebar">
          <button class="sb-i" data-tab="home">${GLYPH.home}<span>Home</span></button>
          <div class="sb-h">Library</div>
          <button class="sb-i" data-tab="songs">${GLYPH.note}<span>Songs</span></button>
          <button class="sb-i" data-tab="albums">${GLYPH.disc}<span>Albums</span></button>
          <button class="sb-i" data-tab="artists">${GLYPH.mic}<span>Artists</span></button>
        </aside>
        <div class="music-main">
          ${mtabs([["home", "Home"], ["songs", "Songs"], ["albums", "Albums"], ["artists", "Artists"]], w.state.tab)}
          <div class="music-scroll"></div>
          <div class="player no-drag">
            <div class="ctl">
              <button class="tg sh" title="Shuffle">${GLYPH.shuffle}</button>
              <button class="pv" title="Previous">${GLYPH.prev}</button>
              <button class="pp" title="Play/Pause">${GLYPH.play}</button>
              <button class="nx" title="Next">${GLYPH.next}</button>
              <button class="tg rp" title="Repeat">${GLYPH.repeat}</button>
            </div>
            <img class="pa" alt="">
            <div class="info"><b class="pt">Not Playing</b><small class="pr">pick a song</small>
              <div class="bar"><span class="t0">0:00</span><input type="range" class="seek" min="0" max="1000" value="0"><span class="t1">0:30</span></div></div>
            <div class="vol">${GLYPH.volume}<input type="range" class="vs" min="0" max="100"></div>
          </div>
        </div>`;
      $$("[data-tab]", w.body).forEach((b) => (b.onclick = () => { w.state.tab = b.dataset.tab; this.draw(w); }));
      wireNav(w.body, (k) => { w.state.tab = k; this.draw(w); });
      const m = OS.music;
      $(".pp", w.body).onclick = () => m.toggle();
      $(".nx", w.body).onclick = () => m.next();
      $(".pv", w.body).onclick = () => m.prev();
      $(".sh", w.body).onclick = (e) => { shuffle = !shuffle; e.currentTarget.classList.toggle("on", shuffle); };
      $(".rp", w.body).onclick = (e) => { repeat = !repeat; e.currentTarget.classList.toggle("on", repeat); };
      const seek = $(".seek", w.body);
      seek.oninput = () => { if (audio.duration) audio.currentTime = (seek.value / 1000) * audio.duration; };
      const vs = $(".vs", w.body); vs.value = audio.volume * 100;
      vs.oninput = () => { OS.set("volume", vs.value / 100); m.setVolume(vs.value / 100); };
      w.onTime = () => {
        if (!audio.duration) return;
        if (document.activeElement !== seek) seek.value = (audio.currentTime / audio.duration) * 1000;
        $(".t0", w.body).textContent = mmss(audio.currentTime);
        $(".t1", w.body).textContent = "-" + mmss(audio.duration - audio.currentTime);
      };
      audio.addEventListener("timeupdate", w.onTime);
      w.onMusic = () => this.sync(w);
      OS.on("music", w.onMusic);
      this.draw(w);
    },
    unmount(w) { audio.removeEventListener("timeupdate", w.onTime); w.dead = true; },
    route(w, arg) { w.state.tab = arg || "home"; this.draw(w); },
    draw(w) {
      const t = w.state.tab, c = $(".music-scroll", w.body);
      $$("[data-tab]", w.body).forEach((b) => b.classList.toggle("active", b.dataset.tab === t));
      $$("[data-nav]", w.body).forEach((b) => b.classList.toggle("on", b.dataset.nav === t));
      const rows = (list) => `<table class="tracks">${list.map(({ s, i }) => `<tr data-i="${i}"><td class="n">${i + 1}</td><td style="width:54px"><img class="art" src="${esc(thumb(s.art, 120))}" alt="" loading="lazy"></td><td><div class="tt">${esc(s.title)}</div><div class="ta">${esc(s.artist)}</div></td><td class="al hide-sm">${esc(s.album || "")}</td><td>${s.ms ? mmss(s.ms / 1000) : ""}</td></tr>`).join("")}</table>`;
      const all = SONGS.map((s, i) => ({ s, i }));
      if (t === "home") {
        c.innerHTML = `<h1>Home</h1><h2>Top Picks for ${esc(P.first)}</h2>
          <div class="picks">${SONGS.slice(0, 4).map((s, i) => `<button class="pick" data-i="${i}" style="background-image:url('${esc(thumb(s.art, 400))}')"><span class="lbl"><small>${esc(MUSIC_MOODS[i] || "")}</small><b>${esc(s.title)}</b></span></button>`).join("")}</div>
          <h2>Frequently Played</h2>${rows(all)}`;
      } else if (t === "songs") {
        c.innerHTML = `<h1>Songs</h1>${rows([...all].sort((a, b) => a.s.title.localeCompare(b.s.title)))}`;
      } else if (t === "albums") {
        c.innerHTML = `<h1>Albums</h1><div class="albums">${all.map(({ s, i }) => `<button class="album" data-i="${i}"><img src="${esc(thumb(s.art, 300))}" alt="" loading="lazy"><b>${esc(s.album || s.title)}</b><small>${esc(s.artist)}</small></button>`).join("")}</div>`;
      } else {
        const artists = {};
        all.forEach(({ s, i }) => s.artist.split(/,| & /).map((a) => a.trim()).forEach((a) => (artists[a] = artists[a] || []).push({ s, i })));
        c.innerHTML = `<h1>Artists</h1>` + Object.entries(artists).sort().map(([a, l]) => `<h2>${esc(a)}</h2>${rows(l)}`).join("");
      }
      $$("[data-i]", c).forEach((r) => (r.onclick = () => { const i = +r.dataset.i; i === OS.music.index() ? OS.music.toggle() : OS.music.play(i); }));
      c.scrollTop = 0;
      OS.setHash("music" + (t === "home" ? "" : "/" + t));
      this.sync(w);
    },
    sync(w) {
      if (w.dead) return;
      const m = OS.music, s = m.current(), i = m.index();
      $(".pp", w.body).innerHTML = m.playing() ? GLYPH.pause : GLYPH.play;
      $(".pt", w.body).textContent = s ? s.title : "Not Playing";
      $(".pr", w.body).textContent = s ? `${s.artist} — ${s.album || ""}`.replace(/ — $/, "") : "pick a song";
      const pa = $(".pa", w.body); pa.style.visibility = s ? "visible" : "hidden"; if (s) pa.src = s.art;
      $$(".tracks tr", w.body).forEach((tr) => {
        const on = +tr.dataset.i === i;
        tr.classList.toggle("now", on);
        tr.classList.toggle("paused", on && !m.playing());
        const n = tr.querySelector(".n");
        n.innerHTML = on ? `<span class="eq"><i></i><i></i><i></i></span>` : +tr.dataset.i + 1;
      });
      if (!s) { $(".t0", w.body).textContent = "0:00"; $(".t1", w.body).textContent = "0:30"; $(".seek", w.body).value = 0; }
    },
  };

  /* =====================================================================
     TV
     ===================================================================== */
  // fill in anything missing from TVMaze
  SHOWS.forEach((s) => {
    if (s.poster && s.summary) return;
    fetch("https://api.tvmaze.com/singlesearch/shows?q=" + encodeURIComponent(s.title)).then((r) => r.ok && r.json()).then((j) => {
      if (!j) return;
      s.poster = s.poster || j.image?.original;
      s.summary = s.summary || (j.summary || "").replace(/<[^>]+>/g, "");
      s.network = s.network || (j.network || j.webChannel)?.name;
      s.genres = s.genres || j.genres;
      s.rating = s.rating || j.rating?.average;
      s.year = s.year || (j.premiered || "").slice(0, 4);
      s.url = s.url || j.url;
      OS.emit("tv");
    }).catch(() => {});
  });

  OS.apps.tv = {
    title: "TV", w: 1100, h: 700, minW: 600, about: "shows i rewatched instead of sleeping",
    mount(w, arg) {
      w.state = { sel: +arg || 0, tab: "home" };
      w.body.innerHTML = `
        <aside class="sidebar">
          <button class="sb-i" data-tab="home">${GLYPH.home}<span>Home</span></button>
          <div class="sb-h">My Library</div>
          <button class="sb-i" data-tab="shows">${GLYPH.tv}<span>TV Shows</span></button>
          <button class="sb-i" data-tab="comedy">${GLYPH.film}<span>Comedy</span></button>
          <button class="sb-i" data-tab="drama">${GLYPH.film}<span>Drama</span></button>
          <div class="sb-h">Curated</div>
          <button class="sb-i" data-tab="picks">${GLYPH.star}<span>My Picks</span></button>
        </aside>
        <div class="main">${mtabs([["home", "Home"], ["shows", "All Shows"], ["comedy", "Comedy"], ["drama", "Drama"]], "home")}<div class="tv-scroll"></div></div>`;
      $$("[data-tab]", w.body).forEach((b) => (b.onclick = () => { w.state.tab = b.dataset.tab; this.draw(w); }));
      wireNav(w.body, (k) => { w.state.tab = k; this.draw(w); });
      w.onTv = () => !w.dead && this.draw(w, true);
      OS.on("tv", w.onTv);
      this.draw(w);
    },
    unmount(w) { w.dead = true; },
    route(w, arg) { w.state.sel = +arg || 0; w.state.tab = "home"; this.draw(w); },
    draw(w, keepScroll) {
      const c = $(".tv-scroll", w.body), t = w.state.tab;
      $$("[data-tab]", w.body).forEach((b) => b.classList.toggle("active", b.dataset.tab === t));
      $$("[data-nav]", w.body).forEach((b) => b.classList.toggle("on", b.dataset.nav === t));
      const list = SHOWS.map((s, i) => ({ s, i })).filter(({ s }) =>
        t === "comedy" ? (s.genres || []).includes("Comedy") : t === "drama" ? (s.genres || []).includes("Drama") : true);
      if (!list.find((x) => x.i === w.state.sel)) w.state.sel = list[0]?.i ?? 0;
      const s = SHOWS[w.state.sel];
      const st = c.scrollTop;
      const title = { home: `Top Picks for ${P.first}`, shows: "All TV Shows", comedy: "Comedy", drama: "Drama", picks: "My Picks" }[t];
      c.innerHTML = `
        <div class="hero" style="background-image:url('${esc(s.bg || s.poster || "")}')">
          <div class="hc">
            <div class="kick">${esc((s.genres || []).join(" · "))}${s.seasons ? ` · ${s.seasons} season${s.seasons > 1 ? "s" : ""}` : ""}</div>
            <h1>${esc(s.title)}</h1>
            <p>${esc(s.summary || "")}</p>
            <div class="chips">${s.rating ? `<span class="chip y">TVMaze ${s.rating}</span>` : ""}<span class="chip">${esc(s.year || "")}</span><span class="chip">${esc(s.network || "")}</span></div>
            ${s.url ? `<a class="btn" href="${esc(s.url)}" target="_blank" rel="noopener">More info ${GLYPH.ext}</a>` : ""}
          </div>
        </div>
        <div class="tv-row"><h2>${esc(title)}</h2>
          <div class="posters">${list.map(({ s, i }) => `<button class="poster ${i === w.state.sel ? "active" : ""}" data-i="${i}" style="background-image:url('${esc(s.poster || "")}')"><span class="pt">${esc(s.title)}</span></button>`).join("")}</div>
        </div>`;
      $$(".poster", c).forEach((b) => (b.onclick = () => { w.state.sel = +b.dataset.i; this.draw(w); c.scrollTo({ top: 0, behavior: "smooth" }); }));
      if (keepScroll) c.scrollTop = st;
      OS.setHash("tv/" + w.state.sel);
    },
  };

  /* =====================================================================
     TERMINAL
     ===================================================================== */
  OS.apps.terminal = {
    title: "Terminal", w: 720, h: 460, about: "for recruiters who think guis are mid",
    mount(w) {
      w.body.style.flexDirection = "column";
      w.body.innerHTML = `<div class="term-head">${esc(P.handle)} — zsh — 80×24</div><div class="term"><div class="out"></div><div class="in"><span class="p">${esc(P.handle)}@macbook</span>&nbsp;<span class="d">~</span>&nbsp;%<input spellcheck="false" autocomplete="off" aria-label="terminal input"></div></div>`;
      const out = $(".out", w.body), input = $(".in input", w.body), term = $(".term", w.body);
      const hist = []; let hi = 0;
      const print = (html) => { out.insertAdjacentHTML("beforeend", `<div class="ln">${html}</div>`); term.scrollTop = term.scrollHeight; };
      term.onclick = () => { if (!getSelection().toString()) input.focus(); };
      const cmds = {
        help: () => `commands (no, rm -rf / is not one of them):
  <span class="y">whoami</span>       who is this guy
  <span class="y">about</span>        the short version
  <span class="y">experience</span>   where i've worked
  <span class="y">projects</span>     ls ~/projects
  <span class="y">beliefs</span>      growth opinions
  <span class="y">contact</span>      how to reach me
  <span class="y">socials</span>      links
  <span class="y">music</span>        play something
  <span class="y">open</span> &lt;app&gt;   notes, music, tv, finder, mail, safari, settings
  <span class="y">theme</span>        toggle dark mode
  <span class="y">trash</span>        my bad decisions, archived
  <span class="y">hire</span>         you know what this does
  <span class="y">date</span> · <span class="y">echo</span> · <span class="y">ls</span> · <span class="y">cat</span> · <span class="y">rm</span> · <span class="y">clear</span> · <span class="y">sudo</span>`,
        whoami: () => `${esc(P.name)}\n${esc(P.headline)}\n${esc(P.location)}\n<span class="m">(a 19 year old with a mac-themed website and a windows laptop)</span>`,
        about: () => `i'm adhiraj. growth at oneassure, building kissa on the side.
started my first business at 15 (walking dogs, no shame). got 3 offers off a month of cold dms.
<span class="m">full lore: open notes</span>`,
        trash: () => (window.TRASH || []).map((f) => `<span class="r">${esc(f.name)}</span>  <span class="m">${esc(f.mod || "")}</span>`).join("\n"),
        hire: () => cmds.sudo(["hire"]),
        rm: (a) => { const t = a.filter((x) => !x.startsWith("-")).join(" "); if (/imposter/i.test(t)) return `<span class="r">rm: imposter-syndrome: resource busy. it's always busy.</span>`; if (t === "/" || /-rf/.test(a.join(" "))) return `<span class="r">absolutely not. this mac is my whole portfolio.</span>`; return `<span class="m">moved ${esc(t || "nothing")} to trash. (not really. i'm a website.)</span>`; },
        experience: () => PROJECTS.map((p) => `<span class="y">${esc(p.name.padEnd(12))}</span> ${esc(p.role)} <span class="m">(${esc(p.dates)})</span>`).join("\n"),
        projects: () => PROJECTS.map((p) => `<span class="d">${esc(p.name)}/</span>`).join("  ") + `\n<span class="m">try: cat kissa</span>`,
        ls: (a) => a && a[0] === "projects" ? cmds.projects() : `<span class="d">projects/</span>  <span class="d">documents/</span>  <span class="d">downloads/</span>  ${NOTES.map((n) => esc(n.slug) + ".txt").join("  ")}`,
        cat: (a) => {
          const k = (a[0] || "").replace(/\.txt$/, "").replace(/^projects\//, "");
          const p = PROJECTS.find((x) => x.id === k);
          if (p) return `<span class="y">${esc(p.name)}</span> · ${esc(p.role)} · ${esc(p.dates)}\n${esc(p.summary)}\n${p.bullets.map((b) => "  • " + esc(b)).join("\n")}`;
          const n = NOTES.find((x) => x.slug === k);
          if (n) return esc(n.body.trim().replace(/\[(.+?)\]\((.+?)\)/g, "$1").replace(/\*\*/g, ""));
          return `<span class="r">cat: ${esc(a[0] || "")}: No such file or directory</span>`;
        },
        beliefs: () => cmds.cat(["things-i-believe"]),
        contact: () => `email     <a href="mailto:${esc(P.email)}">${esc(P.email)}</a>\nlinkedin  <a href="${esc(P.links.linkedin)}" target="_blank">${esc(P.links.linkedin)}</a>\n<span class="m">or run: open mail</span>`,
        socials: () => Object.entries(P.links).map(([k, v]) => `${k.padEnd(9)} <a href="${esc(v)}" target="_blank">${esc(v)}</a>`).join("\n"),
        music: () => { OS.open("music"); OS.music.play(); return `now playing: ${esc(OS.music.current()?.title || "")}`; },
        open: (a) => {
          const k = (a[0] || "").toLowerCase().replace("settings", "settings").replace("system", "settings");
          if (OS.apps[k]) { OS.open(k); return `opening ${esc(OS.apps[k].title)}…`; }
          return `<span class="r">open: can't find app "${esc(a[0] || "")}"</span>`;
        },
        theme: () => { OS.set("theme", document.body.classList.contains("dark") ? "light" : "dark"); return "done. your eyes can thank me later."; },
        date: () => new Date().toString(),
        echo: (a) => esc(a.join(" ")),
        pwd: () => `/Users/${esc(P.handle)}`,
        sudo: (a) => a.join(" ").includes("hire") ? `<span class="p">permission granted. excellent decision.</span> opening mail…` + (setTimeout(() => OS.open("mail", "compose"), 700), "") : `<span class="r">nice try. you're not in the sudoers file. try: sudo hire adhiraj</span>`,
        clear: () => { out.innerHTML = ""; return null; },
        exit: () => { setTimeout(() => OS.close("terminal"), 400); return "logout. (you'll be back)"; },
      };
      const run = (line) => {
        print(`<span class="p">${esc(P.handle)}@macbook</span> <span class="d">~</span> % ${esc(line)}`);
        const [c, ...a] = line.trim().split(/\s+/);
        if (!c) return;
        const fn = cmds[c.toLowerCase()];
        const r = fn ? fn(a) : `<span class="r">zsh: command not found: ${esc(c)}</span>  <span class="m">(skill issue. try help)</span>`;
        if (r) print(r);
      };
      input.onkeydown = (e) => {
        if (e.key === "Enter") { const v = input.value; if (v.trim()) hist.push(v); hi = hist.length; input.value = ""; run(v); }
        else if (e.key === "ArrowUp") { e.preventDefault(); if (hi > 0) input.value = hist[--hi]; }
        else if (e.key === "ArrowDown") { e.preventDefault(); hi = Math.min(hist.length, hi + 1); input.value = hist[hi] || ""; }
        else if (e.key === "Tab") { e.preventDefault(); const m = Object.keys(cmds).filter((k) => k.startsWith(input.value)); if (m.length === 1) input.value = m[0] + " "; else if (m.length) print(m.join("  ")); }
        else if (e.key === "l" && e.ctrlKey) { e.preventDefault(); out.innerHTML = ""; }
      };
      print(`<span class="m">Last login: ${new Date().toDateString()} on ttys000</span>`);
      print(`welcome to ${esc(P.first.toLowerCase())}'s mac. type <span class="y">help</span>. or don't, i'm a terminal, not a cop.`);
      setTimeout(() => input.focus(), 50);
      OS.setHash("terminal");
    },
  };

  /* =====================================================================
     MAIL
     ===================================================================== */
  const MAILS = () => [
    { id: "hi", from: P.name, sub: "welcome to my mac (it's not a mac)", date: "Today", body: `hey stranger,\n\nyou found my portfolio. it's a mac. every app in the dock actually works and i'm unreasonably proud of that.\n\n- notes: my whole life, in lowercase\n- finder > projects: where i've worked\n- finder > trash: where my bad decisions live\n- music: what's on repeat (hit play)\n- tv: shows i've rewatched way too many times\n- terminal: type help, nerd\n\nif you want to talk growth, gtm or a role, hit compose. it opens your email app with my address in it. i reply. promise.\n\n- ${P.first.toLowerCase()}` },
    { id: "why", from: P.name, sub: "re: why should we hire you?", date: "Yesterday", body: `short answer: i ship.\n\nmedium answer: 200+ icps at a 15% reply rate, 60+ creators on templates, 800+ students at an event, and a dog-walking business at 15.\n\nlong answer: open notes. it's all there, with jokes.\n\nnext question.\n\n- ${P.first.toLowerCase()}` },
    { id: "work", from: P.name, sub: "re: are you open to work?", date: "Tuesday", body: `yes. that's the email.\n\nok fine, more: ${P.status}.\n\nreceipts:\n- oneassure: founder-led content on x, templates for 60+ affiliate creators\n- kissa: outbound ai agent, 200+ icps, 15% reply rate\n- ekume: 800+ students, partners like geeksforgeeks and mlh\n- octupie: built x from zero, product reels, reddit\n\nlinkedin, if you need it to look official: ${P.links.linkedin}\n\n- ${P.first.toLowerCase()}` },
  ];
  OS.apps.mail = {
    title: "Mail", w: 1000, h: 600, about: "slide into my inbox (professionally)",
    mount(w, arg) {
      w.state = { box: "inbox", id: "hi" };
      w.body.innerHTML = `
        <aside class="sidebar">
          <button class="btn primary compose-btn" style="width:100%;justify-content:center;margin-bottom:10px">${GLYPH.compose} New Message</button>
          <div class="sb-h">Mailboxes</div>
          <button class="sb-i" data-box="inbox">${GLYPH.inbox}<span>Inbox</span><span class="count">${MAILS().length}</span></button>
          <button class="sb-i" data-box="sent">${GLYPH.send}<span>Sent</span><span class="count sc">0</span></button>
        </aside>
        <div class="mail-list"><div class="toolbar"><h2>Inbox</h2><button class="tb-btn compose-btn" title="New message">${GLYPH.compose}</button></div><div class="scroll ml"></div></div>
        <div class="mail-view"></div>`;
      $$(".compose-btn", w.body).forEach((b) => (b.onclick = () => this.compose(w)));
      $$("[data-box]", w.body).forEach((b) => (b.onclick = () => { w.state.box = b.dataset.box; this.list(w); }));
      this.list(w);
      if (arg === "compose") this.compose(w); else { this.read(w); if (isMobile()) w.body.classList.remove("m-detail"); }
    },
    route(w, arg) { if (arg === "compose") this.compose(w); },
    sent() { try { return JSON.parse(SAFE.lget("mac-sent") || "[]"); } catch (e) { return []; } },
    list(w) {
      const items = w.state.box === "inbox" ? MAILS() : this.sent();
      $(".mail-list h2", w.body).textContent = w.state.box === "inbox" ? "Inbox" : "Sent";
      $(".sc", w.body).textContent = this.sent().length;
      $$("[data-box]", w.body).forEach((b) => b.classList.toggle("active", b.dataset.box === w.state.box));
      $(".ml", w.body).innerHTML = items.length ? items.map((m) => `<button class="mail-item ${m.id === w.state.id ? "active" : ""}" data-id="${m.id}"><b>${esc(w.state.box === "sent" ? "To: " + P.first : m.from)}<small>${esc(m.date)}</small></b><div class="sub">${esc(m.sub)}</div><p>${esc(m.body.slice(0, 120))}</p></button>`).join("") : `<div class="empty">nothing sent yet</div>`;
      $$(".mail-item", w.body).forEach((b) => (b.onclick = () => { w.state.id = b.dataset.id; this.list(w); this.read(w); }));
    },
    read(w) {
      const m = [...MAILS(), ...this.sent()].find((x) => x.id === w.state.id) || MAILS()[0];
      w.body.classList.add("m-detail");
      $(".mail-view", w.body).innerHTML = `<div class="toolbar" style="justify-content:space-between"><button class="tb-btn m-back">${GLYPH.back}</button><span></span><button class="btn reply">${GLYPH.send} Reply</button></div>
        <div class="mail-read"><div class="from"><img src="${esc(P.photo)}" alt=""><div><b>${esc(m.from)}</b><small>to: you · ${esc(m.date)}</small></div></div><h3>${esc(m.sub)}</h3><div style="white-space:pre-wrap;margin-top:12px">${esc(m.body).replace(/(https?:\/\/\S+)/g, '<a href="$1" target="_blank" rel="noopener">$1</a>')}</div></div>`;
      $(".reply", w.body).onclick = () => this.compose(w, "re: " + m.sub);
      $(".m-back", w.body).onclick = () => w.body.classList.remove("m-detail");
      OS.setHash("mail");
    },
    compose(w, subject = "") {
      const v = $(".mail-view", w.body);
      w.body.classList.add("m-detail");
      v.innerHTML = `<div class="toolbar"><button class="tb-btn m-back">${GLYPH.back}</button><h2>New Message</h2><button class="btn primary send">${GLYPH.send} Send</button></div>
        <form class="compose" onsubmit="return false">
          <div class="f"><span>To:</span><input value="${esc(P.email)}" readonly></div>
          <div class="f"><span>From:</span><input class="fn" placeholder="your name"></div>
          <div class="f"><span>Subject:</span><input class="su" value="${esc(subject)}" placeholder="let's talk"></div>
          <textarea class="bd" placeholder="hey adhiraj,"></textarea>
          <div class="hint">sending opens your email app with this message filled in.</div>
        </form>`;
      if (!isMobile()) $(".fn", v).focus();
      $(".m-back", v).onclick = () => w.body.classList.remove("m-detail");
      $(".send", v).onclick = () => {
        const name = $(".fn", v).value.trim(), su = $(".su", v).value.trim() || "hey adhiraj", bd = $(".bd", v).value.trim();
        if (!bd) { $(".bd", v).focus(); OS.toast("Mail", "can't send an empty email. this isn't a situationship", "mail"); return; }
        const body = bd + (name ? `\n\n- ${name}` : "");
        window.location.href = `mailto:${P.email}?subject=${encodeURIComponent(su)}&body=${encodeURIComponent(body)}`;
        const sent = this.sent(); const id = "s" + Date.now();
        sent.unshift({ id, from: name || "you", sub: su, date: "Just now", body }); SAFE.lset("mac-sent", JSON.stringify(sent.slice(0, 20)));
        OS.toast("Message ready", "hit send in your email app. i'll reply, i swear", "mail");
        w.state.box = "sent"; w.state.id = id; this.list(w); this.read(w);
      };
      OS.setHash("mail/compose");
    },
  };

  /* =====================================================================
     SAFARI
     ===================================================================== */
  OS.apps.safari = {
    title: "Safari", w: 960, h: 580, about: "my corners of the internet",
    mount(w) {
      w.body.style.flexDirection = "column";
      const favs = [
        { n: "LinkedIn", u: P.links.linkedin, c: "#0a66c2", l: "in" },
        { n: "X", u: P.links.x, c: "#000", l: "X" },
        { n: "GitHub", u: P.links.github, c: "#24292f", l: "GH" },
        { n: "OneAssure", u: "https://www.oneassure.in", c: "#2f7cf6", l: "O" },
        { n: "Octupie", u: "https://octupie.com", c: "#13a37f", l: "Oc" },
        { n: "Email me", u: "mailto:" + P.email, c: "#1a73e8", l: "@" },
      ];
      w.body.innerHTML = `<div class="safari-bar"><button class="tb-btn" disabled>${GLYPH.back}</button><form class="no-drag"><input placeholder="Search or enter website name" class="url"></form><button class="tb-btn rl" title="Reload">${GLYPH.reload}</button></div>
        <div class="safari-start"><h2>Favorites</h2><div class="favs">${favs.map((f) => `<a class="fav" href="${esc(f.u)}" target="_blank" rel="noopener"><span class="fbox" style="background:${f.c}">${f.l}</span>${esc(f.n)}</a>`).join("")}</div>
        <h2 style="margin-top:34px">Reading List</h2><div class="favs">${NOTES.map((n) => `<a class="fav" href="#notes/${n.slug}"><span class="fbox" style="background:#fcc419;color:#5b4b10">${esc(n.title[0].toUpperCase())}</span>${esc(n.title)}</a>`).join("")}</div>
        <p class="tip">most sites don't allow being shown inside another page, so links open in a new tab.</p></div>`;
      $("form", w.body).onsubmit = (e) => {
        e.preventDefault();
        let v = $(".url", w.body).value.trim(); if (!v) return;
        const url = /^https?:\/\//.test(v) ? v : v.includes(".") && !v.includes(" ") ? "https://" + v : "https://www.google.com/search?q=" + encodeURIComponent(v);
        window.open(url, "_blank", "noopener");
      };
      $(".rl", w.body).onclick = () => OS.toast("Safari", "reloaded. it was already perfect, but ok", "safari");
      OS.setHash("safari");
    },
  };

  /* =====================================================================
     SYSTEM SETTINGS
     ===================================================================== */
  OS.apps.settings = {
    title: "System Settings", icon: "settings", w: 860, h: 600, about: "change stuff. it remembers. unlike me",
    mount(w, arg) {
      w.state = { page: arg || "account" };
      const item = (k, label, glyph, color) => `<button class="sb-i set" data-p="${k}"><span class="sq" style="background:${color}">${GLYPH[glyph]}</span><span>${label}</span></button>`;
      w.body.innerHTML = `
        <aside class="sidebar">
          <button class="acct" data-p="account"><img src="${esc(P.photo)}" alt=""><div><b>${esc(P.first)}</b><small>Apple Account</small></div></button>
          ${item("wifi", "Wi-Fi", "wifi", "#0a84ff")}${item("bluetooth", "Bluetooth", "bt", "#0a84ff")}
          <div style="height:10px"></div>
          ${item("appearance", "Appearance", "paint", "#1d1d1f")}${item("wallpaper", "Wallpaper", "image", "#30b0c7")}${item("dock", "Desktop & Dock", "dock", "#1d1d1f")}
          <div style="height:10px"></div>
          ${item("about", "About This Mac", "info", "#8e8e93")}
        </aside>
        <div class="main">${mtabs([["account", "Account"], ["appearance", "Appearance"], ["wallpaper", "Wallpaper"], ["wifi", "Wi-Fi"], ["dock", "Dock"], ["about", "About"]], w.state.page)}<div class="set-main"></div></div>`;
      $$("[data-p]", w.body).forEach((b) => (b.onclick = () => this.go(w, b.dataset.p)));
      wireNav(w.body, (k) => this.go(w, k));
      w.onSet = () => !w.dead && this.draw(w);
      OS.on("settings", w.onSet);
      this.draw(w);
    },
    unmount(w) { w.dead = true; },
    route(w, arg) { this.go(w, arg); },
    go(w, p) { w.state.page = p || "account"; this.draw(w); },
    draw(w) {
      const S = OS.S, p = w.state.page, c = $(".set-main", w.body);
      $$("[data-p]", w.body).forEach((b) => b.classList.toggle("active", b.dataset.p === p));
      $$("[data-nav]", w.body).forEach((b) => b.classList.toggle("on", b.dataset.nav === p));
      const sw = (k, on) => `<button class="switch ${on ? "on" : ""}" data-sw="${k}" aria-label="toggle ${k}"></button>`;
      const titles = { account: "Apple Account", wifi: "Wi-Fi", bluetooth: "Bluetooth", appearance: "Appearance", wallpaper: "Wallpaper", dock: "Desktop & Dock", about: "About" };
      let html = `<div class="toolbar"><h2>${titles[p]}</h2></div>`;
      if (p === "account") {
        html += `<div class="profile-top"><img src="${esc(P.photo)}" alt=""><h2>${esc(P.name)}</h2><p>${esc(P.email)}</p><p>${esc(P.location)}</p></div>
          <div class="gh">Links</div><div class="group">
            <a class="gr" href="${esc(P.links.linkedin)}" target="_blank" rel="noopener"><span class="grow"><b>LinkedIn</b><small>/in/rajishere</small></span>${GLYPH.ext.replace("<svg", '<svg width="16" height="16"')}</a>
            <a class="gr" href="${esc(P.links.x)}" target="_blank" rel="noopener"><span class="grow"><b>X</b><small>@adhiraj_xyz</small></span>${GLYPH.ext.replace("<svg", '<svg width="16" height="16"')}</a>
            <a class="gr" href="${esc(P.links.github)}" target="_blank" rel="noopener"><span class="grow"><b>GitHub</b><small>AbcAdhiraj</small></span>${GLYPH.ext.replace("<svg", '<svg width="16" height="16"')}</a>
          </div>
          <div class="gh">Currently</div><div class="group">${PROJECTS.filter((x) => /now/.test(x.dates)).map((x) => `<div class="gr"><span class="sq" style="width:30px;height:30px;border-radius:8px;display:grid;place-items:center;color:#fff;font-weight:800;background:${x.color}">${esc(x.name[0].toUpperCase())}</span><span class="grow"><b>${esc(x.name)}</b><small>${esc(x.role)} · ${esc(x.dates)}</small></span></div>`).join("")}</div>
          <div class="group"><div class="gr"><span class="grow"><b>Status</b><small>${esc(P.status)}</small></span><button class="btn primary" data-act="mail">Get in touch</button></div></div>`;
      } else if (p === "wifi") {
        html += `<div class="group"><div class="gr"><span class="sq" style="width:30px;height:30px;border-radius:8px;display:grid;place-items:center;background:#0a84ff;color:#fff">${GLYPH.wifi.replace("<svg", '<svg width="18" height="18"')}</span><span class="grow"><b>Wi-Fi</b><small>${S.wifi ? "Connected" : "Off"}</small></span>${sw("wifi", S.wifi)}</div>
          ${S.wifi ? `<div class="gr"><span class="grow"><b>Bengaluru_5G</b><small>Connected · secure</small></span>✓</div>` : ""}</div>
          ${S.wifi ? `<div class="gh">Other Networks</div><div class="group"><div class="gr"><span class="grow">chai_point_guest</span>🔒</div><div class="gr"><span class="grow">cold_dm_hotspot</span>🔒</div><div class="gr"><span class="grow">pretty fly for a wifi</span>🔒</div></div>` : ""}`;
      } else if (p === "bluetooth") {
        html += `<div class="group"><div class="gr"><span class="grow"><b>Bluetooth</b><small>${S.bluetooth ? "Discoverable as “" + esc(P.first) + "'s MacBook”" : "Off"}</small></span>${sw("bluetooth", S.bluetooth)}</div></div>
          ${S.bluetooth ? `<div class="gh">Nearby Devices</div><div class="group"><div class="gr"><span class="grow" style="color:var(--text-2)">searching… (like me, for work-life balance)</span></div></div>` : ""}`;
      } else if (p === "appearance") {
        const mode = (k, l, bg) => `<button class="${S.theme === k ? "on" : ""}" data-theme="${k}"><span class="sw" style="background:${bg}"></span>${l}</button>`;
        html += `<div class="group"><div class="appear">${mode("light", "Light", "linear-gradient(#f5f5f7 0 30%,#fff 30%)")}${mode("dark", "Dark", "linear-gradient(#3a3a3c 0 30%,#1c1c1e 30%)")}${mode("auto", "Auto", "linear-gradient(90deg,#f5f5f7 50%,#1c1c1e 50%)")}</div></div>
          <div class="group"><div class="gr"><span class="grow"><b>Accent color</b></span><div class="accents">${OS.ACCENTS.map((a) => `<button style="background:${a};color:${a}" class="${S.accent === a ? "on" : ""}" data-accent="${a}"></button>`).join("")}</div></div></div>`;
      } else if (p === "wallpaper") {
        html += `<div class="group"><div class="walls">${OS.WALLPAPERS.map((wp) => `<button class="${S.wallpaper === wp.id ? "on" : ""}" data-wall="${wp.id}" style="background-image:url(${wp.url})"><span>${wp.name}</span></button>`).join("")}</div></div>`;
      } else if (p === "dock") {
        html += `<div class="group">
          <div class="gr"><span class="grow"><b>Size</b></span><input type="range" min="40" max="76" value="${S.dockSize}" data-range="dockSize" style="width:200px"></div>
          <div class="gr"><span class="grow"><b>Magnification</b><small>icons grow when you hover</small></span>${sw("magnify", S.magnify)}</div></div>`;
      } else if (p === "about") {
        html += `<div class="about-mac"><div class="laptop">${laptopSvg()}</div><h2>${esc(P.first)}'s MacBook</h2><p>Growth & GTM Edition, 2026 (not actually a mac)</p></div>
          <div class="group kv">
            <div class="gr"><b>Name</b><span>${esc(P.name)}</span></div>
            <div class="gr"><b>Chip</b><span>growth + gtm (overclocked)</span></div>
            <div class="gr"><b>Memory</b><span>remembers every cold dm reply, forgets every password</span></div>
            <div class="gr"><b>Battery</b><span>runs on deadlines</span></div>
            <div class="gr"><b>Location</b><span>${esc(P.location)}</span></div>
            <div class="gr"><b>Current build</b><span>oneassure · kissa · ekume</span></div>
            <div class="gr"><b>macOS</b><span>adhiraj os 19 (first release at 15, still in beta)</span></div>
          </div>
          <div style="text-align:center"><button class="btn" data-act="more">More Info…</button></div>`;
      }
      c.innerHTML = html;
      $$("[data-sw]", c).forEach((b) => (b.onclick = () => OS.set(b.dataset.sw, !S[b.dataset.sw])));
      $$("[data-theme]", c).forEach((b) => (b.onclick = () => OS.set("theme", b.dataset.theme)));
      $$("[data-accent]", c).forEach((b) => (b.onclick = () => OS.set("accent", b.dataset.accent)));
      $$("[data-wall]", c).forEach((b) => (b.onclick = () => OS.set("wallpaper", b.dataset.wall)));
      $$("[data-range]", c).forEach((r) => (r.onchange = () => OS.set(r.dataset.range, +r.value)));
      const act = $("[data-act]", c);
      if (act) act.onclick = () => (act.dataset.act === "mail" ? OS.open("mail", "compose") : OS.open("notes", "about-me"));
      OS.setHash("settings/" + p);
    },
  };
  function laptopSvg() {
    return `<svg viewBox="0 0 160 100"><defs><linearGradient id="lsc" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#7b6cf0"/><stop offset=".5" stop-color="#f29cc0"/><stop offset="1" stop-color="#5cc23e"/></linearGradient></defs>
      <rect x="22" y="6" width="116" height="76" rx="6" fill="#2b2b2e"/><rect x="27" y="11" width="106" height="66" rx="2" fill="url(#lsc)"/>
      <path d="M8 84 H152 L146 92 Q144 94 140 94 H20 Q16 94 14 92Z" fill="#c9cbd0"/><rect x="66" y="84" width="28" height="3" rx="1.5" fill="#a7a9ae"/></svg>`;
  }
})();

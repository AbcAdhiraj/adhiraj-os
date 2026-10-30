/* Hand-drawn SVG app icons (no Apple assets used) */
(function () {
  const sq = (id, inner, defs = "") =>
    `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><defs>${defs}<clipPath id="c-${id}"><rect x="4" y="4" width="92" height="92" rx="22"/></clipPath></defs><g clip-path="url(#c-${id})">${inner}</g><rect x="4.5" y="4.5" width="91" height="91" rx="21.5" fill="none" stroke="rgba(0,0,0,.12)"/></svg>`;

  window.ICONS = {
    finder: sq("finder",
      `<rect width="100" height="100" fill="url(#fdl)"/>
       <path d="M54 0 C46 22 44 40 50 58 C44 70 46 86 52 100 L100 100 L100 0Z" fill="url(#fdr)"/>
       <rect x="30" y="30" width="7" height="16" rx="3.5" fill="#0b2a55"/>
       <rect x="64" y="30" width="7" height="16" rx="3.5" fill="#0b2a55"/>
       <path d="M24 66 Q50 84 77 66" stroke="#0b2a55" stroke-width="5" fill="none" stroke-linecap="round"/>`,
      `<linearGradient id="fdl" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3fb5ff"/><stop offset="1" stop-color="#0f6ce6"/></linearGradient>
       <linearGradient id="fdr" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f4fbff"/><stop offset="1" stop-color="#c7e4ff"/></linearGradient>`),

    notes: sq("notes",
      `<rect width="100" height="100" fill="#fbfbf8"/>
       <rect width="100" height="30" fill="url(#nty)"/>
       <path d="M4 30 H96" stroke="#d9b100" stroke-width="1.5"/>
       <path d="M4 30 H96" stroke="#000" stroke-opacity=".08" stroke-dasharray="2 3" transform="translate(0,3)"/>
       <g stroke="#c9c9c4" stroke-width="2"><path d="M16 50 H84"/><path d="M16 64 H84"/><path d="M16 78 H84"/></g>`,
      `<linearGradient id="nty" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffe066"/><stop offset="1" stop-color="#fcc419"/></linearGradient>`),

    settings: sq("settings",
      `<rect width="100" height="100" fill="url(#stg)"/>
       <circle cx="50" cy="50" r="31" fill="none" stroke="#3f4349" stroke-width="9" stroke-dasharray="6.5 5.7"/>
       <circle cx="50" cy="50" r="27" fill="#d7dade" stroke="#3f4349" stroke-width="2"/>
       <circle cx="50" cy="50" r="19" fill="none" stroke="#5c6168" stroke-width="3"/>
       <g stroke="#5c6168" stroke-width="3"><path d="M50 31 V69"/><path d="M33.5 40.5 L66.5 59.5"/><path d="M33.5 59.5 L66.5 40.5"/></g>
       <circle cx="50" cy="50" r="7" fill="#8b9097" stroke="#3f4349" stroke-width="2"/>`,
      `<linearGradient id="stg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#c3c7cc"/><stop offset="1" stop-color="#7d828a"/></linearGradient>`),

    music: sq("music",
      `<rect width="100" height="100" fill="url(#msg)"/>
       <path d="M41 30 L72 23 V62" stroke="#fff" stroke-width="6" fill="none" stroke-linejoin="round"/>
       <path d="M41 30 V70" stroke="#fff" stroke-width="6"/>
       <ellipse cx="34" cy="71" rx="9" ry="7.5" fill="#fff"/><ellipse cx="65" cy="63" rx="9" ry="7.5" fill="#fff"/>`,
      `<linearGradient id="msg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ff6b7d"/><stop offset="1" stop-color="#f5213f"/></linearGradient>`),

    tv: sq("tv",
      `<rect width="100" height="100" fill="url(#tvg)"/>
       <path d="M22 38 L40 50 L22 62Z" fill="#fff"/>
       <text x="47" y="62" font-family="-apple-system,Helvetica,Arial,sans-serif" font-size="32" font-weight="600" fill="#fff">tv</text>`,
      `<linearGradient id="tvg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3a3a3c"/><stop offset="1" stop-color="#0c0c0d"/></linearGradient>`),

    terminal: sq("terminal",
      `<rect width="100" height="100" fill="#1d1f21"/>
       <rect width="100" height="18" fill="#3a3d41"/>
       <path d="M22 40 L36 50 L22 60" stroke="#e6e6e6" stroke-width="5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
       <path d="M42 62 H62" stroke="#e6e6e6" stroke-width="5" stroke-linecap="round"/>`),

    mail: sq("mail",
      `<rect width="100" height="100" fill="url(#mlg)"/>
       <rect x="18" y="30" width="64" height="44" rx="5" fill="#fff"/>
       <path d="M19 32 L50 56 L81 32" stroke="#2b7de9" stroke-width="3" fill="none" stroke-linejoin="round"/>`,
      `<linearGradient id="mlg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5ac8fa"/><stop offset="1" stop-color="#1a73e8"/></linearGradient>`),

    safari: sq("safari",
      `<rect width="100" height="100" fill="#f4f6f8"/>
       <circle cx="50" cy="50" r="38" fill="url(#sfg)"/>
       <g stroke="#fff" stroke-opacity=".7">${Array.from({ length: 24 }, (_, i) => `<path d="M50 14 V20" transform="rotate(${i * 15} 50 50)"/>`).join("")}</g>
       <path d="M50 50 L68 32 L56 56Z" fill="#ff3b30"/><path d="M50 50 L32 68 L44 44Z" fill="#fff"/>`,
      `<radialGradient id="sfg"><stop offset="0" stop-color="#5fd0ff"/><stop offset="1" stop-color="#1572e8"/></radialGradient>`),

    trash: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
       <path d="M24 26 H76 L71 90 Q70 94 66 94 H34 Q30 94 29 90Z" fill="rgba(255,255,255,.55)" stroke="rgba(255,255,255,.9)" stroke-width="2"/>
       <rect x="20" y="18" width="60" height="9" rx="4" fill="rgba(255,255,255,.75)" stroke="rgba(255,255,255,.95)"/>
       <g stroke="rgba(80,90,100,.45)" stroke-width="2.5"><path d="M38 36 L40 84"/><path d="M50 36 V84"/><path d="M62 36 L60 84"/></g></svg>`,

    folder: `<svg viewBox="0 0 100 80" xmlns="http://www.w3.org/2000/svg"><path d="M4 12 Q4 6 10 6 H36 L44 14 H90 Q96 14 96 20 V70 Q96 76 90 76 H10 Q4 76 4 70Z" fill="#1e88f0"/><path d="M4 24 Q4 20 8 20 H92 Q96 20 96 24 V70 Q96 76 90 76 H10 Q4 76 4 70Z" fill="#5cb4ff"/></svg>`,

    doc: `<svg viewBox="0 0 80 100" xmlns="http://www.w3.org/2000/svg"><path d="M8 4 H52 L72 24 V92 Q72 96 68 96 H12 Q8 96 8 92Z" fill="#fff" stroke="#c8c8c8" stroke-width="2"/><path d="M52 4 V24 H72" fill="#eee" stroke="#c8c8c8" stroke-width="2"/><g stroke="#b9b9b9" stroke-width="3"><path d="M20 44 H60"/><path d="M20 56 H60"/><path d="M20 68 H48"/></g></svg>`,

    link: `<svg viewBox="0 0 80 100" xmlns="http://www.w3.org/2000/svg"><path d="M8 4 H52 L72 24 V92 Q72 96 68 96 H12 Q8 96 8 92Z" fill="#fff" stroke="#c8c8c8" stroke-width="2"/><circle cx="40" cy="58" r="18" fill="none" stroke="#1a73e8" stroke-width="4"/><path d="M22 58 H58 M40 40 Q30 58 40 76 M40 40 Q50 58 40 76" stroke="#1a73e8" stroke-width="3" fill="none"/></svg>`,

    apple: `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" d="M16.4 12.6c0-2.4 2-3.5 2.1-3.6-1.1-1.7-2.9-1.9-3.5-1.9-1.5-.2-2.9.9-3.7.9-.8 0-1.9-.9-3.2-.8-1.6 0-3.1 1-4 2.4-1.7 3-.4 7.4 1.2 9.8.8 1.2 1.8 2.5 3 2.4 1.2 0 1.7-.8 3.1-.8 1.5 0 1.9.8 3.2.8 1.3 0 2.1-1.2 2.9-2.4.9-1.4 1.3-2.7 1.3-2.8 0 0-2.4-1-2.4-4zM14 5.5c.7-.8 1.1-1.9 1-3-1 0-2.1.6-2.8 1.4-.6.7-1.2 1.8-1 2.9 1 .1 2.1-.5 2.8-1.3z"/></svg>`,
  };

  /* small UI glyphs */
  const g = (d, extra = "") => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" ${extra}>${d}</svg>`;
  window.GLYPH = {
    wifi: g('<path d="M2 8.5a15 15 0 0 1 20 0"/><path d="M5 12a10.5 10.5 0 0 1 14 0"/><path d="M8.5 15.5a5.5 5.5 0 0 1 7 0"/><circle cx="12" cy="19" r="1" fill="currentColor"/>'),
    wifiOff: g('<path d="M2 8.5a15 15 0 0 1 20 0" opacity=".35"/><path d="M5 12a10.5 10.5 0 0 1 14 0" opacity=".35"/><path d="M8.5 15.5a5.5 5.5 0 0 1 7 0" opacity=".35"/><path d="M3 3l18 18"/>'),
    battery: `<svg viewBox="0 0 30 14"><rect x=".5" y=".5" width="25" height="13" rx="3.5" fill="none" stroke="currentColor" opacity=".55"/><rect x="2.5" y="2.5" width="21" height="9" rx="2" fill="currentColor"/><rect x="26.5" y="4.5" width="2" height="5" rx="1" fill="currentColor" opacity=".55"/></svg>`,
    control: g('<rect x="3" y="4" width="18" height="7" rx="3.5"/><circle cx="16.5" cy="7.5" r="1.6" fill="currentColor"/><rect x="3" y="13" width="18" height="7" rx="3.5"/><circle cx="7.5" cy="16.5" r="1.6" fill="currentColor"/>'),
    search: g('<circle cx="11" cy="11" r="6.5"/><path d="M20 20l-4.2-4.2"/>'),
    back: g('<path d="M15 5l-7 7 7 7"/>'),
    fwd: g('<path d="M9 5l7 7-7 7"/>'),
    share: g('<path d="M12 3v12"/><path d="M8 7l4-4 4 4"/><path d="M6 11v8a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-8"/>'),
    clock: g('<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>'),
    person: g('<circle cx="12" cy="8" r="3.5"/><path d="M5 20c1-4 4-5.5 7-5.5s6 1.5 7 5.5"/>'),
    apps: g('<rect x="4" y="4" width="6" height="6" rx="1.5"/><rect x="14" y="4" width="6" height="6" rx="1.5"/><rect x="4" y="14" width="6" height="6" rx="1.5"/><rect x="14" y="14" width="6" height="6" rx="1.5"/>'),
    desktop: g('<rect x="3" y="4" width="18" height="12" rx="2"/><path d="M8 20h8M12 16v4"/>'),
    docs: g('<path d="M6 3h8l4 4v14H6z"/><path d="M14 3v4h4"/>'),
    download: g('<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5v8M8.5 12.5 12 16l3.5-3.5"/>'),
    folder: g('<path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>'),
    cloud: g('<path d="M7 18a4.5 4.5 0 0 1-.5-9A6 6 0 0 1 18 9.5 4.3 4.3 0 0 1 17.5 18z"/>'),
    home: g('<path d="M4 11l8-7 8 7"/><path d="M6 9.5V20h12V9.5"/>'),
    laptop: g('<rect x="5" y="5" width="14" height="10" rx="1.5"/><path d="M2.5 19h19"/>'),
    trash: g('<path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13"/>'),
    heart: g('<path d="M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.5A4 4 0 0 1 19 10c0 5.5-7 10-7 10z"/>'),
    note: g('<path d="M9 18V5l11-2v13"/><circle cx="6.5" cy="18" r="2.5"/><circle cx="17.5" cy="16" r="2.5"/>'),
    disc: g('<circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="2.5"/>'),
    mic: g('<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5.5 11a6.5 6.5 0 0 0 13 0M12 17.5V21"/>'),
    tv: g('<rect x="3" y="5" width="18" height="12" rx="2"/><path d="M8 20h8"/>'),
    film: g('<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M7 4v16M17 4v16M3 9h4M3 15h4M17 9h4M17 15h4"/>'),
    star: g('<path d="M12 3.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.9l-5.2 2.7 1-5.8L3.5 9.7l5.9-.9z"/>'),
    play: `<svg viewBox="0 0 24 24"><path d="M7 4.5v15l13-7.5z" fill="currentColor"/></svg>`,
    pause: `<svg viewBox="0 0 24 24"><rect x="6" y="4.5" width="4" height="15" rx="1" fill="currentColor"/><rect x="14" y="4.5" width="4" height="15" rx="1" fill="currentColor"/></svg>`,
    next: `<svg viewBox="0 0 24 24"><path d="M3 5.5v13l9-6.5zM12 5.5v13l9-6.5z" fill="currentColor"/></svg>`,
    prev: `<svg viewBox="0 0 24 24"><path d="M21 5.5v13l-9-6.5zM12 5.5v13L3 12z" fill="currentColor"/></svg>`,
    shuffle: g('<path d="M3 7h3.5c4 0 6 10 10 10H21M18 14l3 3-3 3M3 17h3.5c1.5 0 2.7-1.4 3.7-3M14 9.5c.8-1.5 1.7-2.5 3-2.5H21M18 4l3 3-3 3"/>'),
    repeat: g('<path d="M4 11V9a3 3 0 0 1 3-3h13M17 3l3 3-3 3M20 13v2a3 3 0 0 1-3 3H4M7 21l-3-3 3-3"/>'),
    volume: g('<path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z"/><path d="M15.5 9a4.5 4.5 0 0 1 0 6M18 6.5a8 8 0 0 1 0 11"/>'),
    sun: g('<circle cx="12" cy="12" r="4"/><path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M5.3 18.7l1.4-1.4M17.3 6.7l1.4-1.4"/>'),
    moon: g('<path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z"/>'),
    bt: g('<path d="M7 7l10 10-5 4V3l5 4L7 17"/>'),
    paint: g('<circle cx="12" cy="12" r="8.5"/><circle cx="8.5" cy="10" r="1.2" fill="currentColor"/><circle cx="12" cy="7.5" r="1.2" fill="currentColor"/><circle cx="15.5" cy="10" r="1.2" fill="currentColor"/>'),
    image: g('<rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="9" cy="10" r="1.8"/><path d="M21 16l-5-5-8 8"/>'),
    dock: g('<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M6 16.5h12"/>'),
    info: g('<circle cx="12" cy="12" r="8.5"/><path d="M12 11v5.5M12 7.8v.2"/>'),
    inbox: g('<path d="M3 13l3-8h12l3 8v6H3z"/><path d="M3 13h5l1.5 2.5h5L16 13h5"/>'),
    send: g('<path d="M21 3L10 14M21 3l-7 18-4-7-7-4z"/>'),
    compose: g('<path d="M4 20h4L19 9l-4-4L4 16z"/><path d="M13.5 6.5l4 4"/>'),
    list: g('<path d="M8 6h12M8 12h12M8 18h12"/><circle cx="4" cy="6" r=".8" fill="currentColor"/><circle cx="4" cy="12" r=".8" fill="currentColor"/><circle cx="4" cy="18" r=".8" fill="currentColor"/>'),
    grid: g('<rect x="4" y="4" width="7" height="7" rx="1.5"/><rect x="13" y="4" width="7" height="7" rx="1.5"/><rect x="4" y="13" width="7" height="7" rx="1.5"/><rect x="13" y="13" width="7" height="7" rx="1.5"/>'),
    ext: g('<path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/>'),
    lock: g('<rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>'),
    reload: g('<path d="M20 12a8 8 0 1 1-2.3-5.7M20 4v5h-5"/>'),
    pin: g('<path d="M9 4h6l-1 6 3 3H7l3-3zM12 13v7"/>'),
  };
})();

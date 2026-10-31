# adhiraj-os

my portfolio is a mac. live at **https://adhi.lol**

inspired by [dhrvie.lol](https://dhrvie.lol).

## apps

| app | what it does |
| --- | --- |
| Notes | everything about me (about me, things i believe, the cold dm story, growth experiments, side quests) |
| Finder | projects (oneassure, kissa, ekume, octupie, fenestra, grangers) with quick look, plus documents, downloads, trash |
| Music | my favorite songs with real 30s previews, shuffle, repeat, seek, volume |
| TV | shows i keep rewatching |
| Safari | my links |
| Mail | write to me (opens your email app) |
| Terminal | type `help` |
| System Settings | dark mode, accent color, wallpaper, dock size, wi-fi, about this mac |

also: dock magnification, draggable/resizable windows, minimize/zoom, menu bar menus, control center, spotlight (`ctrl/cmd + k`), lock screen, sleep, restart, deep links like `#notes/about-me`, mobile layout.

## edit your stuff

everything personal lives in **`data.js`**:

- `PROFILE`: name, links, photo (`me.jpg`)
- `NOTES`: simple markdown
- `PROJECTS`: finder > projects
- `SONGS`: just `{ title, artist }` works. art + preview get looked up automatically
- `SHOWS`: just `{ title }` works. poster + info get looked up from tvmaze

commit to `main` and github pages redeploys in about a minute.

## run it locally / in a codespace

no build step. open in a codespace and it serves on port 8080 automatically, or:

```bash
python3 -m http.server 8080
```

song previews come from the apple itunes search api, show info from tvmaze. app icons are hand-drawn svgs.

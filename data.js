/* =========================================================================
   EDIT ME. Everything personal on the site lives in this one file.

   - PROFILE: name, links, photo
   - NOTES: written in simple markdown (# heading, ## subheading, - bullet,
     **bold**, [link text](https://url))
   - PROJECTS: shown in Finder > Projects
   - SONGS: just type title + artist. Cover art and a 30s preview are
     looked up automatically from Apple Music if you leave art/preview out.
   - SHOWS: just type the title. Poster + info are looked up from TVMaze
     if you leave the rest out.
   ========================================================================= */

window.PROFILE = {
  name: "Adhiraj Tiwari",
  first: "Adhiraj",
  handle: "adhiraj",
  headline: "growth @ oneassure | making videos and fidgeting with agents",
  location: "Bengaluru, India",
  email: "adhirajtiwari01@gmail.com",
  photo: "me.jpg",
  links: {
    linkedin: "https://www.linkedin.com/in/rajishere",
    x: "https://x.com/adhiraj_xyz",
    github: "https://github.com/AbcAdhiraj",
  },
  status: "open to growth, gtm and founder's office roles",
};

window.NOTES = [
  {
    slug: "about-me",
    title: "about me",
    date: "2026-10-30T20:30:00",
    pinned: true,
    preview: "hey, i'm adhiraj",
    body: `
# about me

hey, i'm adhiraj. i do growth at [oneassure](https://www.oneassure.in) and i'm building [kissa](#finder/projects/kissa) on the side.

19, based in bengaluru. mostly making videos and fidgeting with agents.

## age 15: grangers arc
- started grangers, a little errands business for working professionals who didn't have the time
- walked dogs, picked up groceries, did whatever needed doing
- ran it from mar 2022 to aug 2024

## fenestra'24 arc
- president of fenestra'24
- led a 50+ person team for a fest with 300+ students from 10 schools
- built the event website myself

## cold dm arc
- messaged strangers at night for a month
- ended up with offers for 2 on-site roles and 1 remote one
- an idiot in motion will always beat a genius at rest

## 2026: the growth arc
- **octupie**: built their x presence from scratch, made product reels, grew a reddit profile to 100+ followers
- **kissa**: started it. ai that preserves life stories and voices. built an outbound ai agent that reached 200+ icps at a 15% reply rate
- **ekume**: head coordinator. 800+ students showed up, with geeksforgeeks, mlh and matiks as partners
- **oneassure**: growth intern. founder-led content on x, content templates for 60+ affiliate creators, instagram trend research, reddit marketing

## now
${"open to growth, gtm and founder's office roles."}

open the mail app or just dm me.

## socials
- [linkedin](https://www.linkedin.com/in/rajishere)
- [x / twitter](https://x.com/adhiraj_xyz)
- [github](https://github.com/AbcAdhiraj)
`,
  },
  {
    slug: "things-i-believe",
    title: "things i believe",
    date: "2026-10-29T23:10:00",
    preview: "growth opinions i'll defend in the group chat",
    body: `
# things i believe

growth opinions i'll defend in the group chat.

## recall > reach
- good gtm isn't about how many people saw you. it's about how many people remember you

## founders should be the content
- founder-led content beats a brand account almost every time. people follow people

## volume wins
- nobody gets good off 12 demos. i can promise you 3,000 attempts

## motion > genius
- an idiot in motion will always beat a genius at rest

## write like a human
- linkedin is full of ai-written posts. if it sounds like a template, i scroll

## open source is underrated
- swapped ilovepdf for ffmpeg + stirling pdf, and paid tools for opencode + gemma
`,
  },
  {
    slug: "cold-dm-story",
    title: "the cold dm story",
    date: "2026-10-27T01:20:00",
    preview: "messaging strangers at night got me 3 internships",
    body: `
# the cold dm story

messaging strangers at night got me 3 crazy internships.

- a month of cold dms
- result: offers for 2 on-site roles and 1 remote role. at 19

an idiot in motion will always beat a genius at rest.
`,
  },
  {
    slug: "growth-experiments",
    title: "growth experiments",
    date: "2026-10-25T18:45:00",
    preview: "stuff i've actually run, with numbers",
    body: `
# growth experiments

stuff i've actually run, with real numbers.

## outbound ai agent (kissa)
- built an agent that finds icps and writes the first message
- 200+ icps reached, 15% reply rate

## creator network (oneassure)
- content templates for 60+ affiliate creators, so every creator ships on-brand posts fast

## zero to x (octupie)
- built the x account from nothing, made product reels, grew a reddit profile to 100+ followers

## events as distribution (ekume)
- 800+ students, with geeksforgeeks, mlh and matiks as partners

## riding a trend (x)
- a nano banana post reached 2,000+ people on x within a couple of hours

## comment-to-get
- offered instinct invites to anyone who commented "i'm batman". people love a password
`,
  },
  {
    slug: "side-quests",
    title: "side quests",
    date: "2026-10-22T02:05:00",
    preview: "random things i built at weird hours",
    body: `
# side quests

random things i built at weird hours.

- a pdf text-to-speech script, built the night before a c viva
- kissa runs on supabase. cursor thinks i have commitment issues
- this website. it's a mac. it isn't actually a mac
`,
  },
];

window.PROJECTS = [
  {
    id: "oneassure",
    name: "oneassure",
    role: "Growth Intern",
    dates: "Oct 2026 - now",
    modified: "Today",
    color: "#2f7cf6",
    summary: "health insurance company, bengaluru.",
    bullets: [
      "founder-led content on x",
      "content templates for 60+ affiliate creators",
      "instagram trend research",
      "reddit marketing",
    ],
    link: "https://www.oneassure.in",
  },
  {
    id: "kissa",
    name: "kissa",
    role: "Founder",
    dates: "Jul 2026 - now",
    modified: "Yesterday",
    color: "#e0533b",
    summary: "kissa ai preserves life stories and voices. ai avatars that replicate a person's personality, tone and mannerisms.",
    bullets: [
      "built an outbound ai agent",
      "reached 200+ icps with a 15% reply rate",
      "stack includes supabase",
    ],
  },
  {
    id: "ekume",
    name: "ekume",
    role: "Head Coordinator",
    dates: "Aug 2026 - now",
    modified: "Yesterday",
    color: "#8a4dd6",
    summary: "student events and community.",
    bullets: [
      "800+ student attendees",
      "partnerships with geeksforgeeks, mlh and matiks",
    ],
  },
  {
    id: "octupie",
    name: "octupie",
    role: "Growth",
    dates: "Jul 2026 - Aug 2026 (remote)",
    modified: "Aug 2026",
    color: "#13a37f",
    summary: "an ai content team for instagram creators.",
    bullets: [
      "built the x presence from scratch",
      "made product reels",
      "grew a reddit profile to 100+ followers",
    ],
    link: "https://octupie.com",
  },
  {
    id: "fenestra-24",
    name: "fenestra-24",
    role: "President",
    dates: "2024",
    modified: "2024",
    color: "#f0a020",
    summary: "a school fest, run end to end.",
    bullets: [
      "led a 50+ person team",
      "300+ students from 10 schools",
      "built the event website",
    ],
  },
  {
    id: "grangers",
    name: "grangers",
    role: "Founder & CEO",
    dates: "Mar 2022 - Aug 2024",
    modified: "Aug 2024",
    color: "#6b7280",
    summary: "started at 15. ran errands for working professionals who didn't have the time.",
    bullets: ["walking dogs", "picking up groceries", "whatever else needed doing"],
  },
];

/* Random picks for now. Swap in your own: title + artist is enough. */
window.SONGS = [
  { title: "Blinding Lights", artist: "The Weeknd", album: "After Hours", ms: 200046,
    art: "https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/2b/b9/fe/2bb9fef5-d7f3-8345-25a9-db0e79fde4e4/20UMGIM11048.rgb.jpg/600x600bb.jpg",
    preview: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/0c/c5/03/0cc503b5-9299-b207-a13c-ba5358733c56/mzaf_18217607061023109918.plus.aac.p.m4a" },
  { title: "Kesariya", artist: "Pritam, Arijit Singh", album: "Brahmastra", ms: 268165,
    art: "https://is1-ssl.mzstatic.com/image/thumb/Music112/v4/9f/13/ca/9f13ca3b-e533-03e0-f19a-f0aaa774581d/196589311191.jpg/600x600bb.jpg",
    preview: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/38/4c/5c/384c5c8f-3ff8-e457-b2f7-3158ce108649/mzaf_12389299033886433185.plus.aac.p.m4a" },
  { title: "Heat Waves", artist: "Glass Animals", album: "Dreamland", ms: 238805,
    art: "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/da/8b/77/da8b7731-6f4f-eacf-5e74-8b23389eefa1/20UMGIM03371.rgb.jpg/600x600bb.jpg",
    preview: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/a3/4c/b9/a34cb911-40fc-5f0c-e862-14bd171a77aa/mzaf_384792072030970151.plus.aac.p.m4a" },
  { title: "Excuses", artist: "AP Dhillon", album: "Excuses", ms: 176233,
    art: "https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/47/47/ac/4747ac85-1658-64ae-bc82-220a4d6213d5/859747478890_cover.jpg/600x600bb.jpg",
    preview: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/e8/84/c8/e884c82f-7136-54d8-6754-6b45c6968f29/mzaf_11726474689882106813.plus.aac.p.m4a" },
  { title: "Do I Wanna Know?", artist: "Arctic Monkeys", album: "AM", ms: 272394,
    art: "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/69/9c/b5/699cb5d6-115c-ff73-9d26-e57ea4350d72/887828031795.png/600x600bb.jpg",
    preview: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/71/cb/ba/71cbbaa1-016b-0e73-dfc2-9f4ede9ddfc0/mzaf_16266777024198047150.plus.aac.p.m4a" },
  { title: "Ilahi", artist: "Pritam, Arijit Singh", album: "Yeh Jawaani Hai Deewani", ms: 228982,
    art: "https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/62/d6/74/62d67432-0670-631f-db6a-d4bac3adae4b/8902894353328_cover.jpg/600x600bb.jpg",
    preview: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/75/27/64/75276455-6751-e9d7-1187-b863a2ffefbc/mzaf_4313837125483855343.plus.aac.p.m4a" },
  { title: "Starboy", artist: "The Weeknd, Daft Punk", album: "Starboy", ms: 230461,
    art: "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/b5/92/bb/b592bb72-52e3-e756-9b26-9f56d08f47ab/16UMGIM67864.rgb.jpg/600x600bb.jpg",
    preview: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/11/71/d6/1171d6ad-3c96-e027-2af6-58028426588c/mzaf_15137631797407745471.plus.aac.p.m4a" },
  { title: "Sunflower", artist: "Post Malone, Swae Lee", album: "Spider-Man: Into the Spider-Verse", ms: 158040,
    art: "https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/4b/30/2c/4b302cb6-7a14-5464-4e97-0577e9d0be49/18UMGIM82277.rgb.jpg/600x600bb.jpg",
    preview: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/98/f0/d6/98f0d67e-f8bf-762d-cac7-1c6b3b6b35dd/mzaf_4543283896248560946.plus.aac.p.m4a" },
  { title: "Yellow", artist: "Coldplay", album: "Parachutes", ms: 269208,
    art: "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/f5/93/8c/f5938c49-964c-31d1-4b33-78b634f71fb7/190295978075.jpg/600x600bb.jpg",
    preview: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/66/f3/1a/66f31a76-a6ed-cb4c-f353-23310a7ae9a8/mzaf_10593596652344378873.plus.aac.p.m4a" },
  { title: "Pasoori", artist: "Ali Sethi, Shae Gill", album: "Pasoori", ms: 205797,
    art: "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/6d/77/83/6d778315-5390-1c2e-7da8-9dd955b75a7b/198846095561_s.jpg/600x600bb.jpg",
    preview: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/57/6a/63/576a63c5-312e-1d3f-5e2c-8b7651f553f2/mzaf_11059928705275793971.plus.aac.p.m4a" },
];
/* labels for the 4 big cards on the Music home screen */
window.MUSIC_MOODS = ["On Repeat", "Late Night", "Focus Mode", "Hype"];

/* Random picks for now. Swap in your own: title is enough. */
window.SHOWS = [
  { title: "Silicon Valley", year: "2014-2019", network: "HBO", genres: ["Comedy"], rating: 8.4, seasons: 6,
    poster: "https://static.tvmaze.com/uploads/images/original_untouched/215/538434.jpg",
    bg: "https://static.tvmaze.com/uploads/images/original_untouched/218/547148.jpg",
    summary: "In the high-tech gold rush of modern Silicon Valley, the people most qualified to succeed are the least capable of handling success.",
    url: "https://www.tvmaze.com/shows/143/silicon-valley" },
  { title: "TVF Pitchers", year: "2015-2022", network: "ZEE5", genres: ["Drama", "Comedy"], seasons: 2,
    poster: "https://static.tvmaze.com/uploads/images/original_untouched/27/67766.jpg",
    bg: "https://static.tvmaze.com/uploads/images/original_untouched/226/565199.jpg",
    summary: "Four friends quit their jobs to enter the start-up world and launch their own company.",
    url: "https://www.tvmaze.com/shows/7329/tvf-pitchers" },
  { title: "Mad Men", year: "2007-2015", network: "AMC", genres: ["Drama"], rating: 8.1, seasons: 7,
    poster: "https://static.tvmaze.com/uploads/images/original_untouched/2/5589.jpg",
    bg: "https://static.tvmaze.com/uploads/images/original_untouched/5/14647.jpg",
    summary: "The conflicted world of Don Draper, the biggest ad man in the business, and his colleagues at Sterling Cooper.",
    url: "https://www.tvmaze.com/shows/385/mad-men" },
  { title: "Scam 1992", year: "2020", network: "SonyLIV", genres: ["Drama", "Crime"], seasons: 1,
    poster: "https://static.tvmaze.com/uploads/images/original_untouched/521/1304758.jpg",
    bg: "https://static.tvmaze.com/uploads/images/original_untouched/277/693757.jpg",
    summary: "Set in 1980s and 90s Bombay, the rise and fall of stockbroker Harshad Mehta.",
    url: "https://www.tvmaze.com/shows/51127/scam-1992-the-harshad-mehta-story" },
  { title: "The Office", year: "2005-2013", network: "NBC", genres: ["Comedy"], rating: 8.5, seasons: 9,
    poster: "https://static.tvmaze.com/uploads/images/original_untouched/481/1204342.jpg",
    bg: "https://static.tvmaze.com/uploads/images/original_untouched/220/550710.jpg",
    summary: "A mockumentary-style look at the daily lives of the employees of the Dunder Mifflin paper company.",
    url: "https://www.tvmaze.com/shows/526/the-office" },
  { title: "Panchayat", year: "2020-", network: "Prime Video", genres: ["Drama", "Comedy"], seasons: 4,
    poster: "https://static.tvmaze.com/uploads/images/original_untouched/517/1293627.jpg",
    summary: "An engineering graduate, short on better options, becomes secretary of a panchayat office in a remote village.",
    url: "https://www.tvmaze.com/shows/47014/panchayat" },
  { title: "Shark Tank India", year: "2021-", network: "Sony TV", genres: ["Reality", "Business"], seasons: 5,
    poster: "https://static.tvmaze.com/uploads/images/original_untouched/609/1522728.jpg",
    summary: "India's aspiring entrepreneurs pitch their ideas to a panel of investors, hoping to walk away with a deal.",
    url: "https://www.tvmaze.com/shows/56668/shark-tank-india" },
  { title: "Breaking Bad", year: "2008-2013", network: "AMC", genres: ["Drama", "Crime"], rating: 9.2, seasons: 5,
    poster: "https://static.tvmaze.com/uploads/images/original_untouched/501/1253519.jpg",
    bg: "https://static.tvmaze.com/uploads/images/original_untouched/219/547904.jpg",
    summary: "A chemistry teacher in New Mexico turns to a life of crime.",
    url: "https://www.tvmaze.com/shows/169/breaking-bad" },
];

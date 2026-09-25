# isx: the talk

A [Slidev](https://sli.dev) deck telling the case for
[isx](https://github.com/Sanne/incus-spawn): a machine of its own for every
coding agent, with none of your credentials inside.

## Run it

```sh
npm install
tools/fetch-memes.sh   # the Simpsons frames, see below
npm run dev            # builds the Motion Canvas clip, then serves on http://localhost:3030
```

Press `p` for presenter mode (speaker notes, next slide, timer). `npm run build`
makes a static site in `dist/`; `npm run export` makes a PDF.

## Images that aren't in this repository

The "Homer solved this in 1995" slide and the reveal after the audience game
show three frames from *The Simpsons*, "King-Size Homer" (season 7, episode 7,
1995). They're shown in the talk as commentary, with attribution, but not
committed here: publishing copies in a repository is a different thing from
showing them on stage. `tools/fetch-memes.sh` downloads them into
`public/memes/` (git-ignored). To get them by hand, save each as
`public/memes/homer-<timestamp>.jpg`:

| Frame | Caption on the slide | Source |
|---|---|---|
| `homer-929220.jpg` | 1. Replace your finger | <https://frinkiac.com/img/S07E07/929220.jpg> ([in context](https://frinkiac.com/caption/S07E07/929220)) |
| `homer-978436.jpg` | 2. Automate it | <https://frinkiac.com/img/S07E07/978436.jpg> ([in context](https://frinkiac.com/caption/S07E07/978436)) |
| `homer-1062478.jpg` | 3. Come back to this | <https://frinkiac.com/img/S07E07/1062478.jpg> ([in context](https://frinkiac.com/caption/S07E07/1062478)) |

Without them the deck still works: the Homer slide falls back to an original
drawing of the drinking bird, and the reveal to a line of terminal text.

The trench-coat figure on the USB-stick slide (`public/img/usb-stranger.jpg`)
was generated with Google Gemini and is credited on the slide; without the
file, the slide falls back to an original drawing.

## Working on it

- `STORYBOARD.md`: the story, act by act, and the claims register (what each
  claim rests on).
- `ANIMATIONS.md`: how the animations work, and what's still to build.
- `slides.md`: the deck; speaker notes carry the sources and the caveats.
- `node tools/audit.mjs <dir>`: screenshots every slide with all clicks
  revealed and flags overflow. `node tools/shot.mjs <dir> 12:3` screenshots
  one slide at one click (`12:3@8000` waits 8 s, for animations).

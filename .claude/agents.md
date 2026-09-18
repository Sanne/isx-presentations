# isx-presentations

Reveal.js presentations about [isx](https://isx.run) (incus-spawn) — a CLI tool for managing isolated Incus-based development environments for AI coding agents.

## Project structure

- `index.html` — self-contained reveal.js presentation, loads reveal.js from CDN. No build step; open in a browser to present.
- Preview with `python3 -m http.server 8080` and open `http://localhost:8080`.

## Presentation style preferences

- **Theme**: Midnight blue palette — deep navy background (#0f1729), silver text, soft sky-blue/gold/violet/coral accents. Not neon or harsh.
- **Font weight**: Semibold (600) for headings, not heavy/black. Keep it refined and readable.
- **Content density**: Every slide must fit without scrollbars or clipping on a standard screen. When a slide overflows, reduce content or split — never rely on scrolling.
- **Tone**: Technical team demo — practical, not salesy. Show real commands and YAML, not abstract promises.
- **Diagrams over prose**: Prefer visual flow diagrams, tables, and feature-card grids over long paragraphs.
- **Code examples**: Use real isx commands and YAML. Quote arguments that contain special shell characters like `?`.
- **Accuracy**: Don't overstate security claims — say "we don't give credentials to the container" rather than "it's impossible to obtain them." Don't call agents "trusted" — all agent-generated code is untrusted.
- **Consistency**: Use `isx ask` (not `isx help`) for the AI help command. Refer to the website as `isx.run`.
- **Priorities**: Credential isolation (the MITM proxy) is the standout feature. CoW branching + storage sharing is the second pillar. Caching is "prudent" — only verified/signed/immutable artifacts are cached.
- **macOS**: Always mention macOS support with the custom lightweight Linux appliance — it's important for team adoption.
- **Agent-agnostic**: isx works with Claude, Pi, Bob, Codex, and any HTTPS-based agent. Don't frame it as Claude-only.
- **Local-first**: A core conviction, not a limitation. Your hardware, your network, your repos.

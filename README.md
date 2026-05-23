# Aman Pandey — Portfolio

Personal portfolio for a Unity game developer. Built from scratch with React, TypeScript, and React Three Fiber.

## Tech stack

- React 18 + TypeScript + Vite
- GSAP (ScrollTrigger — free tier)
- Three.js + React Three Fiber + Drei
- CSS custom properties for theming

## Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm run preview
```

## Content

Edit [`src/content/portfolio.ts`](src/content/portfolio.ts) to update bio, projects, career, and links.

## Resume

- **Source:** [`public/resume.html`](public/resume.html) — edit projects, copy, and image paths here.
- **PDF:** [`public/resume.pdf`](public/resume.pdf) — regenerate after HTML changes (Chrome/Edge):

```bash
# Windows (Chrome or Edge)
& "${env:ProgramFiles}\Google\Chrome\Application\chrome.exe" --headless --disable-gpu --no-pdf-header-footer --print-to-pdf="public/resume.pdf" "file:///D:/Git_PortFolio/portfolio/public/resume.html"
```

Bump `resumeVersion` in `portfolio.ts` when you replace the PDF so browsers fetch the new file.

## 3D hero

The hero uses **Hoodie Character** by [Quaternius](https://poly.pizza/m/gKLBoRsyKe) (CC0), stored at `public/models/hoodie-character.glb`. On load it walks in, waves, then idles.

## License & copyright

**All Rights Reserved** — this project is **not** open source for reuse.

| Document | Purpose |
|----------|---------|
| [LICENSE](LICENSE) | Legal terms — no redistribution without permission |
| [COPYRIGHT.md](COPYRIGHT.md) | What is protected; Git & release rules |
| [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md) | CC0 model, fonts, npm deps |

- **No forking/republishing** of this repo, code, screenshots, or release APKs without written permission from Aman Pandey (`aman.pandey12062002@gmail.com`).
- **GitHub Releases** should use the [release template](.github/release_template.md) so copyright terms appear on each release page.

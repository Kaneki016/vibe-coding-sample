# Vibe Coding — Landing Pages

A collection of numbered landing page projects, each self-contained in its own folder. Built with vanilla HTML, CSS, and JavaScript — no frameworks, no build tools.

## Projects

| # | Folder | Description | Status |
|---|---|---|---|
| 01 | [`01-vibe-coding/`](./01-vibe-coding/) | Vibe Coding Masterclass — agentic software orchestration course | Live |
| 02 | [`02-luxury-realestate/`](./02-luxury-realestate/) | LUMIÈRE — Ultra luxury real estate showcase | Live |

## Repository Structure

```
vibe-coding-sample/
├── 01-vibe-coding/
│   ├── index.html          # Full single-page layout
│   ├── style.css           # Design system + component styles
│   ├── app.js              # All interactive logic
│   └── assets/
│       ├── vibe_coding_hero.png
│       └── vibe_master.png
├── 02-next-project/
│   └── index.html          # Placeholder
└── README.md
```

Each project folder is fully independent — no shared dependencies between projects.

## Running a Project Locally

Open any project's `index.html` directly in a browser, or serve with a static file server from the project root:

```bash
# Python — serve project 01
python -m http.server 8080 --directory 01-vibe-coding

# Node.js (npx) — serve project 01
npx serve 01-vibe-coding
```

---

## 01 — Vibe Coding Masterclass

**Folder:** `01-vibe-coding/`

A premium dark-mode landing page for a course on AI-assisted/agentic software development.

### Page Sections

| Section | ID | Description |
|---|---|---|
| Navigation | `#main-nav` | Sticky glassmorphic navbar with mobile slide-out drawer |
| Hero | `#hero-section` | Headline, CTAs, metrics, and floating-badge visual card |
| Trust Banner | — | Alumni company logos |
| Philosophy | `#philosophy` | 4 core pillars of vibe coding |
| Interactive Playground | `#playground` | Live AI terminal simulator (see below) |
| Curriculum | `#curriculum` | 4-module accordion roadmap |
| Instructor | `#instructor` | Alex Chen bio and credentials |
| Pricing | `#pricing` | ROI calculator + two pricing tiers |
| Apply | `#apply` | Cohort application form with confetti on submit |
| FAQ | `#faq` | Expandable FAQ accordion |

### Key Features

**Interactive AI Terminal Playground**
A simulated VS Code-style IDE workspace with three selectable demo modes:
- `glass_card.css` — 3D glassmorphic payment card with mouse-tilt mechanics
- `synthwave.css` — Cyberpunk audio visualizer with toggle-able animated bars
- `stats_chart.css` — Glassmorphic dashboard chart with animated bar fill

Each mode runs: typed prompt → AI agent thinking logs → typewriter code output → live interactive widget.

`Ctrl+B` / `Cmd+B` toggles the sidebar while the terminal is in view.

**ROI Calculator** — dual-slider widget computing hours reclaimed, efficiency gain, and yearly value.

**Canvas Animations** — particle network background (60 particles, mouse-repelled), cursor glow, and physics-based confetti on form submit.

**Form Validation** — inline field errors, 1.5s async simulation, success modal. Clicking a pricing plan pre-selects the form dropdown.

### Design System

CSS custom properties defined in `style.css:7` (`:root`):

| Token | Value | Usage |
|---|---|---|
| `--primary` | `#7c3aed` | Electric violet — buttons, accents |
| `--accent-cyan` | `#06b6d4` | Glowing cyan — highlights, active states |
| `--accent-magenta` | `#ec4899` | Hot magenta — featured badge, synthwave |
| `--accent-green` | `#10b981` | Neon emerald — success, live indicators |
| `--glass-bg` | `rgba(255,255,255,0.02)` | Card background |
| `--glass-blur` | `16px` | Backdrop blur on glass cards |

Typography: **Space Grotesk** (headings) + **Plus Jakarta Sans** (body) via Google Fonts.

### Responsive Breakpoints

| Breakpoint | Changes |
|---|---|
| `≤ 1024px` | Single-column hero, stacked instructor/pricing/apply grids |
| `≤ 768px` | Hamburger nav, stacked terminal workspace, single-column calculator and footer |

### Pricing Tiers

| Plan | Price | Highlights |
|---|---|---|
| The Self-Paced Vibe | $299 one-time | 4 modules, prompt templates, Discord access |
| The Conductor Masterclass | $699 one-time | Everything above + 6 live cohort workshops, swarm sandbox codebase, certificate |

# //VIBECODE Masterclass — Landing Page

A premium, fully static landing page for the **Vibe Coding Masterclass** — a course on agentic software orchestration and AI-assisted development. Built with vanilla HTML, CSS, and JavaScript; no frameworks, no build tools.

## Project Structure

```
vibe-coding-sample/
├── index.html          # Full single-page layout (all sections)
├── style.css           # Design system + all component styles
├── app.js              # All interactive logic (vanilla JS)
└── assets/
    ├── vibe_coding_hero.png   # Hero section image
    └── vibe_master.png        # Instructor avatar
```

## Page Sections

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

## Key Features

### Interactive AI Terminal Playground
The centerpiece of the page — a simulated VS Code-style IDE workspace (`app.js: setupVibeTerminal`) that demonstrates three live demo modes selectable from the sidebar file explorer:

- **`glass_card.css`** — 3D glassmorphic payment card with mouse-tilt mechanics
- **`synthwave.css`** — Cyberpunk audio visualizer player with toggle-able animated bars
- **`stats_chart.css`** — Glassmorphic dashboard analytics chart with animated bar fill

Each mode plays through: typed user prompt → sequential AI agent "thinking" logs → typewriter code output → rendered interactive widget preview.

Keyboard shortcut `Ctrl+B` (or `Cmd+B`) toggles the sidebar while the terminal is in the viewport.

### ROI Calculator
Dual-slider widget (`app.js: setupROICalculator`) that computes hours reclaimed per week, efficiency increase percentage, and estimated yearly value based on current coding hours and target speedup multiplier.

### Canvas Animations
- **Particle network** (`setupParticlesBg`) — 60 particles connected by proximity lines, mouse-repelled
- **Cursor glow** (`setupCursorGlow`) — Radial violet/cyan gradient that follows the cursor
- **Confetti engine** (`launchConfetti`) — Physics-based confetti shot from both bottom corners on successful form submission

### Form & Validation
Application form (`setupApplicationForm`) with inline field-level error states, a 1.5s async simulation, and a success modal overlay. Selecting a pricing plan from the pricing cards automatically pre-selects the corresponding dropdown.

## Design System

Defined entirely via CSS custom properties in `:root` (`style.css:7`):

| Token | Value | Usage |
|---|---|---|
| `--primary` | `#7c3aed` | Electric violet — buttons, accents |
| `--accent-cyan` | `#06b6d4` | Glowing cyan — highlights, active states |
| `--accent-magenta` | `#ec4899` | Hot magenta — featured badge, synthwave |
| `--accent-green` | `#10b981` | Neon emerald — success, live indicators |
| `--glass-bg` | `rgba(255,255,255,0.02)` | Card background |
| `--glass-blur` | `16px` | Backdrop blur on glass cards |

Typography uses **Space Grotesk** (headings) and **Plus Jakarta Sans** (body) via Google Fonts.

## Responsive Breakpoints

| Breakpoint | Layout changes |
|---|---|
| `≤ 1024px` | Single-column hero, stacked instructor/pricing/apply grids |
| `≤ 768px` | Hamburger nav, stacked terminal workspace, single-column calculator and footer |

## Running Locally

No dependencies to install. Open `index.html` directly in a browser, or serve with any static file server:

```bash
# Python
python -m http.server 8080

# Node.js (npx)
npx serve .
```

## Pricing Tiers

| Plan | Price | Highlights |
|---|---|---|
| The Self-Paced Vibe | $299 one-time | 4 modules, prompt templates, Discord access |
| The Conductor Masterclass | $699 one-time | Everything above + 6 live cohort workshops, swarm sandbox codebase, certificate |

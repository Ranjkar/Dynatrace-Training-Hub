# Dynatrace Training Hub

A self-contained Dynatrace learning platform: **8 courses, 108 modules** covering DQL, troubleshooting,
dashboards, SRE & FinOps, Gen2 → Gen3 migration, Extensions 2.0, and building Dynatrace Apps.

Built with Astro + Starlight and deployed to GitHub Pages. No server, no database, no third-party
runtime dependency — every page, script, and stylesheet is served from this repository.

## Courses

| Course | Modules | Tracks |
|---|---:|---:|
| From Zero to Hero | 21 | 5 |
| DQL Cookbook | 10 | 1 |
| Troubleshooting Playbook | 8 | 1 |
| Dashboard Gallery | 7 | 1 |
| SRE & FinOps | 6 | 1 |
| Gen2 → Gen3 Migration Guide | 25 | 6 |
| Dynatrace Extensions | 16 | 3 |
| Dynatrace Apps | 15 | 4 |
| **Total** | **108** | |

The full manifest — every course, track, module, route, and recovery status — lives in
[`src/data/catalogue.json`](src/data/catalogue.json).

## Content provenance

All 108 lesson pages were recovered from the original course platform's own server-rendered output
(the production site's React Flight payloads, fetched directly and parsed — no scraping of rendered
pixels, no guesswork) and converted into this site's Markdown content collection. Every lesson in
this repository is marked `recovery: recovered-original` in its frontmatter. None of the lesson text
is AI-generated filler; the DQL queries, troubleshooting playbooks, and migration guidance are the
original author's material, rehosted independently. A small number of incidental references to the
source platform's own name (used as an example value inside sample content) were replaced with
generic placeholders so the deployed site carries no trace of, or dependency on, the original domain.

The interactive "Bug Hunt" challenge featured on the original site was not recoverable through static
extraction (it is a fully client-rendered mini-game with no server-rendered text payload) and was not
reconstructed here.

## Prerequisites

- Node.js 22+
- npm

## Local development

```sh
npm install
npm run dev
```

The site runs at `http://localhost:4321/Dynatrace-Training-Hub/` (the `/Dynatrace-Training-Hub/` base
path matches the GitHub Pages project URL, so local dev mirrors production routing).

## Testing

```sh
npm test
```

Runs `scripts/audit-content.test.mjs`, which verifies:

- the catalogue contains exactly 8 courses and 108 modules, matching the mandated inventory,
- every module in the catalogue has a corresponding, substantive (non-placeholder) content file on disk,
- no route is duplicated,
- no shipped file references the original source domain.

## Type checking

```sh
npm run check
```

## Production build

```sh
npm run build
npm run preview
```

`build` outputs a fully static site to `dist/`, built with the same `/Dynatrace-Training-Hub/` base
path used in production — `preview` serves that exact output locally so you can verify deep links,
refreshes, and asset paths before deploying.

## Deployment

`.github/workflows/deploy.yml` builds, tests, and deploys automatically on every push to `main`, via
GitHub Actions → GitHub Pages (the repository's Pages source must be set to "GitHub Actions" under
**Settings → Pages**). Every route is pre-rendered to a static `index.html`, so deep links and browser
refreshes work without any server-side routing.

## Architecture

- **Framework:** Astro + Starlight (static site generation; Starlight provides the sidebar, full-text
  search via Pagefind, dark/light theme toggle, code-block copy buttons, and accessible navigation
  out of the box).
- **Content:** `src/content/docs/<course>/<track>/<module>.md` — one Markdown file per lesson, with
  frontmatter (`course`, `track`, `moduleNumber`, `lessonType`, `recovery`) validated by the Zod
  schema in `src/content.config.ts`.
- **Catalogue:** `src/data/catalogue.json` is the single source of truth for the course/track/module
  structure; the sidebar (`astro.config.mjs`), the homepage course grid
  (`src/components/CourseGrid.astro`), course overview pages, and the audit test all read from it.
- **Progress tracking:** `public/progress.js` — a small vanilla-JS, localStorage-backed "mark complete"
  checkbox per lesson and a live completion counter per course. No framework, no server state.
- **Styling:** `src/styles/custom.css` — brand accent colors, visible focus rings, and a
  `prefers-reduced-motion` override layered on top of Starlight's accessible defaults.

## Known limitations

- The original site's "Bug Hunt" interactive challenge is not reproduced (see *Content provenance*).
- Inline SVG diagrams embedded in some lessons are kept as raw HTML passthrough; they render correctly
  but are not part of the Markdown-native content pipeline.
- Course accent colors are applied to the homepage cards only, not per-page theming.

## Troubleshooting

- **Links 404 locally but work in `dev`:** make sure you're testing against `npm run preview` (which
  serves the base-pathed production build), not opening `dist/index.html` directly from disk.
- **Sidebar order looks wrong after adding content:** Starlight's `autogenerate` sorts a directory's
  files alphabetically; lesson filenames are numerically prefixed (`00-…`, `01-…`) specifically so
  this sort order matches the intended lesson sequence without manual `sidebar.order` frontmatter.
- **Search index missing results after a content change:** Pagefind indexes the production build, not
  the dev server — run `npm run build` before testing search locally via `preview`.

## License

MIT — see [LICENSE](LICENSE).

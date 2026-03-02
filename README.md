# Raschka-style Blog

A minimal Astro + MDX blog for notebook-style writeups, math rendering (KaTeX), and code-heavy posts.

## Structure

```text
.
├── notebooks/              # source data + exploratory notebooks
├── public/notebooks/       # published notebook artifacts (served statically)
├── scripts/                # utility scripts (e.g. map export)
└── src/
	├── content/blog/       # blog posts (MD/MDX frontmatter)
	├── layouts/            # site + post layouts
	├── pages/              # Astro routes
	└── styles/             # global stylesheet
```

## Commands

| Command | Description |
| :-- | :-- |
| `npm install` | Install dependencies |
| `npm run dev` | Start local dev server |
| `npm run check` | Run Astro type/content checks |
| `npm run build` | Build static output to `dist/` |
| `npm run preview` | Preview production build |

## Notes

- Blog post schema is defined in `src/content/config.ts`.
- Dates are parsed and validated as `Date` values via `z.coerce.date()`.
- KaTeX styles are loaded locally from the installed `katex` package.
- Generated/temporary notebook checkpoint files are excluded via `.gitignore`.

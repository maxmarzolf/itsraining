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
| `npm run notebook:publish -- --input <file.html>` | Copy notebook HTML export into `public/notebooks/` |
| `npm run notebook:new -- --title "..." --html <file.html>` | Scaffold an MDX blog post that embeds the notebook |

## Add a Notebook Post (Fast Path)

1. Export your `.ipynb` to HTML (from VS Code/Jupyter UI).
2. Publish the HTML into static assets:

	```bash
	npm run notebook:publish -- --input notebooks/new_york_city/nyc_median_rent_2025.html
	```

3. Create the blog post scaffold:

	```bash
	npm run notebook:new -- --title "NYC Median Rent 2025" --html nyc_median_rent_2025.html --description "Exploring median asking rent by NYC area"
	```

4. Run locally and review:

	```bash
	npm run dev
	```

This creates a new file in `src/content/blog/` with an embedded iframe at `/notebooks/<file.html>`.

## Notes

- Blog post schema is defined in `src/content/config.ts`.
- Dates are parsed and validated as `Date` values via `z.coerce.date()`.
- KaTeX styles are loaded locally from the installed `katex` package.
- Generated/temporary notebook checkpoint files are excluded via `.gitignore`.

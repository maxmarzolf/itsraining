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

Run these commands from anywhere inside the repo (project root preferred).

1. Export your `.ipynb` to HTML (from VS Code/Jupyter UI).
2. Publish the HTML into static assets:

	```bash
	npm run notebook:publish -- --input notebooks/new_york_city/nyc_median_rent_2025.html
	```

	This copies the file to `public/notebooks/<name>.html`.

3. Create the blog post scaffold:

	```bash
	npm run notebook:new -- --title "NYC Median Rent 2025" --html nyc_median_rent_2025.html --description "Exploring median asking rent by NYC area"
	```

	This command now validates that `public/notebooks/nyc_median_rent_2025.html` exists before creating the post.

4. Run locally and review:

	```bash
	npm run dev
	```

This creates a new file in `src/content/blog/` with an embedded iframe at `/notebooks/<file.html>`.
Generated notebook embeds use a wide layout and auto-resize to reduce inner scrolling.

## Rain Animation Controls

The landing page has a matrix-style rain animation. To tune or experiment with the animation parameters in real time, add `?rain-controls` to the URL:

```
http://localhost:4321/?rain-controls
```

This reveals a **⚙ Rain** button in the navbar that opens a floating control panel with sliders for every animation parameter (drop speed, trail length, color, sway, ripples, splashes, etc.).

**Workflow:**

1. Navigate to `/?rain-controls` in the browser.
2. Click **⚙ Rain** in the navbar to open the panel.
3. Adjust sliders in real time — changes are instant, no reload needed.
4. Click any value label to type an exact number.
5. When satisfied, click **Copy Config** to copy the current settings as JSON.
6. Paste the JSON into the `RC` object in `src/pages/index.astro` to freeze the new defaults.
7. Update the reset-defaults block in the same file to match.

The config object is also accessible as `window.__RC` in the browser console.

## Notes

- Blog post schema is defined in `src/content/config.ts`.
- Dates are parsed and validated as `Date` values via `z.coerce.date()`.
- KaTeX styles are loaded locally from the installed `katex` package.
- Generated/temporary notebook checkpoint files are excluded via `.gitignore`.

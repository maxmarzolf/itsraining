import fs from 'node:fs';
import path from 'node:path';

const args = process.argv.slice(2);

function getArg(flag) {
  const index = args.indexOf(flag);
  if (index === -1) return null;
  return args[index + 1] ?? null;
}

function findProjectRoot(startDir) {
  let currentDir = path.resolve(startDir);

  while (true) {
    const packageJson = path.join(currentDir, 'package.json');
    const publicNotebooksDir = path.join(currentDir, 'public', 'notebooks');

    if (fs.existsSync(packageJson) && fs.existsSync(path.dirname(publicNotebooksDir))) {
      return currentDir;
    }

    const parentDir = path.dirname(currentDir);
    if (parentDir === currentDir) {
      return null;
    }

    currentDir = parentDir;
  }
}

function addNotebookCellStyling(html) {
  const styleBlock = `
<link href="https://fonts.googleapis.com/css2?family=Baloo+2:wght@400;500;600;700;800&display=swap" rel="stylesheet">
<style id="itsraining-notebook-cell-style">
/* ── Reset Jupyter variables to match the blog theme ── */
:root {
  --jp-layout-color0: #f4f5f7;
  --jp-layout-color1: #f4f5f7;
  --jp-content-font-family: 'Baloo 2', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  --jp-ui-font-family: 'Baloo 2', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  --jp-code-font-family: 'Baloo 2', 'JetBrains Mono', 'Fira Code', 'Fira Mono', Menlo, Monaco, 'Courier New', monospace;
  --jp-notebook-padding: 0;
  --jp-cell-padding: 0;
  --color-accent: #005fb8;
  --color-surface: #f5f5f5;
  --color-border: #000000;
}

body.jp-Notebook {
  background: #f4f5f7;
  padding: 0;
  margin: 0;
  font-family: 'Baloo 2', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  line-height: 1.7;
  color: #000000;
}

/* ── Notebook container ── */
.jp-Notebook {
  max-width: 800px;
  margin: 0 auto;
  padding: 0 1.5rem;
  background: #f4f5f7;
  box-sizing: border-box;
}

/* ── Cell layout ── */
.jp-Cell {
  margin: 1.5rem 0;
  padding: 0;
  border: none;
  background: transparent;
}

.jp-Cell.jp-mod-selected {
  box-shadow: none;
}

/* Hide Jupyter sidebar collapsers */
.jp-Collapser {
  display: none !important;
}

/* ── Markdown cells ── */
.jp-MarkdownCell .jp-RenderedMarkdown {
  font-family: 'Baloo 2', system-ui, sans-serif;
  font-size: 1rem;
  line-height: 1.7;
  color: #000000;
  padding: 0;
}

.jp-RenderedMarkdown h1 {
  font-size: 2.5rem;
  line-height: 1.2;
  margin-bottom: 0.75rem;
  font-weight: 800;
  letter-spacing: -0.03em;
  color: #000000;
  border-bottom: 2px solid #000000;
  padding-bottom: 1.5rem;
  margin-top: 2.5rem;
}

.jp-RenderedMarkdown h2 {
  font-size: 1.75rem;
  margin: 2.5rem 0 1rem;
  padding-bottom: 0.4rem;
  border-bottom: 2px solid var(--color-accent);
  font-weight: 700;
  color: #000000;
}

.jp-RenderedMarkdown h3 {
  font-size: 1.35rem;
  margin: 2rem 0 0.75rem;
  font-weight: 700;
  color: #000000;
}

.jp-RenderedMarkdown p {
  margin-bottom: 1.5rem;
}

.jp-RenderedMarkdown a {
  color: #005fb8;
  text-decoration: underline;
  text-decoration-thickness: 1.5px;
  text-underline-offset: 2px;
}

.jp-RenderedMarkdown a:hover {
  color: #003f7a;
}

.jp-RenderedMarkdown ul,
.jp-RenderedMarkdown ol {
  margin-bottom: 1.5rem;
  padding-left: 1.5rem;
}

.jp-RenderedMarkdown li {
  margin-bottom: 0.5rem;
}

.jp-RenderedMarkdown blockquote {
  border-left: 4px solid var(--color-accent);
  padding: 1rem 1.5rem;
  margin: 1.5rem 0;
  background: var(--color-surface);
  color: #2f2f2f;
  font-style: italic;
  border-radius: 0 6px 6px 0;
}

/* ── Code cells ── */
.jp-CodeCell .jp-Cell-inputWrapper {
  border: 1px solid var(--color-border);
  border-left: 4px solid var(--color-accent);
  border-radius: 6px;
  overflow: hidden;
  background: var(--color-surface);
}

.jp-CodeCell .jp-InputArea {
  background: transparent;
}

.jp-CodeCell .jp-Editor {
  font-family: 'Baloo 2', 'JetBrains Mono', 'Fira Code', Menlo, Monaco, 'Courier New', monospace;
  font-size: 0.875rem;
  padding: 1.25rem;
  background: var(--color-surface);
}

.jp-CodeCell .highlight pre {
  font-family: 'Baloo 2', 'JetBrains Mono', 'Fira Code', Menlo, Monaco, 'Courier New', monospace;
  font-size: 0.875rem;
  line-height: 1.6;
  margin: 0;
  padding: 1.25rem;
  background: transparent;
  border: none;
}

/* ── Output area ── */
.jp-OutputArea {
  background: transparent;
  padding: 0;
}

.jp-OutputArea-child {
  padding: 0.5rem 0;
}

.jp-OutputArea-output {
  font-family: 'Baloo 2', system-ui, sans-serif;
  font-size: 0.875rem;
}

.jp-RenderedText pre {
  font-family: 'Baloo 2', 'JetBrains Mono', 'Fira Code', Menlo, Monaco, 'Courier New', monospace;
  font-size: 0.875rem;
  padding: 0.75rem 1.25rem;
  background: var(--color-surface);
  border-radius: 6px;
  border: 1px solid #e0e0e0;
}

/* ── Dataframe tables ── */
.jp-OutputArea-output {
  overflow-x: auto;
}

table.dataframe {
  width: auto;
  min-width: 100%;
  border-collapse: collapse;
  margin: 1rem 0;
  font-size: 0.9rem;
  font-family: 'Baloo 2', system-ui, sans-serif;
  white-space: nowrap;
}

table.dataframe th {
  background: #f4f5f7;
  color: #000000;
  padding: 0.75rem 1rem;
  text-align: left;
  font-weight: 600;
  text-transform: uppercase;
  font-size: 0.8rem;
  letter-spacing: 0.05em;
  border-bottom: 2px solid var(--color-border);
}

table.dataframe td {
  padding: 0.75rem 1rem;
  border-bottom: 1px solid #e0e0e0;
}

table.dataframe tr:hover td {
  background: var(--color-surface);
}

/* ── Images ── */
.jp-OutputArea img {
  max-width: 100%;
  height: auto;
  border-radius: 6px;
}

/* ── Plotly & interactive outputs ── */
.jp-OutputArea .plotly-graph-div,
.jp-OutputArea .folium-map {
  border-radius: 6px;
  overflow: hidden;
}

/* ── Hide empty cells & prompts ── */
.jp-Cell.jp-mod-noOutputs.jp-mod-noInput {
  display: none;
}

.jp-Cell-inputWrapper .jp-InputPrompt,
.jp-Cell-outputWrapper .jp-OutputPrompt {
  display: none;
}

/* ── Horizontal rules ── */
.jp-RenderedMarkdown hr {
  border: none;
  border-top: 2px solid var(--color-border);
  margin: 2.5rem 0;
}
</style>
`;

  if (html.includes('id="itsraining-notebook-cell-style"')) {
    html = html.replace(/<link[^>]*itsraining[^>]*>\s*/g, '');
    html = html.replace(/<style id="itsraining-notebook-cell-style">[\s\S]*?<\/style>\s*/g, '');
  }

  if (html.includes('</head>')) {
    return html.replace('</head>', `${styleBlock}</head>`);
  }

  return `${styleBlock}${html}`;
}

const inputArg = getArg('--input') ?? args[0];
const outputArg = getArg('--output');

if (!inputArg) {
  console.error('Usage: npm run notebook:publish -- --input <path/to/notebook.html> [--output custom-name.html]');
  process.exit(1);
}

const projectRoot = findProjectRoot(process.cwd());

if (!projectRoot) {
  console.error('Could not find project root (expected package.json and public/). Run this inside the repository.');
  process.exit(1);
}

const inputPath = path.isAbsolute(inputArg)
  ? inputArg
  : path.resolve(projectRoot, inputArg);

if (!fs.existsSync(inputPath)) {
  console.error(`Input file not found: ${inputPath}`);
  process.exit(1);
}

if (path.extname(inputPath).toLowerCase() !== '.html') {
  console.error('Input must be an .html file (export your .ipynb to HTML first).');
  process.exit(1);
}

const publicNotebooksDir = path.resolve(projectRoot, 'public/notebooks');
fs.mkdirSync(publicNotebooksDir, { recursive: true });

const outputName = outputArg ? path.basename(outputArg) : path.basename(inputPath);
const outputPath = path.resolve(publicNotebooksDir, outputName);

const sourceHtml = fs.readFileSync(inputPath, 'utf8');
const styledHtml = addNotebookCellStyling(sourceHtml);
fs.writeFileSync(outputPath, styledHtml, 'utf8');

console.log(`Published notebook: ${outputPath}`);
console.log(`URL path: /notebooks/${outputName}`);

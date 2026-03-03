import fs from 'node:fs';
import path from 'node:path';

const args = process.argv.slice(2);

function getArg(flag) {
  const index = args.indexOf(flag);
  if (index === -1) return null;
  return args[index + 1] ?? null;
}

function slugify(value) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

const title = getArg('--title');
const html = getArg('--html');
const description = getArg('--description') || 'Notebook analysis post';
const explicitSlug = getArg('--slug');

if (!title || !html) {
  console.error('Usage: npm run notebook:new -- --title "My Notebook" --html my-notebook.html [--description "..."] [--slug my-slug]');
  process.exit(1);
}

const slug = explicitSlug || slugify(title);
const date = new Date().toISOString().slice(0, 10);
const projectRoot = process.cwd();
const postPath = path.resolve(projectRoot, 'src/content/blog', `${slug}.mdx`);

if (fs.existsSync(postPath)) {
  console.error(`Post already exists: ${postPath}`);
  process.exit(1);
}

const content = `---
title: "${title.replaceAll('"', '\\"')}"
date: "${date}"
description: "${description.replaceAll('"', '\\"')}"
---

This notebook is available as an interactive HTML export.

<iframe
  src="/notebooks/${html}"
  title="${title.replaceAll('"', '&quot;')}"
  width="100%"
  height="900"
  style={{ border: '1px solid rgba(0,0,0,0.12)', borderRadius: '8px', background: '#fff' }}
></iframe>

[Open notebook in a new tab](/notebooks/${html})
`;

fs.mkdirSync(path.dirname(postPath), { recursive: true });
fs.writeFileSync(postPath, content, 'utf8');

console.log(`Created post: ${postPath}`);
console.log(`Notebook URL used: /notebooks/${html}`);

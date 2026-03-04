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

function findProjectRoot(startDir) {
  let currentDir = path.resolve(startDir);

  while (true) {
    const packageJson = path.join(currentDir, 'package.json');
    const blogDir = path.join(currentDir, 'src', 'content', 'blog');

    if (fs.existsSync(packageJson) && fs.existsSync(blogDir)) {
      return currentDir;
    }

    const parentDir = path.dirname(currentDir);
    if (parentDir === currentDir) {
      return null;
    }

    currentDir = parentDir;
  }
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
const projectRoot = findProjectRoot(process.cwd());

if (!projectRoot) {
  console.error('Could not find project root (expected package.json and src/content/blog). Run this inside the repository.');
  process.exit(1);
}

const htmlName = path.basename(html);
const publishedHtmlPath = path.resolve(projectRoot, 'public', 'notebooks', htmlName);

if (!fs.existsSync(publishedHtmlPath)) {
  console.error(`Notebook HTML not found in public/notebooks: ${publishedHtmlPath}`);
  console.error('Run: npm run notebook:publish -- --input <path/to/notebook.html>');
  process.exit(1);
}

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

The full analysis is available as an interactive notebook export.

<div className="notebook-embed notebook-embed--wide">
  <iframe
    src="/notebooks/${htmlName}"
    title="${title.replaceAll('"', '&quot;')}"
    loading="lazy"
    className="notebook-embed__frame"
  ></iframe>
</div>

[Open notebook in a new tab](/notebooks/${htmlName})
`;

fs.mkdirSync(path.dirname(postPath), { recursive: true });
fs.writeFileSync(postPath, content, 'utf8');

console.log(`Created post: ${postPath}`);
console.log(`Notebook URL used: /notebooks/${htmlName}`);

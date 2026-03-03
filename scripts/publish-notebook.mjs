import fs from 'node:fs';
import path from 'node:path';

const args = process.argv.slice(2);

function getArg(flag) {
  const index = args.indexOf(flag);
  if (index === -1) return null;
  return args[index + 1] ?? null;
}

const inputArg = getArg('--input') ?? args[0];
const outputArg = getArg('--output');

if (!inputArg) {
  console.error('Usage: npm run notebook:publish -- --input <path/to/notebook.html> [--output custom-name.html]');
  process.exit(1);
}

const projectRoot = process.cwd();
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

const outputName = outputArg || path.basename(inputPath);
const outputPath = path.resolve(publicNotebooksDir, outputName);

fs.copyFileSync(inputPath, outputPath);

console.log(`Published notebook: ${outputPath}`);
console.log(`URL path: /notebooks/${outputName}`);

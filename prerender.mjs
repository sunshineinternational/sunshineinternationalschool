import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const toAbs = (p) => path.resolve(__dirname, p);

const template = fs.readFileSync(toAbs('dist/index.html'), 'utf-8');
const { render } = await import('./dist/server/entry-server.js');

// These are the pages we want Google to find perfectly
const routesToPrerender = [
  '/',
  '/about',
  '/academics',
  '/admission',
  '/teachers',
  '/notices',
  '/contact',
  '/gallery',
  '/events',
  '/house-system'
];

(async () => {
  // pre-render each route...
  for (const url of routesToPrerender) {
    const appHtml = await render(url);

    const html = template.replace(`<!--app-html-->`, appHtml);

    // Write to the main dist folder for Vercel
    const filePath = `dist${url === '/' ? '/index' : url}.html`;
    const absPath = toAbs(filePath);
    const dirPath = path.dirname(absPath);
    
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
    fs.writeFileSync(absPath, html);
    console.log('✅ pre-rendered:', filePath);
  }

  console.log('🚀 All pages pre-rendered and ready for Vercel!');
})();

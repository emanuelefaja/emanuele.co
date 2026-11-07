// Imports emanuele.cc (WordPress) into Markdown files for this site.
//
//   npm run import            add posts/pages that don't exist locally yet
//   npm run import -- --force overwrite everything (loses local edits!)
//
// Posts go to src/posts/<slug>.md, pages to src/pages/<slug>.md, and every
// uploaded image/video/PDF to src/media/<year>/<month>/<file>.
// Once emanuele.cc is switched off this script has done its job and can be deleted.

import { mkdir, writeFile, access, rename } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { parseHTML } from 'linkedom';
import TurndownService from 'turndown';
import { gfm } from 'turndown-plugin-gfm';

const WP = 'https://emanuele.cc';
const ROOT = path.resolve(import.meta.dirname, '..');
const SRC = path.join(ROOT, 'src');
const CACHE = path.join(ROOT, '.cache', 'wordpress');
const FORCE = process.argv.includes('--force');

// WordPress pages worth keeping as-is. About became the home page (src/index.njk),
// Bookshelf + Blogs were merged into src/pages/reading.md, and Newsletter, Random
// and Test are intentionally left behind.
const PAGES = ['readinglist', 'uncopyright', 'work-like-mad'];

const HAS_FFMPEG = !spawnSync('ffmpeg', ['-version']).error;
const MONTH_HEADING = /^((January|February|March|April|May|June|July|August|September|October|November|December) )?\d{4}$/;

// ---------------------------------------------------------------- helpers

const exists = (p) => access(p).then(() => true, () => false);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// WordPress.com rate-limits bursts (HTTP 429), so back off and retry.
async function get(url, options, tries = 6) {
  for (let attempt = 1; ; attempt++) {
    const res = await fetch(url, options);
    if ((res.status !== 429 && res.status < 500) || attempt === tries) return res;
    const wait = Number(res.headers.get('retry-after')) * 1000 || 2000 * 2 ** attempt;
    console.log(`  ${res.status} on ${url.slice(0, 80)}… retrying in ${Math.round(wait / 1000)}s`);
    await sleep(wait);
  }
}

async function getAll(type, fields) {
  const out = [];
  for (let page = 1; ; page++) {
    const res = await get(`${WP}/wp-json/wp/v2/${type}?per_page=100&page=${page}&_fields=${fields}`);
    if (!res.ok) throw new Error(`${res.status} fetching ${type} page ${page}`);
    out.push(...(await res.json()));
    if (page >= Number(res.headers.get('x-wp-totalpages') || 1)) return out;
  }
}

const decode = (html) => parseHTML(`<p>${html}</p>`).document.querySelector('p').textContent.trim();

const yaml = (s) => JSON.stringify(s); // JSON strings are valid YAML scalars

// "https://i0.wp.com/emanuele.cc/wp-content/uploads/2023/01/x.jpeg?resize=…" -> "2023/01/x.jpeg"
function uploadsPath(url) {
  const m = url?.match(/^(?:https?:)?\/\/(?:i\d\.wp\.com\/)?(?:www\.)?emanuele\.cc\/wp-content\/uploads\/([^?#]+)/);
  return m ? decodeURIComponent(m[1]) : null;
}

// ---------------------------------------------------------------- media

const media = new Map(); // uploads path -> local path (relative to src/media)

function localMedia(up) {
  if (!media.has(up)) media.set(up, HAS_FFMPEG ? up.replace(/\.mov$/i, '.mp4') : up);
  return '/media/' + encodeURI(media.get(up));
}

async function download(url, headers = {}) {
  const res = await get(url, { headers });
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  const type = res.headers.get('content-type') || '';
  const buf = Buffer.from(await res.arrayBuffer());
  return { type, buf };
}

async function fetchMedia(up, local) {
  const dest = path.join(SRC, 'media', local);
  if (await exists(dest)) return 'cached';
  await mkdir(path.dirname(dest), { recursive: true });
  const origin = `${WP}/wp-content/uploads/${encodeURI(up)}`;

  if (/\.(jpe?g|png)$/i.test(up)) {
    // Jetpack's image CDN gives us a sensibly sized copy (max 1600px wide, never upscaled).
    try {
      const { type, buf } = await download(
        `https://i0.wp.com/emanuele.cc/wp-content/uploads/${encodeURI(up)}?w=1600&ssl=1`,
        { accept: 'image/png,image/jpeg;q=0.9' },
      );
      if (/image\/(jpeg|png)/.test(type)) return writeFile(dest, buf).then(() => 'resized');
    } catch { /* fall through to the original */ }
  }

  if (/\.mov$/i.test(up) && HAS_FFMPEG) {
    const tmp = path.join(CACHE, path.basename(up));
    await mkdir(CACHE, { recursive: true });
    if (!(await exists(tmp))) await writeFile(tmp, (await download(origin)).buf);
    const r = spawnSync('ffmpeg', [
      '-y', '-loglevel', 'error', '-i', tmp,
      '-vf', "scale='min(1280,iw)':-2", '-c:v', 'libx264', '-crf', '28', '-preset', 'medium',
      '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-b:a', '96k', '-movflags', '+faststart', dest + '.part.mp4',
    ], { stdio: 'inherit' });
    if (r.status !== 0) throw new Error(`ffmpeg failed for ${up}`);
    await rename(dest + '.part.mp4', dest);
    return 'transcoded';
  }

  await writeFile(dest, (await download(origin)).buf);
  return 'original';
}

// ---------------------------------------------------------------- HTML -> Markdown

const td = new TurndownService({
  headingStyle: 'atx',
  codeBlockStyle: 'fenced',
  hr: '---',
  emDelimiter: '*',
  bulletListMarker: '-',
});
td.use(gfm);
// Elements we build ourselves (figures with captions, galleries, embeds, video) stay as HTML.
td.addRule('keep-html', {
  filter: (node) => node.nodeType === 1 && node.hasAttribute('data-keep'),
  replacement: (_content, node) => {
    node.removeAttribute('data-keep');
    return `\n\n${node.outerHTML}\n\n`;
  },
});

function el(document, tag, attrs = {}, children = []) {
  const node = document.createElement(tag);
  // null/undefined = leave the attribute out; '' = boolean attribute (controls, data-keep…).
  // (linkedom serialises attributes newest-first, so add them in reverse to keep src first.)
  for (const [k, v] of Object.entries(attrs).reverse()) if (v != null) node.setAttribute(k, v);
  for (const c of children) node.append(c);
  return node;
}

const cleaned = new WeakSet();

function cleanImg(document, img) {
  const src = img.getAttribute('src') || '';
  const up = uploadsPath(src);
  let url = up ? localMedia(up) : src.replace(/^https?:\/\/i\d\.wp\.com\/([^?]+).*$/, 'https://$1');
  return mark(el(document, 'img', {
    src: url,
    alt: img.getAttribute('alt') || '',
    width: img.getAttribute('width'),
    height: img.getAttribute('height'),
    loading: 'lazy',
  }));
}

function mark(node) {
  cleaned.add(node);
  return node;
}

function caption(document, figure) {
  const fc = figure.querySelector(':scope > figcaption');
  if (!fc || !fc.textContent.trim()) return null;
  const out = el(document, 'figcaption');
  out.innerHTML = fc.innerHTML.trim();
  return out;
}

function convert(html, { monthHeadings = false } = {}) {
  const { document } = parseHTML(`<!doctype html><html><body>${html}</body></html>`);
  const body = document.body;
  const stats = { externalImages: 0 };

  // Links: make internal links relative, point uploads at local copies, drop JS links.
  for (const a of body.querySelectorAll('a[href]')) {
    const href = a.getAttribute('href').trim();
    if (href.startsWith('javascript:')) { a.replaceWith(...a.childNodes); continue; }
    const up = uploadsPath(href);
    if (up) {
      // An image wrapped in a link to its own file: just keep the image.
      if (a.querySelector('img') && !a.textContent.trim()) { a.replaceWith(...a.childNodes); continue; }
      a.setAttribute('href', localMedia(up));
    } else {
      const m = href.match(/^(?:https?:)?\/\/(?:www\.)?emanuele\.cc(\/[^?]*)?(\?[^#]*)?(#.*)?$/);
      if (m) {
        // Image wrapped in a link to its WordPress attachment page: unwrap.
        if (a.querySelector('img') && !a.textContent.trim()) { a.replaceWith(...a.childNodes); continue; }
        a.setAttribute('href', (m[1] || '/') + (m[3] || ''));
      }
    }
  }

  // Footnotes (Modern Footnotes plugin): <sup>n</sup><span class="…__note">text</span>
  const notes = [];
  for (const sup of body.querySelectorAll('sup.modern-footnotes-footnote')) {
    const next = sup.nextElementSibling;
    const note = next?.classList.contains('modern-footnotes-footnote__note')
      ? next
      : body.querySelector(`.modern-footnotes-footnote__note[data-mfn="${sup.getAttribute('data-mfn')}"]`);
    notes.push(note ? note.innerHTML : '');
    note?.remove();
    sup.replaceWith(document.createTextNode(`FNREF${notes.length}X`));
  }

  // Galleries -> <figure class="gallery"> with plain <img>s.
  for (const g of body.querySelectorAll('figure.wp-block-gallery, div.wp-block-jetpack-tiled-gallery')) {
    const imgs = [...g.querySelectorAll('img')].map((img) => cleanImg(document, img));
    const cap = g.querySelector('figcaption.blocks-gallery-caption');
    const fig = el(document, 'figure', { class: 'gallery', 'data-keep': '' }, imgs);
    if (cap?.textContent.trim()) fig.append(el(document, 'figcaption', {}, [cap.textContent.trim()]));
    g.replaceWith(fig);
  }

  // Embeds: YouTube iframes stay (privacy-friendly domain); anything else becomes a link.
  for (const f of body.querySelectorAll('figure.wp-block-embed')) {
    const iframe = f.querySelector('iframe');
    if (iframe) {
      const src = iframe.getAttribute('src').replace('://www.youtube.com/embed/', '://www.youtube-nocookie.com/embed/').replace(/\?feature=oembed$/, '');
      f.replaceWith(el(document, 'iframe', {
        src, title: iframe.getAttribute('title'), loading: 'lazy', allowfullscreen: '', 'data-keep': '',
      }));
    } else {
      const url = f.textContent.trim();
      f.replaceWith(el(document, 'p', {}, [el(document, 'a', { href: url }, [url])]));
    }
  }

  // Video.
  for (const f of body.querySelectorAll('figure.wp-block-video')) {
    const v = f.querySelector('video');
    const up = uploadsPath(v?.getAttribute('src'));
    const video = el(document, 'video', {
      src: up ? localMedia(up) : v?.getAttribute('src'),
      width: v?.getAttribute('width'), height: v?.getAttribute('height'),
      controls: '', preload: 'metadata', playsinline: '',
    });
    const cap = caption(document, f);
    f.replaceWith(el(document, 'figure', { 'data-keep': '' }, cap ? [video, cap] : [video]));
  }

  // Images: captioned ones stay as <figure>, the rest become Markdown images.
  for (const f of body.querySelectorAll('figure.wp-block-image')) {
    const img = f.querySelector('img');
    if (!img) { f.remove(); continue; }
    const clean = cleanImg(document, img);
    const cap = caption(document, f);
    f.replaceWith(cap ? el(document, 'figure', { 'data-keep': '' }, [clean, cap]) : clean);
  }
  for (const img of body.querySelectorAll('img')) if (!cleaned.has(img)) img.replaceWith(cleanImg(document, img));
  stats.externalImages = [...body.querySelectorAll('img')].filter((i) => /^https?:/.test(i.getAttribute('src'))).length;

  // Tables and pullquotes: unwrap the WordPress <figure>.
  for (const f of body.querySelectorAll('figure.wp-block-table, figure.wp-block-pullquote')) {
    const cap = caption(document, f);
    f.querySelector(':scope > figcaption')?.remove();
    f.replaceWith(...f.childNodes, ...(cap ? [el(document, 'p', {}, [el(document, 'em', {}, [cap.textContent])])] : []));
  }

  // Reading list: "<p><strong>April 2026</strong></p>" -> "## April 2026".
  if (monthHeadings) {
    for (const p of body.querySelectorAll('p')) {
      const text = p.textContent.trim();
      if (MONTH_HEADING.test(text) && p.querySelector('strong')) p.replaceWith(el(document, 'h2', {}, [text]));
    }
  }

  // Empty lists left behind by the block editor.
  for (const list of body.querySelectorAll('ul, ol')) if (!list.querySelector('li')) list.remove();

  // Strip WordPress attributes from everything we didn't build ourselves.
  for (const node of body.querySelectorAll('*')) {
    if (node.closest('[data-keep]')) continue;
    for (const { name } of [...node.attributes]) {
      if (['class', 'style', 'id', 'target', 'rel', 'role', 'tabindex'].includes(name) || name.startsWith('data-') || name.startsWith('aria-')) {
        node.removeAttribute(name);
      }
    }
  }

  let md = td.turndown(body.innerHTML);
  md = md.replace(/ *FNREF(\d+)X/g, '[^$1]');
  if (notes.length) {
    md += '\n\n' + notes.map((n, i) => `[^${i + 1}]: ${td.turndown(n).replace(/\n+/g, ' ').trim()}`).join('\n');
  }
  md = md.replace(/[ \t]+$/gm, '').replace(/\n{3,}/g, '\n\n').trim() + '\n';
  return { md, stats };
}

// ---------------------------------------------------------------- run

export { convert };
if (import.meta.url === pathToFileURL(process.argv[1]).href) await main();

async function main() {
const categories = await getAll('categories', 'id,slug,name,count,description');
const catSlug = new Map(categories.map((c) => [c.id, c.slug]));
await mkdir(path.join(SRC, '_data'), { recursive: true });
// Named "topics" (not "categories") so it doesn't collide with each post's own
// `categories:` front matter in Eleventy's data cascade.
await writeFile(
  path.join(SRC, '_data', 'topics.json'),
  JSON.stringify(
    categories.filter((c) => c.count > 0).map((c) => ({ slug: c.slug, name: decode(c.name).replace(/\.$/, ''), description: c.description.trim() })),
    null, 2,
  ) + '\n',
);

const posts = await getAll('posts', 'id,date,slug,title,categories,content');
const pages = (await getAll('pages', 'id,date,slug,title,content')).filter((p) => PAGES.includes(p.slug));

let written = 0, skipped = 0, external = 0;
await mkdir(path.join(SRC, 'posts'), { recursive: true });
await mkdir(path.join(SRC, 'pages'), { recursive: true });

for (const p of posts) {
  const file = path.join(SRC, 'posts', `${p.slug}.md`);
  const { md, stats } = convert(p.content.rendered);
  external += stats.externalImages;
  if (!FORCE && (await exists(file))) { skipped++; continue; }
  const cats = p.categories.map((id) => catSlug.get(id)).filter(Boolean);
  const front = [
    '---',
    `title: ${yaml(decode(p.title.rendered))}`,
    `date: ${p.date}Z`, // WordPress local time, kept as-is so dates match the old site
    `categories: [${cats.join(', ')}]`,
    '---',
  ].join('\n');
  await writeFile(file, `${front}\n\n${md}`);
  written++;
}

for (const p of pages) {
  const file = path.join(SRC, 'pages', `${p.slug}.md`);
  const { md } = convert(p.content.rendered, { monthHeadings: p.slug === 'readinglist' });
  if (!FORCE && (await exists(file))) { skipped++; continue; }
  const title = decode(p.title.rendered).replace(/\.$/, '');
  await writeFile(file, `---\ntitle: ${yaml(title)}\npermalink: /${p.slug}/\n---\n\n${md}`);
  written++;
}

// Download media with a small worker pool.
const queue = [...media.entries()];
const results = {};
const failures = [];
await Promise.all(Array.from({ length: 6 }, async () => {
  for (let item; (item = queue.shift()); ) {
    try {
      const r = await fetchMedia(...item);
      results[r] = (results[r] || 0) + 1;
    } catch (e) {
      failures.push(`${item[0]}: ${e.message}`);
    }
  }
}));

console.log(`posts: ${posts.length}, pages: ${pages.length}, files written: ${written}, skipped (exist): ${skipped}`);
console.log(`media: ${media.size} referenced`, results, HAS_FFMPEG ? '' : '(ffmpeg not found: .mov kept as-is)');
if (external) console.log(`images still hosted elsewhere: ${external}`);
if (failures.length) { console.log(`media failures (${failures.length}):\n  ` + failures.join('\n  ')); process.exitCode = 1; }
}

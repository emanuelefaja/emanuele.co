// Imports the unpublished drafts from a WordPress.com export (.xml, WXR) into
// src/_drafts/ as Markdown. Nothing here is built into the site: Eleventy ignores
// directories starting with an underscore, so these are an archive, not pages.
//
//   npm run import:drafts                 reads ~/Downloads/emanuele.WordPress.*.xml
//   npm run import:drafts -- path/to.xml  reads a specific export
//   npm run import:drafts -- --force      overwrite drafts that already exist
//
// Drafts that are only earlier versions of posts already live on emanuele.co are
// skipped (see DUPLICATES below); they're listed in the output so nothing vanishes
// silently. To publish one later, move the file into src/posts/ and add a permalink.

import { readFile, writeFile, readdir, mkdir, access } from 'node:fs/promises';
import { DOMParser } from 'linkedom';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { convert, downloadAllMedia, mediaReport, yaml, decode, SRC } from './import-wordpress.mjs';

const HOME = process.env.HOME;
const DEFAULT_XML = `${HOME}/Downloads/emanuele.WordPress.2026-11-16.xml`;
const DEST = path.join(SRC, '_drafts');
const FORCE = process.argv.includes('--force');
const XML_PATH = process.argv.slice(2).find((a) => !a.startsWith('--')) || DEFAULT_XML;

// Drafts that duplicate something already published on emanuele.co. Matched by slug,
// or by title when the draft never had a slug. Reason is printed in the summary.
const DUPLICATES = [
  { slug: 'stop-and-think', reason: 'identical to live /stop-and-think-2/' },
  { slug: 'ten-useful-stoic-exercises', reason: 'earlier version of /ten-useful-stoic-exercises-2/' },
  { slug: 'luxury', reason: 'earlier version of /on-luxury/' },
  { slug: 'thought-experiment-a-transparent-society', reason: 'earlier version of /thought-experiment-a-transparent-society-3/' },
  { slug: 'enough', reason: 'earlier version of /how-much-is-enough/' },
  { slug: 'talent-concentration-and-determination', reason: 'earlier version of /talent-concentration-and-determination-2/' },
  { slug: 'the-comprehensive-guide-to-the-80-20-rule', reason: 'earlier version of /80-20-rule/' },
  { slug: 'pyramids', reason: 'earlier version of /pyramids-a-waste-of-time/' },
  { slug: 'the-importance-of-having-a-life-philosophy', reason: 'earlier version of /the-importance-of-having-a-life-philosophy-2/' },
  { slug: 'edge-of-tomorrow', reason: 'earlier version of /lessons-from-edge-of-tomorrow/' },
  { slug: 'do-nothing', reason: 'earlier version of /on-doing-nothing/' },
  { slug: 'overcoming-resistance', reason: 'earlier version of /overcoming-resistance-2/' },
  { slug: 'washington-post-test', reason: 'earlier version of /the-washington-post-test/ (3 cut paragraphs)' },
  { slug: 'worse', reason: 'earlier version of /it-could-be-worse/' },
  { title: /^Automating Risk Registers at UNDP \(OLD/i, reason: 'superseded by published v1 and v2' },
];
const duplicateOf = (slug, title) =>
  DUPLICATES.find((d) => (d.slug && d.slug === slug) || (d.title && d.title.test(title)));

// ---------------------------------------------------------------- helpers

const exists = (p) => access(p).then(() => true, () => false);

function slugify(title) {
  return title
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/['’]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80)
    .replace(/-+$/, '');
}

const plain = (html) =>
  html.replace(/<[^>]+>/g, ' ').replace(/&[a-z#0-9]+;/gi, ' ').replace(/\s+/g, ' ').trim();

// "2022-12-26 10:00:00" -> "2022-12-26T10:00:00Z" (WordPress local time, kept as-is,
// same convention as scripts/import-wordpress.mjs).
const iso = (s) => (s ? s.trim().replace(' ', 'T') + 'Z' : null);

// ---------------------------------------------------------------- run

const xml = await readFile(XML_PATH, 'utf8');
const items = [...new DOMParser().parseFromString(xml, 'text/xml').querySelectorAll('channel > item')];
const topics = new Set(JSON.parse(await readFile(path.join(SRC, '_data', 'topics.json'), 'utf8')).map((t) => t.slug));

const drafts = [];
for (const item of items) {
  const text = (tag) => item.querySelector(tag)?.textContent ?? '';
  if (text('wp\\:post_type, post_type') !== 'post') continue;
  const status = text('wp\\:status, status');
  if (status === 'publish') continue;
  drafts.push({
    id: text('wp\\:post_id, post_id'),
    status,
    title: decode(text('title')).replace(/\s+/g, ' ').trim() || '(untitled)',
    slug: text('wp\\:post_name, post_name').trim(),
    date: iso(text('wp\\:post_date, post_date')),
    modified: iso(text('wp\\:post_modified, post_modified')),
    categories: [...item.querySelectorAll('category[domain="category"]')]
      .map((c) => c.getAttribute('nicename'))
      .filter((s) => topics.has(s)),
    html: text('content\\:encoded, encoded'),
  });
}

// Existing slugs, so a generated one never lands on top of another file.
const taken = new Set((await readdir(path.join(SRC, 'posts'))).filter((f) => f.endsWith('.md')).map((f) => f.slice(0, -3)));
await mkdir(DEST, { recursive: true });
for (const f of await readdir(DEST)) if (f.endsWith('.md')) taken.add(f.slice(0, -3));

let written = 0, skipped = 0, empty = 0, words = 0;
const skippedList = [];
const collisions = [];

for (const d of drafts.sort((a, b) => (a.modified || '').localeCompare(b.modified || ''))) {
  const dup = duplicateOf(d.slug, d.title);
  if (dup) { skipped++; skippedList.push(`${d.title} — ${dup.reason}`); continue; }

  let slug = d.slug || slugify(d.title) || 'untitled';
  if (taken.has(slug)) {
    const unique = `${slug}-draft`;
    collisions.push(`${slug} → ${unique} (${d.title})`);
    slug = unique;
  }
  taken.add(slug);

  const file = path.join(DEST, `${slug}.md`);
  if (!FORCE && (await exists(file))) { skipped++; skippedList.push(`${d.title} — already imported at ${path.relative(SRC, file)}`); continue; }

  const { md, stats } = convert(d.html);
  const wc = plain(md).split(' ').filter(Boolean).length;
  words += wc;
  if (wc === 0) empty++;

  const front = [
    '---',
    // permalink: false stops Eleventy writing the page; the collection flag keeps it
    // out of /notes/. Eleventy 3 has no built-in `draft:` support, so these two are
    // what actually keeps drafts unpublished — don't drop them.
    'permalink: false',
    'eleventyExcludeFromCollections: true',
    `title: ${yaml(d.title)}`,
    `date: ${d.date ?? d.modified}`,
    `categories: [${d.categories.join(', ')}]`,
    `modified: ${d.modified ?? d.date}`,
    '---',
  ].join('\n');
  const note = `<!-- WordPress draft ${d.id} from emanuele.cc, imported ${new Date().toISOString().slice(0, 10)}. ` +
    `Unpublished: ${wc} words. Excluded from the build by the front matter above. -->`;
  await writeFile(file, `${front}\n\n${note}\n\n${md}`);

  written++;
  if (stats.externalImages) console.log(`  note: ${slug} has ${stats.externalImages} image(s) hosted off-site`);
}

const downloaded = await downloadAllMedia();

console.log(`\nexport: ${path.relative(process.cwd(), XML_PATH)}`);
console.log(`drafts in file: ${drafts.length}, written: ${written}, skipped: ${skipped} ${FORCE ? '' : `(or already present)`}`);
console.log(`words imported: ${words.toLocaleString()}${empty ? `, of which ${empty} draft(s) are empty` : ''}`);
mediaReport(downloaded, 0);
if (collisions.length) console.log(`slug collisions (renamed):\n  ${collisions.join('\n  ')}`);
if (skippedList.length) console.log(`skipped:\n  ${skippedList.join('\n  ')}`);
console.log(`\nnext: \`git add src/_drafts src/media\` — nothing here is published.`);

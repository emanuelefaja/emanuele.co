// Total words across all posts, for the home page.
import { readdir, readFile } from 'node:fs/promises';

export default async function () {
  let words = 0;
  for (const file of await readdir('src/posts')) {
    if (!file.endsWith('.md')) continue;
    const text = (await readFile(`src/posts/${file}`, 'utf8'))
      .replace(/^---\n[\s\S]*?\n---\n/, '') // front matter
      .replace(/<[^>]+>/g, ' ') // HTML
      .replace(/\]\([^)]*\)/g, ']'); // link targets
    words += (text.match(/[\p{L}\p{N}][\p{L}\p{N}'’-]*/gu) || []).length;
  }
  return { words };
}

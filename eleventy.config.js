import { readFileSync } from 'node:fs';
import footnote from 'markdown-it-footnote';
import { heatmap } from './lib/heatmap.js';

const topics = JSON.parse(readFileSync('src/_data/topics.json', 'utf8'));
const topicNames = new Map(topics.map((t) => [t.slug, t.name]));

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const formats = {
  long: new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }),
  short: { format: (d) => `${d.getUTCDate()} ${MONTHS[d.getUTCMonth()]}` }, // "2 Sep" (en-GB says "Sept")
  medium: { format: (d) => `${d.getUTCDate()} ${MONTHS[d.getUTCMonth()]} ${d.getUTCFullYear()}` }, // "2 Sep 2025"
};

export default function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy({ 'src/media': 'media', 'src/style.css': 'style.css', 'src/favicon.svg': 'favicon.svg' });
  eleventyConfig.amendLibrary('md', (md) => {
    md.use(footnote);
    // Footnote markers as plain superscript numbers: ¹ rather than [1].
    md.renderer.rules.footnote_caption = (tokens, idx) => {
      const { id, subId } = tokens[idx].meta;
      return `${id + 1}${subId > 0 ? `:${subId}` : ''}`;
    };
  });

  // All posts, newest first.
  eleventyConfig.addCollection('posts', (api) =>
    api.getFilteredByGlob('src/posts/*.md').sort((a, b) => b.date - a.date),
  );

  eleventyConfig.addFilter('date', (date, format = 'long') => {
    const d = new Date(date);
    if (format === 'iso') return d.toISOString().slice(0, 10);
    if (format === 'rfc822') return d.toUTCString();
    return formats[format].format(d);
  });
  eleventyConfig.addFilter('number', (n) => new Intl.NumberFormat('en-US').format(n));
  eleventyConfig.addFilter('topicName', (slug) => topicNames.get(slug) ?? slug);
  eleventyConfig.addFilter('inTopic', (posts, slug) => posts.filter((p) => p.data.categories?.includes(slug)));
  eleventyConfig.addFilter('head', (arr, n) => arr.slice(0, n));
  eleventyConfig.addFilter('byYear', (posts) => {
    const years = new Map();
    for (const p of posts) {
      const y = p.date.getUTCFullYear();
      if (!years.has(y)) years.set(y, []);
      years.get(y).push(p);
    }
    return [...years].map(([year, items]) => ({ year, items }));
  });
  // Feed readers need absolute links.
  eleventyConfig.addFilter('absoluteUrls', (html, base) => html.replace(/(href|src)="\//g, `$1="${base}/`));

  eleventyConfig.addShortcode('heatmap', heatmap);

  return {
    dir: { input: 'src', includes: '_includes', data: '_data', output: '_site' },
    templateFormats: ['md', 'njk'],
    markdownTemplateEngine: false, // posts are plain Markdown: "{{" in a post is just text
    htmlTemplateEngine: 'njk',
  };
}

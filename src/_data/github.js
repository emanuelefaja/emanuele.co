// The last 365 days of GitHub contributions for the home page, across every
// repository (public and private): the same numbers github.com/emanuelefaja shows.
//
// In GitHub Actions this uses the GraphQL API with the built-in GITHUB_TOKEN.
// Locally it reads the public profile calendar (no token needed) and caches it
// for a few hours. If everything fails the graph is simply left off the page.

import { mkdir, readFile, writeFile } from 'node:fs/promises';

const USER = 'emanuelefaja';
const CACHE_FILE = '.cache/github-contributions.json';
const CACHE_HOURS = 6;
const HEADERS = { 'user-agent': 'emanuele.co site build' };

async function fromApi(token) {
  const query = `query($login: String!) {
    user(login: $login) { contributionsCollection { contributionCalendar {
      weeks { contributionDays { date contributionCount } }
    } } }
  }`;
  const res = await fetch('https://api.github.com/graphql', {
    method: 'POST',
    headers: { ...HEADERS, authorization: `bearer ${token}`, 'content-type': 'application/json' },
    body: JSON.stringify({ query, variables: { login: USER } }),
  });
  if (!res.ok) throw new Error(`GitHub API returned ${res.status}`);
  const json = await res.json();
  if (json.errors) throw new Error(json.errors.map((e) => e.message).join('; '));
  return json.data.user.contributionsCollection.contributionCalendar.weeks
    .flatMap((w) => w.contributionDays)
    .map((d) => ({ date: d.date, count: d.contributionCount }));
}

async function fromProfile() {
  const res = await fetch(`https://github.com/users/${USER}/contributions`, { headers: HEADERS });
  if (!res.ok) throw new Error(`profile calendar returned ${res.status}`);
  const html = await res.text();
  // <td data-date="2025-11-02" id="contribution-day-component-0-0" data-level="0" …>
  // <tool-tip for="contribution-day-component-0-0">3 contributions on November 2nd.</tool-tip>
  const counts = new Map();
  for (const [, id, text] of html.matchAll(/<tool-tip[^>]*\bfor="([^"]+)"[^>]*>([^<]*)<\/tool-tip>/g)) {
    const n = text.match(/^([\d,]+) contributions?/);
    counts.set(id, n ? Number(n[1].replace(/,/g, '')) : 0);
  }
  const days = [];
  for (const [tag, date] of html.matchAll(/<td\b[^>]*\bdata-date="(\d{4}-\d{2}-\d{2})"[^>]*>/g)) {
    const id = tag.match(/\bid="([^"]+)"/)?.[1];
    days.push({ date, count: counts.get(id) ?? 0 });
  }
  if (days.length < 300) throw new Error('could not read the profile calendar');
  return days.sort((a, b) => a.date.localeCompare(b.date));
}

function lastYear(days) {
  const recent = days.slice(-365);
  return { days: recent, total: recent.reduce((sum, d) => sum + d.count, 0) };
}

export default async function () {
  const local = !process.env.CI;
  if (local) {
    try {
      const cached = JSON.parse(await readFile(CACHE_FILE, 'utf8'));
      if (Date.now() - cached.fetchedAt < CACHE_HOURS * 3600_000) return lastYear(cached.days);
    } catch { /* no cache yet */ }
  }

  let days;
  try {
    days = process.env.GITHUB_TOKEN ? await fromApi(process.env.GITHUB_TOKEN) : await fromProfile();
  } catch (err) {
    console.warn(`[github] ${err.message}; trying the public profile instead`);
    try {
      days = await fromProfile();
    } catch (err2) {
      console.warn(`[github] ${err2.message}; leaving the activity graph out`);
      return null;
    }
  }

  if (local) {
    await mkdir('.cache', { recursive: true });
    await writeFile(CACHE_FILE, JSON.stringify({ fetchedAt: Date.now(), days }));
  }
  return lastYear(days);
}

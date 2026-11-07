// Renders a year of daily counts as a GitHub-style grid: one column per week,
// Sunday at the top. Plain SVG, no JavaScript; hovering a square shows its count.

const CELL = 10;
const GAP = 3;
const STEP = CELL + GAP;
const LEFT = 30; // room for weekday labels
const TOP = 16; // room for month labels
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const fmtDay = new Intl.DateTimeFormat('en-GB', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' });
const fmtNum = new Intl.NumberFormat('en-US');

export function heatmap(data) {
  if (!data?.days?.length) return '';
  const { days, total } = data;

  // Shade by quartiles of the active days, so a few very busy days
  // don't wash everything else out to the lightest colour.
  const active = days.map((d) => d.count).filter((c) => c > 0).sort((a, b) => a - b);
  const q = (p) => active[Math.min(active.length - 1, Math.floor(p * active.length))] ?? 0;
  const [q1, q2, q3] = [q(0.25), q(0.5), q(0.75)];
  const level = (c) => (c === 0 ? 0 : c <= q1 ? 1 : c <= q2 ? 2 : c <= q3 ? 3 : 4);

  const offset = new Date(`${days[0].date}T00:00:00Z`).getUTCDay();
  const columns = Math.ceil((days.length + offset) / 7);
  const width = LEFT + columns * STEP - GAP;
  const gridBottom = TOP + 7 * STEP - GAP;
  const height = gridBottom + 22;

  let cells = '';
  let months = '';
  let lastMonth = -1;
  let lastLabelCol = -10;

  days.forEach((d, i) => {
    const idx = i + offset;
    const col = Math.floor(idx / 7);
    const row = idx % 7;
    const date = new Date(`${d.date}T00:00:00Z`);

    // Label a column with its month when a new month starts in it.
    const month = date.getUTCMonth();
    if ((row === 0 || i === 0) && month !== lastMonth) {
      // Skip labels that would crowd the previous one or run off the right edge.
      if (col - lastLabelCol >= 3 && col <= columns - 3) {
        months += `<text x="${LEFT + col * STEP}" y="${TOP - 5}">${MONTHS[month]}</text>`;
        lastLabelCol = col;
      }
      lastMonth = month;
    }

    const label = `${d.count === 0 ? 'No' : fmtNum.format(d.count)} contribution${d.count === 1 ? '' : 's'} on ${fmtDay.format(date)}`;
    cells += `<rect x="${LEFT + col * STEP}" y="${TOP + row * STEP}" width="${CELL}" height="${CELL}" rx="2" class="h${level(d.count)}"><title>${label}</title></rect>`;
  });

  const weekdays = [[1, 'Mon'], [3, 'Wed'], [5, 'Fri']]
    .map(([row, name]) => `<text x="0" y="${TOP + row * STEP + CELL - 1}">${name}</text>`)
    .join('');

  // "Less ■■■■■ More" legend, bottom right.
  const legendX = width - 5 * STEP - 30;
  const legendY = gridBottom + 10;
  let legend = `<text x="${legendX - 28}" y="${legendY + CELL - 1}">Less</text>`;
  for (let l = 0; l <= 4; l++) legend += `<rect x="${legendX + l * STEP}" y="${legendY}" width="${CELL}" height="${CELL}" rx="2" class="h${l}"/>`;
  legend += `<text x="${legendX + 5 * STEP + 2}" y="${legendY + CELL - 1}">More</text>`;

  const summary = `${fmtNum.format(total)} GitHub contributions in the last year`;
  return `<figure class="activity">
<svg viewBox="0 0 ${width} ${height}" role="img" aria-label="${summary}">${months}${weekdays}${cells}${legend}</svg>
<figcaption><a href="https://github.com/emanuelefaja">${fmtNum.format(total)} contributions</a> on GitHub in the last year, across all repositories.</figcaption>
</figure>`;
}

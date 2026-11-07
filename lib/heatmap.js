// Renders a year of daily counts as a GitHub-style grid: one column per week,
// Sunday at the top. Plain HTML + CSS (no JavaScript): each square carries its
// label in data-tip, and style.css shows it as a tooltip on hover.

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const EDGE = 6; // columns this close to either end get their tooltip pinned inwards

// "Sat, 8 Nov 2025" (Intl's en-GB would say "Sept")
const fmtDay = (d) => `${WEEKDAYS[d.getUTCDay()]}, ${d.getUTCDate()} ${MONTHS[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
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

  // Blank squares before the first day, so it lands on the right weekday row.
  const offset = new Date(`${days[0].date}T00:00:00Z`).getUTCDay();
  const columns = Math.ceil((days.length + offset) / 7);

  let cells = '<i></i>'.repeat(offset);
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
        months += `<span style="grid-column:${col + 1}">${MONTHS[month]}</span>`;
        lastLabelCol = col;
      }
      lastMonth = month;
    }

    const tip = `${d.count === 0 ? 'No' : fmtNum.format(d.count)} contribution${d.count === 1 ? '' : 's'} on ${fmtDay(date)}`;
    const edge = col < EDGE ? ' tl' : col >= columns - EDGE ? ' tr' : '';
    cells += `<span class="h${level(d.count)}${edge}" data-tip="${tip}"></span>`;
  });

  const summary = `${fmtNum.format(total)} GitHub contributions in the last year`;
  const legend = [0, 1, 2, 3, 4].map((l) => `<i class="h${l}"></i>`).join('');
  return `<figure class="activity">
<div class="heatmap" style="--cols:${columns}" role="img" aria-label="${summary}">
<div class="months">${months}</div>
<div class="weekdays"><i></i><span>Mon</span><i></i><span>Wed</span><i></i><span>Fri</span><i></i></div>
<div class="cells">${cells}</div>
</div>
<figcaption><span><a href="https://github.com/emanuelefaja">${fmtNum.format(total)} contributions</a> on GitHub in the last year, across all repositories.</span><span class="legend" aria-hidden="true">Less ${legend} More</span></figcaption>
</figure>`;
}

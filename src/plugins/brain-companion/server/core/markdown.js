'use strict';

// Markdown views of the memory: the brief, the growth log and the kinds. A port of personal-brain's
// scripts/companion/recall.py (brief_md, growth_md, kinds_md); the text matches it.

const { KINDS } = require('./kinds');

const text = (v) => {
  if (Array.isArray(v)) return v.map(text).join('; ');
  if (v && typeof v === 'object') return JSON.stringify(v);
  return String(v);
};
const present = (v) => v !== null && v !== undefined && v !== '';

function line(r) {
  const extra = ['owner', 'format', 'youtube_id', 'judge_on', 'due', 'verdict']
    .filter((f) => r[f]).map((f) => `${f} ${r[f]}`);
  return `- \`${r.kind}/${r.key}\` [${r.status}] ${r.title}${extra.length ? ` (${extra.join(', ')})` : ''}`;
}

function briefMd(b) {
  const out = [`# Companion brief (${b.today})`];
  for (const [owner, label] of [['claude', 'Open threads: mine'], ['paul', "Open threads: Paul's"]]) {
    const items = b.threads[owner];
    out.push('', `## ${label} (${items.length})`, ...(items.length ? items.map(line) : ['- none']));
  }
  out.push('', '## Running experiments');
  out.push(...(b.experiments.length
    ? b.experiments.map((e) => line(e) + (e.due ? ' **due for judging**' : '')) : ['- none']));
  out.push('', '## This month');
  const m = b.month;
  out.push(m ? `- \`month/${m.key}\` [${m.status}] outcome: ${text(m.outcome)}, target ${text(m.target)}`
    + (present(m.actual) ? `, actual ${text(m.actual)}` : '') : '- none recorded');
  out.push('', `## Videos in flight (${b.videos_in_flight.length})`);
  out.push(...(b.videos_in_flight.length ? b.videos_in_flight.map(line) : ['- none']));
  if (b.standards.length) out.push('', '## Standards', ...b.standards.map((s) => `- ${s.change} (kept ${s.month})`));
  return out.join('\n');
}

function growthMd(months, experiments) {
  const kept = experiments.filter((e) => e.verdict === 'keep');
  const out = ['# CWP growth log', '', "Generated from the companion's memory (recall.py growth); change it there.",
    '', '## Standards', ''];
  out.push(...(kept.length ? kept.map((e) => `- ${e.change} (kept after ${e.month}: ${text(e.result || '')})`)
    : ['_Changes that held for a month and are now how every video is made. None yet._']));
  for (const m of months) {
    out.push('', `## ${m.key} [${m.status}]`, '');
    for (const [field, label] of [['last_month', 'Last month'], ['constraint', 'Constraint'], ['outcome', 'Outcome'],
      ['target', 'Target'], ['actual', 'Actual'], ['notes', 'Notes']]) {
      if (present(m[field])) out.push(`- **${label}:** ${text(m[field])}`);
    }
    if (m.inputs) {
      out.push('- **Inputs:**', ...(Array.isArray(m.inputs) ? m.inputs : [m.inputs]).map((i) => `  - ${text(i)}`));
    }
    for (const e of experiments.filter((x) => x.month === m.key)) {
      out.push(`- **One thing (${e.rung}), \`${e.key}\` [${e.status}]:** ${e.title}`);
      for (const field of ['hypothesis', 'change', 'metric', 'baseline', 'target', 'judge_on', 'result', 'verdict']) {
        if (present(e[field])) out.push(`  - ${field.replace(/_/g, ' ')}: ${text(e[field])}`);
      }
    }
  }
  return `${out.join('\n')}\n`;
}

function kindsMd() {
  const out = ['# Companion record kinds'];
  for (const [kind, spec] of Object.entries(KINDS)) {
    out.push('', `## ${kind}: ${spec.about}`,
      `- statuses: ${spec.statuses.join(', ')} (default ${spec.statuses[0]})`,
      `- required: ${spec.required.join(', ')}`,
      `- fields: ${['title', ...spec.fields, 'notes'].join(', ')}`,
      ...Object.entries(spec.enums).map(([f, v]) => `- ${f}: one of ${v.join(', ')}`));
    if (spec.dates.length) out.push(`- dates (YYYY-MM-DD): ${spec.dates.join(', ')}`);
  }
  return out.join('\n');
}

module.exports = { briefMd, growthMd, kindsMd, line };

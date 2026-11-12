'use strict';

// The memory's logic over a small repository interface, so it runs the same against Strapi's
// database (services/repo.js) and an in-memory store in the tests. A port of personal-brain's
// scripts/companion/store.py (plan_put, diff, apply_put, brief, search, history, export).
//
// A repository has: get(kind, key), all({kind, status}), save(record, isNew), addEvent(event),
// events({kind, key, limit}), findEvent(event), and optionally transaction(fn). Records are plain objects:
// {kind, key, title, status, ...fields, tags, created, updated}.

const { KINDS, CLOSED, RecordError, validate, kindSpec } = require('./kinds');

// One unit of work: the repository's transaction when it has one, so a record never changes
// without its event, and an import is all or nothing.
const atomically = (repo, fn) => (repo.transaction ? repo.transaction(fn) : fn());

const META = new Set(['kind', 'key', 'status', 'tags', 'created', 'updated']);
const now = () => new Date().toISOString().replace(/\.\d{3}Z$/, '+00:00');
const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);
const fieldsOf = (rec) => Object.fromEntries(Object.entries(rec || {}).filter(([k]) => !META.has(k)));

/** The plan for turning `before` (the stored record, or null) into `next`. */
function diff(before, next) {
  const old = Object.fromEntries(Object.entries(before || {}).filter(([k]) => k !== 'created' && k !== 'updated'));
  const keys = [...new Set([...Object.keys(old), ...Object.keys(next)])].sort();
  const changes = {};
  for (const k of keys) {
    if (k === 'kind' || k === 'key') continue;
    if (same(old[k], next[k])) continue;
    if (k === 'tags' && !before && !(next.tags || []).length) continue;
    changes[k] = [old[k] === undefined ? null : old[k], next[k] === undefined ? null : next[k]];
  }
  const action = before ? (Object.keys(changes).length ? 'update' : 'none') : 'create';
  return { action, kind: next.kind, key: next.key, changes, record: next };
}

/** What a put would change, validated, without writing. A field set to null or "" is removed. */
async function planPut(repo, { kind, key, fields = {}, tags, status }) {
  const spec = kindSpec(kind);
  const before = await repo.get(kind, key);
  const data = fieldsOf(before);
  for (const [name, value] of Object.entries(fields || {})) {
    if (value === null || value === undefined || value === '') delete data[name];
    else data[name] = value;
  }
  const newStatus = status || (before ? before.status : spec.statuses[0]);
  const newTags = [...new Set(tags != null ? tags : (before ? before.tags : []))].sort();
  if (kind === 'month' && !data.title) data.title = `Growth month ${key}`;
  validate(kind, key, data, newStatus);
  return diff(before, { kind, key, status: newStatus, ...data, tags: newTags });
}

/** Writes the record a plan holds, validated again and diffed against what is stored now, so a
 *  stale or hand-edited plan cannot slip past the checks. One event per change. */
async function applyPut(repo, plan, origin) {
  const rec = plan.record;
  validate(rec.kind, rec.key, fieldsOf(rec), rec.status);
  const before = await repo.get(rec.kind, rec.key);
  const fresh = diff(before, rec);
  if (fresh.action === 'none') return fresh;
  const stamp = now();
  await atomically(repo, async () => {
    await repo.save({ ...rec, created: before ? before.created : stamp, updated: stamp }, !before);
    await repo.addEvent({ kind: rec.kind, key: rec.key, at: stamp, action: fresh.action, change: fresh.changes,
      origin: origin || null });
  });
  return fresh;
}

/** Plan a put; with confirm, write it. The shape the MCP tool returns. */
async function put(repo, args, origin) {
  const plan = await planPut(repo, args);
  if (!args.confirm || plan.action === 'none') return { ...plan, written: false };
  await applyPut(repo, plan, origin);
  return { ...plan, written: true };
}

/** Close a record: a thread done or dropped, a decision superseded, an experiment judged. */
async function close(repo, { kind, key, status, note, fields, confirm }, origin) {
  kindSpec(kind);
  if (!(await repo.get(kind, key))) throw new RecordError(`no ${kind}/${key} to close`);
  const merged = { ...(fields || {}) };
  if (note) merged.notes = note;
  return put(repo, { kind, key, fields: merged, tags: null, status: status || CLOSED[kind], confirm }, origin);
}

/** Every term must match some word of the record's key, title, fields, tags or status, as a prefix. */
async function search(repo, terms, kind, limit = 20) {
  const words = (Array.isArray(terms) ? terms : [terms]).join(' ').toLowerCase().match(/[\w.-]+/g) || [];
  if (!words.length) return [];
  const rows = await repo.all({ kind });
  const scored = [];
  for (const r of rows) {
    const text = [r.key, r.title, r.status, ...(r.tags || []), ...Object.values(fieldsOf(r)).map((v) =>
      (typeof v === 'string' ? v : JSON.stringify(v)))].join(' ').toLowerCase();
    const found = text.match(/[\w.-]+/g) || [];
    // `fix-widget` is found by `fix-widget`, `fix` or `widget`.
    const tokens = [...found, ...found.flatMap((w) => (/[.-]/.test(w) ? w.split(/[.-]+/).filter(Boolean) : []))];
    if (words.every((w) => tokens.some((t) => t.startsWith(w)))) {
      const hits = words.reduce((n, w) => n + tokens.filter((t) => t.startsWith(w)).length, 0);
      scored.push([hits, r]);
    }
  }
  return scored.sort((a, b) => b[0] - a[0]).slice(0, limit).map(([, r]) => r);
}

async function list(repo, { kind, status, limit = 200 } = {}) {
  return (await repo.all({ kind, status })).slice(0, limit);
}

async function show(repo, kind, key) {
  kindSpec(kind);
  const r = await repo.get(kind, key);
  if (!r) throw new RecordError(`no ${kind}/${key}`);
  return { ...r, history: await repo.events({ kind, key, limit: 30 }) };
}

/** What a session should know first: open threads, the running experiment, the month, videos in flight. */
async function brief(repo, today = new Date().toISOString().slice(0, 10)) {
  const threads = await repo.all({ kind: 'thread', status: 'open' });
  const running = (await repo.all({ kind: 'experiment', status: 'running' }))
    .map((e) => ({ ...e, due: Boolean(e.judge_on) && e.judge_on <= today }));
  const months = (await repo.all({ kind: 'month' })).filter((m) => m.key <= today.slice(0, 7));
  const inFlight = (await repo.all({ kind: 'video' })).filter((v) => v.status !== 'public');
  const judged = await repo.all({ kind: 'experiment', status: 'judged' });
  return {
    today,
    threads: { claude: threads.filter((t) => t.owner === 'claude'), paul: threads.filter((t) => t.owner === 'paul') },
    experiments: running,
    month: months.length ? months[months.length - 1] : null,
    videos_in_flight: inFlight,
    standards: judged.filter((e) => e.verdict === 'keep'),
  };
}

async function exportAll(repo) {
  return { exported: now(), records: await repo.all({}), events: await repo.events({ limit: 1000000 }) };
}

/** Bring in a personal-brain `recall.py export`: records it lacks are created, records that differ
 *  are replaced by the export's version, and events it lacks are added, oldest first so history reads
 *  newest first afterwards. Everything is checked before the first write, and a confirmed import is
 *  one transaction: all of it or none. Running it twice changes nothing. Without confirm it only counts. */
async function importExport(repo, data, { confirm = false } = {}) {
  if (!data || !Array.isArray(data.records) || !Array.isArray(data.events)) {
    throw new RecordError('an export holds "records" and "events" lists (recall.py export)');
  }
  const records = data.records.map((raw, i) => {
    const fields = fieldsOf(raw);
    try {
      validate(raw.kind, raw.key, fields, raw.status);
    } catch (err) {
      throw new RecordError(`record ${i + 1} (${raw.kind}/${raw.key}): ${err.message}; nothing was imported`);
    }
    return { raw, next: { kind: raw.kind, key: raw.key, status: raw.status, ...fields, tags: [...(raw.tags || [])].sort() } };
  });
  const keys = new Set(records.map((r) => `${r.raw.kind}/${r.raw.key}`));
  const events = data.events.map((e, i) => {
    const ok = KINDS[e.kind] && typeof e.key === 'string' && typeof e.at === 'string' && typeof e.action === 'string';
    if (!ok) throw new RecordError(`event ${i + 1} lacks kind, key, at or action; nothing was imported`);
    return { i, event: { kind: e.kind, key: e.key, at: e.at, action: e.action, change: e.change || {}, origin: e.origin || 'import' } };
  });
  for (const { event } of events) {
    if (!keys.has(`${event.kind}/${event.key}`) && !(await repo.get(event.kind, event.key))) {
      throw new RecordError(`an event for ${event.kind}/${event.key} has no record; nothing was imported`);
    }
  }
  // The export lists events newest first; insert oldest first (by time, then reverse export order).
  events.sort((a, b) => (a.event.at === b.event.at ? b.i - a.i : (a.event.at < b.event.at ? -1 : 1)));

  const counts = { records: { create: 0, update: 0, same: 0 }, events: { add: 0, same: 0 } };
  const plan = [];
  for (const { raw, next } of records) {
    const before = await repo.get(raw.kind, raw.key);
    const d = diff(before, next);
    if (d.action === 'none') { counts.records.same += 1; continue; }
    counts.records[d.action] += 1;
    plan.push(() => repo.save({ ...next, created: raw.created || now(), updated: raw.updated || now() }, !before));
  }
  for (const { event } of events) {
    if (await repo.findEvent(event)) { counts.events.same += 1; continue; }
    counts.events.add += 1;
    plan.push(() => repo.addEvent(event));
  }
  if (confirm && plan.length) {
    await atomically(repo, async () => { for (const step of plan) await step(); });
  }
  return { ...counts, written: Boolean(confirm) };
}

module.exports = { KINDS, diff, planPut, applyPut, put, close, search, list, show, brief, exportAll, importExport, now };

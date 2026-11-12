'use strict';

// Unit tests for the memory's logic, against an in-memory repository. Every record here is made up.
// Run: node --test src/plugins/brain-companion/test/*.test.js

const test = require('node:test');
const assert = require('node:assert/strict');
const memory = require('../server/core/memory');
const { briefMd, growthMd, kindsMd } = require('../server/core/markdown');
const { RecordError } = require('../server/core/kinds');

function memRepo() {
  const records = new Map();
  const log = [];
  const sameEvent = (a, b) => a.kind === b.kind && a.key === b.key && a.at === b.at && a.action === b.action
    && JSON.stringify(a.change) === JSON.stringify(b.change);
  return {
    records, log,
    async get(kind, key) { const r = records.get(`${kind}/${key}`); return r ? structuredClone(r) : null; },
    async all({ kind, status } = {}) {
      return [...records.values()].filter((r) => (!kind || r.kind === kind) && (!status || r.status === status))
        .sort((a, b) => (a.kind + a.key).localeCompare(b.kind + b.key)).map((r) => structuredClone(r));
    },
    async save(rec) { records.set(`${rec.kind}/${rec.key}`, structuredClone(rec)); },
    async addEvent(e) { log.push(structuredClone(e)); },
    async events({ kind, key, limit = 30 } = {}) {
      return log.filter((e) => (!kind || e.kind === kind) && (!key || e.key === key)).reverse().slice(0, limit);
    },
    async findEvent(e) { return log.some((x) => sameEvent(x, e)); },
  };
}

test('put plans without confirm and writes with it, one event per change', async () => {
  const repo = memRepo();
  const plan = await memory.put(repo, { kind: 'thread', key: 'fix-the-widget', fields: { title: 'Fix the widget', owner: 'claude' } });
  assert.equal(plan.action, 'create');
  assert.equal(plan.written, false);
  assert.equal(repo.records.size, 0);
  const done = await memory.put(repo, { kind: 'thread', key: 'fix-the-widget', fields: { title: 'Fix the widget', owner: 'claude' }, confirm: true }, 'mac-a');
  assert.equal(done.written, true);
  assert.equal((await repo.get('thread', 'fix-the-widget')).status, 'open');
  assert.deepEqual(repo.log.map((e) => [e.action, e.origin]), [['create', 'mac-a']]);
});

test('put merges fields, removes one set to null, and a no-op writes nothing', async () => {
  const repo = memRepo();
  await memory.put(repo, { kind: 'thread', key: 't1', fields: { title: 'T', owner: 'paul', why: 'because' }, confirm: true });
  const upd = await memory.put(repo, { kind: 'thread', key: 't1', fields: { why: null, due: '2026-01-02' }, confirm: true });
  assert.equal(upd.action, 'update');
  assert.deepEqual(upd.changes, { due: [null, '2026-01-02'], why: ['because', null] });
  const r = await repo.get('thread', 't1');
  assert.equal(r.why, undefined);
  const again = await memory.put(repo, { kind: 'thread', key: 't1', fields: { due: '2026-01-02' }, confirm: true });
  assert.equal(again.action, 'none');
  assert.equal(repo.log.length, 2);
});

test('validation refuses what store.py refuses', async () => {
  const repo = memRepo();
  const bad = [
    { kind: 'nope', key: 'a', fields: {} },
    { kind: 'thread', key: '-bad', fields: { title: 'T', owner: 'paul' } },
    { kind: 'thread', key: 'a', fields: { title: 'T' } },
    { kind: 'thread', key: 'a', fields: { title: 'T', owner: 'bob' } },
    { kind: 'thread', key: 'a', fields: { title: 'T', owner: 'paul', colour: 'red' } },
    { kind: 'thread', key: 'a', fields: { title: 'T', owner: 'paul', due: 'tomorrow' } },
    { kind: 'thread', key: 'a', fields: { title: 'T', owner: 'paul' }, status: 'closed' },
    { kind: 'month', key: '2026-13', fields: { outcome: 'x', target: 1 } },
    { kind: 'experiment', key: 'e', fields: { title: 'E', month: '2026-1', rung: 'ship', hypothesis: 'h', change: 'c', metric: 'm' } },
    { kind: 'experiment', key: 'e', fields: { title: 'E', month: '2026-01', rung: 'ship', hypothesis: 'h', change: 'c', metric: 'm' }, status: 'judged' },
    { kind: 'decision', key: 'd', fields: { title: 'D', why: 'w' }, status: 'superseded' },
  ];
  for (const args of bad) {
    await assert.rejects(memory.put(repo, { ...args, confirm: true }), RecordError, JSON.stringify(args));
  }
  assert.equal(repo.records.size, 0);
  const month = await memory.put(repo, { kind: 'month', key: '2026-01', fields: { outcome: 'subs', target: 10 }, confirm: true });
  assert.equal(month.record.title, 'Growth month 2026-01');
});

test('close uses the kind default status and refuses a missing record', async () => {
  const repo = memRepo();
  await assert.rejects(memory.close(repo, { kind: 'thread', key: 'none', confirm: true }), /no thread\/none to close/);
  await memory.put(repo, { kind: 'thread', key: 'x', fields: { title: 'X', owner: 'claude' }, confirm: true });
  const closed = await memory.close(repo, { kind: 'thread', key: 'x', note: 'did it', confirm: true });
  assert.equal(closed.record.status, 'done');
  assert.equal((await repo.get('thread', 'x')).notes, 'did it');
});

test('search matches every term as a prefix; brief and markdown read the records', async () => {
  const repo = memRepo();
  await memory.put(repo, { kind: 'video', key: 'demo-video', fields: { title: 'Demo build video', format: 'long' }, status: 'unlisted', confirm: true });
  await memory.put(repo, { kind: 'thread', key: 'ask-paul', fields: { title: 'Ask about the demo', owner: 'paul' }, confirm: true });
  await memory.put(repo, { kind: 'experiment', key: '2026-01-x', fields: { title: 'Try X', month: '2026-01', rung: 'hook', hypothesis: 'h', change: 'c', metric: 'm', judge_on: '2026-02-01' }, confirm: true });
  assert.deepEqual((await memory.search(repo, 'dem buil')).map((r) => r.key), ['demo-video']);
  assert.equal((await memory.search(repo, 'demo', 'thread')).length, 1);
  const b = await memory.brief(repo, '2026-02-03');
  assert.equal(b.videos_in_flight.length, 1);
  assert.equal(b.experiments[0].due, true);
  const md = briefMd(b);
  assert.match(md, /## Open threads: Paul's \(1\)/);
  assert.match(md, /\*\*due for judging\*\*/);
  assert.match(growthMd([], await repo.all({ kind: 'experiment' })), /# CWP growth log/);
  assert.match(kindsMd(), /## experiment: /);
  const shown = await memory.show(repo, 'video', 'demo-video');
  assert.equal(shown.history.length, 1);
});

test('import brings in an export once; a second run changes nothing', async () => {
  const source = memRepo();
  await memory.put(source, { kind: 'decision', key: 'use-light', fields: { title: 'Light thumbnails', why: 'they stand out' }, confirm: true });
  await memory.put(source, { kind: 'thread', key: 'later', fields: { title: 'Later', owner: 'claude' }, confirm: true });
  await memory.close(source, { kind: 'thread', key: 'later', confirm: true });
  const exported = JSON.parse(JSON.stringify(await memory.exportAll(source)));
  const target = memRepo();
  const dry = await memory.importExport(target, exported);
  assert.deepEqual([dry.records.create, dry.events.add, dry.written], [2, 3, false]);
  assert.equal(target.records.size, 0);
  const first = await memory.importExport(target, exported, { confirm: true });
  assert.deepEqual([first.records.create, first.events.add], [2, 3]);
  assert.equal((await target.get('thread', 'later')).status, 'done');
  assert.equal((await target.get('thread', 'later')).created, (await source.get('thread', 'later')).created);
  const second = await memory.importExport(target, exported, { confirm: true });
  assert.deepEqual([second.records.same, second.records.create, second.records.update, second.events.add], [2, 0, 0, 0]);
  await assert.rejects(memory.importExport(target, { records: 'x' }), RecordError);
});

'use strict';

// The record kinds, their statuses, fields and checks. A port of personal-brain's
// scripts/companion/store.py (KINDS, validate); keep the two in step.

const DATE = /^\d{4}-\d{2}-\d{2}$/;
const MONTH = /^\d{4}-(0[1-9]|1[0-2])$/;
const KEY = /^[A-Za-z0-9][A-Za-z0-9._-]{0,79}$/;
const RUNGS = ['ship', 'click', 'hook', 'hold', 'convert'];

// Each kind: its statuses (the first is the default), required and allowed fields, enum and date
// fields. Every kind also takes `title` and `notes`.
const KINDS = {
  thread: {
    about: 'an open loose end: something to do, check or answer, and who owns it',
    statuses: ['open', 'done', 'dropped'],
    required: ['title', 'owner'],
    fields: ['owner', 'why', 'where', 'due'],
    enums: { owner: ['paul', 'claude'] },
    dates: ['due'],
  },
  decision: {
    about: 'a decision and why it was made, so it is not reopened by accident',
    statuses: ['active', 'superseded'],
    required: ['title', 'why'],
    fields: ['why', 'alternatives', 'scope', 'superseded_by', 'decided_on'],
    enums: {},
    dates: ['decided_on'],
  },
  video: {
    about: 'one video on its way from stream to public: a stream, a long-form section or a Short',
    statuses: ['planned', 'cut', 'packaged', 'unlisted', 'scheduled', 'public'],
    required: ['title', 'format'],
    fields: ['format', 'youtube_id', 'stream', 'section', 'parent', 'published', 'files'],
    enums: { format: ['stream', 'long', 'short'] },
    dates: ['stream', 'published'],
  },
  month: {
    about: "one month of the growth loop: its outcome goal, input goals and how it went",
    statuses: ['drafted', 'agreed', 'scored'],
    required: ['outcome', 'target'],
    fields: ['outcome', 'target', 'actual', 'inputs', 'constraint', 'last_month', 'agreed_on'],
    enums: { constraint: RUNGS },
    dates: ['agreed_on'],
  },
  experiment: {
    about: 'the one thing changed in a month, as a hypothesis judged at the next review',
    statuses: ['running', 'judged'],
    required: ['title', 'month', 'rung', 'hypothesis', 'change', 'metric'],
    fields: ['month', 'rung', 'hypothesis', 'change', 'metric', 'baseline', 'target', 'judge_on',
      'result', 'verdict'],
    enums: { rung: RUNGS, verdict: ['keep', 'extend', 'drop'] },
    dates: ['judge_on'],
  },
};

// The status companion_close sets when none is given.
const CLOSED = { thread: 'done', decision: 'superseded', video: 'public', month: 'scored', experiment: 'judged' };

class RecordError extends Error {
  constructor(message) {
    super(message);
    this.name = 'RecordError';
  }
}

const isEmpty = (v) => v === null || v === undefined || v === '' || (Array.isArray(v) && v.length === 0);
const repr = (v) => (typeof v === 'string' ? `'${v}'` : JSON.stringify(v));

function kindSpec(kind) {
  const spec = KINDS[kind];
  if (!spec) throw new RecordError(`unknown kind ${repr(kind)}; kinds: ${Object.keys(KINDS).join(', ')}`);
  return spec;
}

/** Throws a RecordError when a record does not fit its kind. `data` is every field but kind, key,
 *  status and tags. */
function validate(kind, key, data, status) {
  const spec = kindSpec(kind);
  if (kind === 'month') {
    if (!MONTH.test(key)) throw new RecordError(`a month's key is YYYY-MM, not ${repr(key)}`);
  } else if (!KEY.test(key)) {
    throw new RecordError(`key ${repr(key)}: letters, digits, '.', '_' or '-', starting with a letter or digit, `
      + 'at most 80 characters');
  }
  const allowed = new Set([...spec.fields, 'title', 'notes']);
  const unknown = Object.keys(data).filter((f) => !allowed.has(f)).sort();
  if (unknown.length) {
    throw new RecordError(`${kind} has no field ${unknown.join(', ')}; its fields: ${[...allowed].sort().join(', ')}`);
  }
  const missing = spec.required.filter((f) => isEmpty(data[f]));
  if (missing.length) throw new RecordError(`${kind} ${key} needs ${missing.join(', ')}`);
  if (!spec.statuses.includes(status)) {
    throw new RecordError(`${kind} status is one of ${spec.statuses.join(', ')}, not ${repr(status)}`);
  }
  for (const [field, values] of Object.entries(spec.enums)) {
    if (field in data && !values.includes(data[field])) {
      throw new RecordError(`${kind} ${field} is one of ${values.join(', ')}, not ${repr(data[field])}`);
    }
  }
  for (const field of spec.dates) {
    if (field in data && !DATE.test(String(data[field]))) {
      throw new RecordError(`${kind} ${field} is a date, YYYY-MM-DD, not ${repr(data[field])}`);
    }
  }
  if (kind === 'experiment') {
    if (!MONTH.test(String(data.month))) throw new RecordError(`experiment month is YYYY-MM, not ${repr(data.month)}`);
    if (status === 'judged' && !data.verdict) {
      throw new RecordError('a judged experiment needs its verdict: keep, extend or drop');
    }
  }
  if (kind === 'decision' && status === 'superseded' && !data.superseded_by) {
    throw new RecordError('a superseded decision names the decision that replaced it (superseded_by)');
  }
}

module.exports = { KINDS, CLOSED, RUNGS, RecordError, validate, kindSpec, isEmpty };

'use strict';

// The memory's repository over Strapi's database (see core/memory.js for the interface). Records
// keep their fields in `payload` and their status in `state`, because Strapi 5 reserves `status`.

const RECORD = 'plugin::brain-companion.record';
const EVENT = 'plugin::brain-companion.event';
const MAX = 100000;

const toRecord = (row) => (row ? {
  kind: row.kind,
  key: row.key,
  title: row.title,
  status: row.state,
  ...(row.payload || {}),
  tags: row.tags || [],
  created: row.created,
  updated: row.updated,
} : null);

const toEvent = (row) => ({ at: row.at, action: row.action, kind: row.kind, key: row.key, change: row.change || {},
  origin: row.origin || null });

const sameChange = (a, b) => JSON.stringify(a || {}) === JSON.stringify(b || {});

module.exports = ({ strapi }) => {
  const records = () => strapi.db.query(RECORD);
  const events = () => strapi.db.query(EVENT);
  return {
    async get(kind, key) {
      return toRecord(await records().findOne({ where: { uid: `${kind}/${key}` } }));
    },
    async all({ kind, status } = {}) {
      const where = {};
      if (kind) where.kind = kind;
      if (status) where.state = status;
      const rows = await records().findMany({ where, orderBy: [{ kind: 'asc' }, { key: 'asc' }], limit: MAX });
      return rows.map(toRecord);
    },
    async save(rec, isNew) {
      const { kind, key, title, status, tags, created, updated, ...payload } = rec;
      const data = { uid: `${kind}/${key}`, kind, key, title, state: status, payload, tags: tags || [], created, updated };
      if (isNew) await records().create({ data });
      else await records().update({ where: { uid: data.uid }, data });
    },
    async addEvent(e) {
      await events().create({ data: { kind: e.kind, key: e.key, at: e.at, action: e.action, change: e.change || {},
        origin: e.origin || null } });
    },
    async events({ kind, key, limit = 30 } = {}) {
      const where = {};
      if (kind) where.kind = kind;
      if (key) where.key = key;
      const rows = await events().findMany({ where, orderBy: { id: 'desc' }, limit });
      return rows.map(toEvent);
    },
    async findEvent(e) {
      const rows = await events().findMany({ where: { kind: e.kind, key: e.key, at: e.at, action: e.action } });
      return rows.some((r) => sameChange(r.change, e.change));
    },
  };
};

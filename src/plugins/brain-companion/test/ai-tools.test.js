'use strict';

// The chat's view of the memory: which tools it gets, their permissions, and that a call reaches
// the repo service. No Strapi runs; the strapi object is a stand-in.

const test = require('node:test');
const assert = require('node:assert/strict');
const aiTools = require('../server/services/ai-tools');

function fakeStrapi(repo) {
  return { plugin: (id) => ({ service: (name) => (id === 'brain-companion' && name === 'repo' ? repo : null) }) };
}

test('the chat gets the read and record tools, never export or import', () => {
  const names = aiTools({ strapi: fakeStrapi({}) }).getTools().map((t) => t.name);
  assert.deepEqual(names, ['brief', 'search', 'list', 'show', 'growth', 'kinds', 'put', 'close']);
});

test('each tool carries its schema and the MCP tool\'s permission', () => {
  for (const t of aiTools({ strapi: fakeStrapi({}) }).getTools()) {
    assert.equal(t.action, `plugin::brain-companion.tool.${t.name}`);
    assert.equal(typeof t.schema.parse, 'function');
    assert.equal(typeof t.execute, 'function');
  }
});

test('a call runs against the repo service of the strapi it is given', async () => {
  const repo = { all: async () => [{ kind: 'thread', key: 'made-up', title: 'A made-up thread', status: 'open' }] };
  const list = aiTools({ strapi: fakeStrapi({}) }).getTools().find((t) => t.name === 'list');
  const out = await list.execute({ kind: 'thread' }, fakeStrapi(repo));
  assert.equal(out.records.length, 1);
  assert.equal(out.records[0].key, 'made-up');
});

test('the source has a label for the Tools menu', () => {
  assert.equal(aiTools({ strapi: fakeStrapi({}) }).getMeta().label, 'Brain companion');
});

test('the descriptions say who paul is and that a status is recorded, not live', () => {
  const tools = aiTools({ strapi: fakeStrapi({}) }).getTools();
  const brief = tools.find((t) => t.name === 'brief').description;
  assert.match(brief, /owner "paul" is Paul, the person you are talking to/);
  assert.match(brief, /not a live check/);
  for (const t of tools) assert.match(t.description, /owner "paul" is (Paul, )?the person you are talking to/);
});

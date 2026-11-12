'use strict';

// The memory's MCP tools on Strapi's built-in /mcp server, registered the way strapi-plugin-yt-kb
// does: one admin permission per tool (plugin::brain-companion.tool.<name>), so a token is granted
// exactly the tools it needs. Names match personal-brain's local companion server, with a
// `companion__` prefix: companion__brief, companion__put and so on.

const { z } = require('@strapi/utils');
const memory = require('../core/memory');
const { briefMd, growthMd, kindsMd } = require('../core/markdown');
const { KINDS } = require('../core/kinds');

const PLUGIN_ID = 'brain-companion';
const PREFIX = 'companion__';
const MAX_WIRE_BYTES = 950000;

const kind = z.enum(Object.keys(KINDS));
const confirm = z.boolean().optional()
  .describe('false (default): return the change and write nothing. true: write it.');
const origin = z.string().optional().describe('which machine or agent writes, e.g. "studio-mac"; kept on the event');
const fields = z.record(z.string(), z.any()).optional().describe('fields to set; null or "" removes one');

const TOOLS = [
  { name: 'brief', writes: false,
    input: z.object({ today: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional()
      .describe("the caller's local date, YYYY-MM-DD; the server's UTC date when left out") }),
    description: "What to know first: open threads (Claude's and Paul's), running experiments (and whether one is "
      + "due for judging), this month's growth goals, videos not yet public, and the Standards.",
    run: async (repo, a) => briefMd(await memory.brief(repo, a.today)) },
  { name: 'search', writes: false, input: z.object({ terms: z.string(), kind: kind.optional() }),
    description: "Search every record's key, title and fields (each word must match, as a prefix).",
    run: async (repo, a) => ({ records: await memory.search(repo, a.terms, a.kind) }) },
  { name: 'list', writes: false, input: z.object({ kind: kind.optional(), status: z.string().optional() }),
    description: 'Records of one kind and/or status, e.g. kind=thread status=open.',
    run: async (repo, a) => ({ records: await memory.list(repo, a) }) },
  { name: 'show', writes: false, input: z.object({ kind, key: z.string() }),
    description: 'One record in full, with its change history.',
    run: async (repo, a) => memory.show(repo, a.kind, a.key) },
  { name: 'growth', writes: false, input: z.object({}),
    description: 'The CWP growth log as markdown: the Standards, then every month with its goals and experiment.',
    run: async (repo) => growthMd(await repo.all({ kind: 'month' }), await repo.all({ kind: 'experiment' })) },
  { name: 'kinds', writes: false, input: z.object({}),
    description: 'Every record kind with its statuses, required fields, allowed fields and enum values.',
    run: async () => kindsMd() },
  { name: 'put', writes: true,
    input: z.object({ kind, key: z.string().describe('a slug; YYYY-MM for a month; the YouTube id for a published video'),
      fields, status: z.string().optional(), tags: z.array(z.string()).optional().describe('replaces every tag'),
      confirm, origin }),
    description: 'Create a record or merge fields into it, checked against its kind (see companion__kinds). '
      + 'Without confirm=true it only returns the change.',
    run: async (repo, a) => memory.put(repo, a, a.origin) },
  { name: 'close', writes: true,
    input: z.object({ kind, key: z.string(),
      status: z.string().optional().describe('default: done, superseded, public, scored or judged, by kind'),
      note: z.string().optional().describe("sets the record's notes"),
      fields: fields.describe('other fields to set on closing, e.g. verdict'), confirm, origin }),
    description: 'Close a record: a thread done or dropped, a decision superseded, an experiment judged. '
      + 'Without confirm=true it only returns the change.',
    run: async (repo, a) => memory.close(repo, a, a.origin) },
  { name: 'export', writes: false, input: z.object({}),
    description: 'Every record and event as JSON, in the same shape as personal-brain recall.py export: a backup.',
    run: async (repo) => memory.exportAll(repo) },
  { name: 'import', writes: true,
    input: z.object({ data: z.object({ records: z.array(z.any()), events: z.array(z.any()) }).passthrough()
      .describe('the JSON of personal-brain recall.py export'), confirm }),
    description: "Bring in a personal-brain recall.py export: creates missing records, replaces ones that differ "
      + 'with the export\'s version, adds missing events. Running it twice changes nothing. Without confirm=true '
      + 'it only counts.',
    run: async (repo, a) => memory.importExport(repo, a.data, { confirm: a.confirm }) },
];

const kebab = (s) => s.replace(/_/g, '-');
const actionUid = (name) => `tool.${kebab(name)}`;
const actionId = (name) => `plugin::${PLUGIN_ID}.${actionUid(name)}`;

async function registerPermissions(strapi) {
  await strapi.service('admin::permission').actionProvider.registerMany(TOOLS.map((t) => ({
    section: 'plugins',
    pluginName: PLUGIN_ID,
    subCategory: 'AI tools',
    displayName: `Companion ${t.name}${t.writes ? ' (writes)' : ''}`,
    uid: actionUid(t.name),
  })));
}

function wrap(result) {
  const text = typeof result === 'string' ? result : JSON.stringify(result);
  if (Buffer.byteLength(text, 'utf8') * 2 + 2048 > MAX_WIRE_BYTES) {
    const err = { error: 'RESULT_TOO_LARGE', message: 'Over the ~1 MB MCP response limit; narrow the call (kind, status).' };
    return { content: [{ type: 'text', text: JSON.stringify(err) }], structuredContent: err };
  }
  const structuredContent = typeof result === 'string' ? { markdown: result }
    : (result && typeof result === 'object' && !Array.isArray(result) ? result : { result });
  return { content: [{ type: 'text', text }], structuredContent };
}

async function registerTools(strapi) {
  await registerPermissions(strapi);
  const mcp = strapi.ai && strapi.ai.mcp;
  if (!mcp || !mcp.isEnabled()) {
    strapi.log.info('[brain-companion] the built-in MCP server is off; tools not registered (permissions kept).');
    return;
  }
  const output = z.object({}).catchall(z.any());
  let count = 0;
  for (const tool of TOOLS) {
    try {
      mcp.registerTool({
        name: PREFIX + tool.name,
        title: `Brain companion: ${tool.name}`,
        description: tool.description,
        resolveInputSchema: () => tool.input,
        resolveOutputSchema: () => output,
        auth: { policies: [{ action: actionId(tool.name) }] },
        createHandler: (s) => async ({ args }) => {
          const repo = s.plugin(PLUGIN_ID).service('repo');
          try {
            return wrap(await tool.run(repo, args || {}));
          } catch (err) {
            s.log.warn(`[brain-companion] ${PREFIX}${tool.name} failed: ${err.message}`);
            throw err;
          }
        },
      });
      count += 1;
    } catch (err) {
      strapi.log.warn(`[brain-companion] skipped MCP tool ${PREFIX}${tool.name}: ${err.message}`);
    }
  }
  strapi.log.info(`[brain-companion] registered ${count} of ${TOOLS.length} MCP tool(s)`);
}

module.exports = { TOOLS, registerTools, actionId, PREFIX };

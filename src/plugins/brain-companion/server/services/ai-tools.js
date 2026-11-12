'use strict';

// The memory's tools in the admin's AI chat (strapi-plugin-tanstack-ai). That plugin looks for a
// service named `ai-tools` on every plugin and offers its tools as brain-companion__<name>, each
// gated by the same admin permission as the MCP tool (plugin::brain-companion.tool.<name>).
// `export` and `import` stay MCP-only: one returns the whole store, the other replaces records in
// bulk, and neither belongs in a chat turn.

const { TOOLS, actionId } = require('../mcp/tools');

const PLUGIN_ID = 'brain-companion';
const IN_CHAT = ['brief', 'search', 'list', 'show', 'growth', 'kinds', 'put', 'close'];

// What the chat model can't know from the records alone. A test of the chat (2026-11-12) called
// Paul a third person ("nudge Paul") and stated a video as unlisted that had been public for a day.
const CONTEXT = 'These records are the working log of personal-brain, written by Claude Code while it works with '
  + 'Paul. owner "paul" is Paul, the person you are talking to: speak to him as "you". owner "claude" is that '
  + 'coding assistant, not you. A status is the last one recorded, not a live check (you cannot reach YouTube): '
  + 'when it matters, say it is the recorded status and when it was recorded (companion show has the dates).';
const SHORT = 'owner "paul" is the person you are talking to; a status is as last recorded, not live.';
const describe = (t) => `${t.description} ${t.name === 'brief' ? CONTEXT : SHORT}`;

module.exports = ({ strapi }) => ({
  getTools() {
    return TOOLS.filter((t) => IN_CHAT.includes(t.name)).map((t) => ({
      name: t.name,
      description: describe(t),
      schema: t.input,
      action: actionId(t.name),
      execute: async (args, s) => t.run((s || strapi).plugin(PLUGIN_ID).service('repo'), args || {}),
    }));
  },
  getMeta() {
    return {
      label: 'Brain companion',
      description: "personal-brain's shared memory: open threads, decisions, videos, growth months and experiments",
    };
  },
});

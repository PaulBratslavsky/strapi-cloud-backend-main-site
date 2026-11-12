'use strict';

// The memory's tools in the admin's AI chat (strapi-plugin-tanstack-ai). That plugin looks for a
// service named `ai-tools` on every plugin and offers its tools as brain-companion__<name>, each
// gated by the same admin permission as the MCP tool (plugin::brain-companion.tool.<name>).
// `export` and `import` stay MCP-only: one returns the whole store, the other replaces records in
// bulk, and neither belongs in a chat turn.

const { TOOLS, actionId } = require('../mcp/tools');

const PLUGIN_ID = 'brain-companion';
const IN_CHAT = ['brief', 'search', 'list', 'show', 'growth', 'kinds', 'put', 'close'];

module.exports = ({ strapi }) => ({
  getTools() {
    return TOOLS.filter((t) => IN_CHAT.includes(t.name)).map((t) => ({
      name: t.name,
      description: t.description,
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

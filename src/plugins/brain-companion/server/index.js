'use strict';

const contentTypes = require('./content-types');
const repo = require('./services/repo');
const aiTools = require('./services/ai-tools');
const { registerTools } = require('./mcp/tools');

module.exports = {
  register: async ({ strapi }) => {
    await registerTools(strapi);
  },
  bootstrap() {},
  contentTypes,
  services: { repo, 'ai-tools': aiTools },
};

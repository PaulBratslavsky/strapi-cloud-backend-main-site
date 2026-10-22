/**
 * Migration: carry ai-chat tool grants over to tanstack-ai
 *
 * strapi-plugin-tanstack-ai replaces strapi-plugin-ai-chat and provides the
 * same MCP tools under the same names, but Strapi keys every permission to
 * the plugin that registered it: `plugin::ai-chat.tool.search-content`
 * becomes `plugin::tanstack-ai.tool.search-content`. Without this, Strapi's
 * permission cleanup deletes the ai-chat rows on the first boot without
 * ai-chat, and every role and admin token loses these tools until someone
 * re-ticks them.
 *
 * Renaming the action in place keeps each row's role or token link, so every
 * holder keeps exactly what it had. Migrations run before that cleanup.
 *
 * `plugin::ai-chat.tool.guide` has no tanstack-ai equivalent; it is left for
 * Strapi to delete.
 *
 * Plain CommonJS on purpose: Strapi only discovers .js/.sql files in
 * database/migrations (TypeScript migrations need
 * `database.settings.useTypescriptMigrations`, which this app does not set).
 */

const TOOLS = [
  'list-content-types',
  'search-content',
  'aggregate-content',
  'find-one-content',
  'create-content',
  'update-content',
  'upload-media',
  'send-email',
];

const FROM = 'plugin::ai-chat.tool.';
const TO = 'plugin::tanstack-ai.tool.';

async function up(knex) {
  if (!(await knex.schema.hasTable('admin_permissions'))) {
    console.log('[migration] admin_permissions does not exist yet, nothing to carry over.');
    return;
  }

  let moved = 0;
  for (const tool of TOOLS) {
    moved += await knex('admin_permissions')
      .where('action', FROM + tool)
      .update({ action: TO + tool });
  }

  console.log(`[migration] carried ${moved} ai-chat tool grant(s) over to tanstack-ai.`);
}

module.exports = { up };

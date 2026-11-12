/**
 * Mints an admin-kind API token that can call the brain-companion MCP tools and nothing else.
 * The built-in /mcp server only accepts admin-kind tokens; Settings > API Tokens mints content
 * tokens, which it rejects. Run from the app's root, with the app's Node version:
 *
 *   node src/plugins/brain-companion/scripts/mint-token.js            # every companion tool
 *   node src/plugins/brain-companion/scripts/mint-token.js --read-only  # no put, close or import
 *
 * Prints ACCESS_KEY=... on stdout (for the brain's .env); everything else goes to stderr.
 * Revoke a token in the admin: Settings > Admin tokens (or delete its row).
 */
const { createStrapi, compileStrapi } = require('@strapi/strapi');
const { TOOLS, actionId } = require('../server/mcp/tools');

async function main() {
  const readOnly = process.argv.includes('--read-only');
  const actions = TOOLS.filter((t) => !readOnly || !t.writes).map((t) => actionId(t.name));
  const app = await createStrapi(await compileStrapi()).load();
  try {
    const user = (await app.db.query('admin::user').findMany({ populate: ['roles'] }))[0];
    if (!user) throw new Error('No admin user found. Create one at /admin first.');
    const known = new Set(app.service('admin::permission').actionProvider.values().map((a) => a.actionId));
    const unknown = actions.filter((a) => !known.has(a));
    if (unknown.length) throw new Error(`Unknown action(s): ${unknown.join(', ')}; is the plugin enabled?`);
    const name = `brain-companion${readOnly ? '-read' : ''}-${Date.now()}`;
    // adminPermissions go through create(), so Strapi checks them against the owner's own
    // permissions; a token can never get more than the admin who owns it.
    const token = await app.service('admin::api-token-admin').create({
      kind: 'admin', name, description: 'personal-brain companion memory over MCP', lifespan: null,
      adminUserOwner: user.id,
      adminPermissions: actions.map((action) => ({ action, subject: null, properties: {}, conditions: [] })),
    }, user);
    process.stdout.write(`ACCESS_KEY=${token.accessKey}\n`);
    console.error(`minted ${name} (id ${token.id}) with ${actions.length} action(s)`);
  } finally {
    await app.destroy();
  }
}

main().catch((err) => {
  console.error('MINT FAILED:', err.message);
  process.exit(1);
});

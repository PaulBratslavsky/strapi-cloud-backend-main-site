export default ({ env }) => ({
  host: env('HOST', '0.0.0.0'),
  port: env.int('PORT', 1337),
  app: {
    keys: env.array('APP_KEYS'),
  },
  // Strapi's built-in MCP server (5.47+). Serves /mcp over streamable HTTP,
  // authenticated with Admin API tokens. strapi-plugin-ai-sdk registers its
  // tools onto this during bootstrap; without `enabled: true` that
  // registration is a no-op and no ai-sdk tools are exposed.
  mcp: {
    enabled: env.bool('MCP_ENABLED', true),
  },
});

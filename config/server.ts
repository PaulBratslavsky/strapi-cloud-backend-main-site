export default ({ env }) => ({
  host: env('HOST', '0.0.0.0'),
  port: env.int('PORT', 1337),
  app: {
    keys: env.array('APP_KEYS'),
  },
  // Strapi's built-in MCP server (5.47+). Serves /mcp over streamable HTTP,
  // authenticated with Admin API tokens. yt-kb registers its tools in
  // register(); tanstack-ai and Strapi's content-manager in bootstrap().
  mcp: {
    enabled: env.bool('MCP_ENABLED', true),
  },
});

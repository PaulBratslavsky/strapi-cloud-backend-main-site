export default [
  "strapi::logger",
  "strapi::errors",
  {
    name: "strapi::security",
    config: {
      contentSecurityPolicy: {
        directives: {
          "script-src": ["'self'", "'unsafe-inline'"],
          "frame-ancestors": [
            "'self'",
            "https://deserving-harmony-9f5ca04daf.strapiapp.com",
          ],
        },
      },
    },
  },
  {
    name: "strapi::cors",
    config: {
      origin: ["https://deserving-harmony-9f5ca04daf.strapiapp.com"],
      headers: ["Content-Type", "Authorization", "Accept", "mcp-session-id"],
      expose: ["mcp-session-id", "WWW-Authenticate"],
    },
  },
  "strapi::poweredBy",
  "strapi::query",
  {
    // yt-kb videos carry embeddings and a search index; one record can pass
    // the default 1 MB when copying content in (copy-content.mjs).
    name: "strapi::body",
    config: { jsonLimit: "10mb" },
  },
  "strapi::session",
  "strapi::favicon",
  "strapi::public",
];

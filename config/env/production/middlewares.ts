export default [
  "strapi::logger",
  "strapi::errors",
  {
    name: "strapi::security",
    config: {
      contentSecurityPolicy: {
        directives: {
          "script-src": ["'self'", "'unsafe-inline'"],
          "frame-ancestors": ["*"],
        },
      },
    },
  },
  {
    name: "strapi::cors",
    config: {
      origin: "*",
      headers: ["Content-Type", "Authorization", "Accept", "mcp-session-id"],
      expose: ["mcp-session-id"],
    },
  },
  "strapi::poweredBy",
  "strapi::query",
  "strapi::body",
  "strapi::session",
  "strapi::favicon",
  "strapi::public",
];

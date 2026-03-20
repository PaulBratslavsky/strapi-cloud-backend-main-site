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
            "https://my-music-site-ib5f.vercel.app",
            "http://localhost:3000",
          ],
        },
      },
    },
  },
  {
    name: "strapi::cors",
    config: {
      origin: [
        "https://deserving-harmony-9f5ca04daf.strapiapp.com",
        "https://my-music-site-ib5f.vercel.app",
        "http://localhost:3000",
      ],
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

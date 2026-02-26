export default [
  'strapi::logger',
  'strapi::errors',
  {
    name: 'strapi::security',
    config: {
      contentSecurityPolicy: {
        useDefaults: true,
        directives: {
          'connect-src': ["'self'", 'https:', 'blob:'],
          'img-src': ["'self'", 'data:', 'blob:', 'market-assets.strapi.io'],
          'script-src': ["'self'", "'unsafe-inline'"],
          'frame-ancestors': [
            "'self'",
            'https://deserving-harmony-9f5ca04daf.strapiapp.com',
          ],
        },
      },
    },
  },
  {
    name: 'strapi::cors',
    config: {
      origin: ['https://deserving-harmony-9f5ca04daf.strapiapp.com'],
    },
  },
  'strapi::poweredBy',
  'strapi::query',
  'strapi::body',
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
];

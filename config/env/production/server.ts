export default ({ env }) => ({
  // Strapi Cloud sits behind a TLS proxy, so the request origin Strapi sees is
  // not the public one. strapi-oauth-mcp-manager builds its OAuth discovery
  // and sign-in URLs from server.url, so it must be the public https address.
  url: env("PUBLIC_URL", "https://deserving-harmony-9f5ca04daf.strapiapp.com"),
  proxy: true,
});

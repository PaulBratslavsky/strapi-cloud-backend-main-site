export default ({ env }) => ({
  "ai-utils": {
    config: {
      openAIApiKey: process.env.OPENAI_API_KEY,
    },
  },
  "yt-transcript-strapi-plugin": {
    enabled: true,
  },
  "strapi-plugin-lms": {
    enabled: true
  },
  "strapi-content-mcp": {
    enabled: true,
    config: {
      logLevel: "debug",
    },
  },
});

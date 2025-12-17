export default ({ env }) => ({
  "ai-utils": {
    config: {
      openAIApiKey: process.env.OPENAI_API_KEY,
    },
  },
  "yt-transcript-strapi-plugin": {
    enabled: true,
    config: {
      openAIApiKey: env("OPENAI_API_KEY"),
      model: env("OPEN_AI_MODEL", "gpt-4o-mini"),
      temp: env("OPEN_AI_TEMPERATURE", 0.7),
      maxTokens: env("OPEN_AI_MAX_TOKENS", 1000),
    },
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

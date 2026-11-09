export default ({ env }) => ({
  "tanstack-ai": {
    enabled: true,
    config: {
      chat: {
        provider: "anthropic",
        apiKey: env("ANTHROPIC_API_KEY"),
        model: env("ANTHROPIC_MODEL", "claude-sonnet-5"),
        systemPrompt: env(
          "AI_SYSTEM_PROMPT",
          "You are a helpful AI assistant for this Strapi CMS. Answer questions clearly and concisely. Use your available tools to look up content when needed.",
        ),
      },
    },
  },
  "yt-kb": {
    enabled: true,
    config: {
      proxyUrl: env("PROXY_URL", ""), // same variable youtube-transcripts used
      mcp: true,
      import: env.bool("YT_KB_IMPORT", false), // true only while copying content in
      backfillMetadata: false,
    },
  },
  "strapi-plugin-lms": {
    enabled: true,
  },

  "strapi-builder-mcp": {
    enabled: true,
  },
  "strapi-plugin-music-manager": {
    enabled: true,
  },
  "strapi-oauth-mcp-manager": {
    enabled: true,
  },
});

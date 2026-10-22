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
  "youtube-transcripts": {
    enabled: true,
    config: {
      proxyUrl: env("PROXY_URL"),
      chunkSizeSeconds: 300, // Chunk size for pagination (5 minutes)
      previewLength: 500, // Preview length in characters
      maxFullTranscriptLength: 50000, // Auto-load full transcript if under this (~12K tokens)
      searchSegmentSeconds: 30, // Segment size for BM25 search
    },
  },
  // "ai-sdk-yt-embeddings": {
  //   enabled: false,
  //   config: {
  //     openAIApiKey: env("OPENAI_API_KEY"),
  //     neonConnectionString: env("NEON_CONNECTION_STRING"),
  //     embeddingModel: env("EMBEDDING_MODEL", "text-embedding-3-small"),
  //   },
  // },
  "strapi-plugin-lms": {
    enabled: true,
  },
  'strapi-builder-mcp': {
    enabled: true,
  },
  'strapi-plugin-music-manager': {
    enabled: true,
  },
  // OAuth sign-in for the built-in /mcp server. To load the working copy in
  // ../plugins/strapi-oauth-mcp-manager instead of the npm release, set
  // OAUTH_MCP_LOCAL_PATH in your local .env (run `npm run build` there after
  // changes; Strapi loads its dist/).
  'strapi-oauth-mcp-manager': {
    enabled: true,
    ...(env("OAUTH_MCP_LOCAL_PATH")
      ? { resolve: env("OAUTH_MCP_LOCAL_PATH") }
      : {}),
  },
});

export default ({ env }) => ({
  "ai-sdk": {
    enabled: true,
    config: {
      anthropicApiKey: env("ANTHROPIC_API_KEY"),
      chatModel: env("ANTHROPIC_MODEL", "claude-sonnet-4-20250514"),
      systemPrompt: env(
        "AI_SYSTEM_PROMPT",
        "You are a helpful AI assistant for this Strapi CMS. Answer questions clearly and concisely. Use your available tools to look up content when needed.",
      ),
      publicChat: {
        chatModel: "claude-haiku-4-5-20251001",
        allowedContentTypes: [],
      },
    },
  },
  "ai-sdk-yt-transcripts": {
    enabled: true,
    config: {
      proxyUrl: env("PROXY_URL"),
      chunkSizeSeconds: 300, // Chunk size for pagination (5 minutes)
      previewLength: 500, // Preview length in characters
      maxFullTranscriptLength: 50000, // Auto-load full transcript if under this (~12K tokens)
      searchSegmentSeconds: 30, // Segment size for BM25 search
    },
  },
  "ai-sdk-yt-embeddings": {
    enabled: true,
    config: {
      openAIApiKey: env("OPENAI_API_KEY"),
      neonConnectionString: env("NEON_CONNECTION_STRING"),
      embeddingModel: env("EMBEDDING_MODEL", "text-embedding-3-small"),
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
});

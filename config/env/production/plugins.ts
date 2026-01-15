export default ({ env }) => ({
  "yt-transcript-strapi-plugin": {
    enabled: true,
    config: {
      proxyUrl: env("PROXY_URL"),
      chunkSizeSeconds: 300, // Chunk size for pagination (5 minutes)
      previewLength: 500, // Preview length in characters
      maxFullTranscriptLength: 50000, // Auto-load full transcript if under this (~12K tokens)
      searchSegmentSeconds: 30, // Segment size for BM25 search
    },
  },
  "strapi-plugin-lms": {
    enabled: true,
  },
  "strapi-content-mcp": {
    enabled: true,
    config: {
      logLevel: "debug",
    },
  },
  "strapi-content-embeddings": {
    enabled: true,
    config: {
      openAIApiKey: env("OPENAI_API_KEY"),
      neonConnectionString: env("NEON_CONNECTION_STRING"),
      embeddingModel: env("EMBEDDING_MODEL", "text-embedding-3-small"),
    },
  },
  "strapi-builder-ai-mcp": {
    enabled: true,
    config: {
      strapiUrl: env(
        "STRAPI_URL",
        "https://deserving-harmony-9f5ca04daf.strapiapp.com"
      ),
      mediaUrl: env(
        "MEDIA_URL",
        "https://deserving-harmony-9f5ca04daf.media.strapiapp.com"
      ),
      apiPrefix: "/api",
    },
  },
});

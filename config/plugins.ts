export default ({ env }) => ({
  "ai-utils": {
    config: {
      openAIApiKey: process.env.OPENAI_API_KEY,
    },
  },
  "yt-transcript-strapi-plugin": {
    enabled: true,
    config: {
      proxyUrl: env("PROXY_URL"),
      chunkSizeSeconds: 300,          // Chunk size for pagination (5 minutes)
      previewLength: 500,             // Preview length in characters
      maxFullTranscriptLength: 50000, // Auto-load full transcript if under this (~12K tokens)
      searchSegmentSeconds: 30,       // Segment size for BM25 search
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
});

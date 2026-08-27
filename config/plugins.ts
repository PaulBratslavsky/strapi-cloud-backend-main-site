export default ({ env }) => ({
  "ai-chat": {
    enabled: true,
    // Load a working copy of the plugin instead of the published package.
    //
    // Gated on an env var rather than hardcoded, because this file ships to
    // production: a `resolve` path pointing outside the repo exists only on a
    // dev machine and would fail the deployed boot. Set AI_SDK_LOCAL_PATH in
    // your local .env (gitignored) to link; leave it unset anywhere else and
    // the npm release is used.
    ...(env("AI_SDK_LOCAL_PATH")
      ? { resolve: env("AI_SDK_LOCAL_PATH") }
      : {}),
    config: {
      anthropicApiKey: env("ANTHROPIC_API_KEY"),
      chatModel: env("ANTHROPIC_MODEL", "claude-sonnet-5"),
      systemPrompt: env(
        "AI_SYSTEM_PROMPT",
        "You are a helpful AI assistant for this Strapi CMS. Answer questions clearly and concisely. Use your available tools to look up content when needed.",
      ),
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
});

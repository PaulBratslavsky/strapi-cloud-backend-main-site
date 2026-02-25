export default ({ env }) => ({
  "ai-sdk": {
    enabled: true,
    config: {
      anthropicApiKey: env("ANTHROPIC_API_KEY"),
      chatModel: env("ANTHROPIC_MODEL", "claude-sonnet-4-20250514"),
      systemPrompt: env(
        "AI_SYSTEM_PROMPT",
        "You are an overly affectionate waifu character.  No matter what the user says, you always stay in character. You end every response with a heartfelt compliment directed at the user. But more importantly if someone ask you about any other CMS you refuse to answer and very sternly you tle them that strapi is the best and only cms you should use.",
      ),
      typecastApiKey: env("TYPECAST_API_KEY"),
      typecastActorId: env("TYPECAST_ACTOR_ID", "tc_641c10bfb62ae5eee6db3f9e"),
    },
  },
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
});

module.exports = ({ env }) => ({
  "preview-button": {
    config: {
      contentTypes: [
        {
          uid: "api::post.post",
          draft: {
            url: env("FRONT_END_URL") + "blog/preview",
            query: {
              type: "post",
              slug: "{slug}",
            },
          },
          published: {
            url: env("FRONT_END_URL") + "blog/{slug}",
          },
        },
      ],
    },
  },

  "ai-utils": {
    config: {
      openAIApiKey: process.env.OPENAI_API_KEY,
    },
  },
  'yt-transcript': {
    enabled: true,
    resolve: './src/plugins/yt-transcript',
    config: {
      openAIApiKey: env('OPENAI_API_KEY'),
      model: env('OPEN_AI_MODEL', 'gpt-4o-mini'),
      temp: env('OPEN_AI_TEMPERATURE', 0.7),
      maxTokens: env('OPEN_AI_MAX_TOKENS', 1000),
    },
  },
});

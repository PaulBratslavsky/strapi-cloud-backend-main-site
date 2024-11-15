module.exports = ({ env }) => ({
  "preview-button": {
    config: {
      contentTypes: [
        {
          uid: "api::post.post",
          draft: {
            url: "http://localhost:3000/blog/preview",
            query: {
              type: "post",
              slug: "{slug}",
            },
          },
          published: {
            url: "http://localhost:3000/blog/{slug}",
          },
        },
      ],
    },
  },
  "ai-utils": {
    config: {
      openAIApiKey: env("OPENAI_API_KEY"),
    },
  },
  utilai: {
    enabled: true,
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
  "get-strapi-schema": {
    enabled: true,
  },
});

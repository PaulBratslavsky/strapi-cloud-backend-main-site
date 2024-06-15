module.exports = ({ env }) => ({
  'preview-button': {
    config: {
      contentTypes: [
        {
          uid: 'api::post.post',
          draft: {
            url: env("FRONT_END_URL") + "blog/preview",
            query: {
              type: 'post',
              slug: '{slug}',
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
});
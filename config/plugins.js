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
      openAIApiKey: process.env.OPENAI_API_KEY,
    },
  },
  'utilai': {
      enabled: true,
  },
  "get-strapi-schema": {
    enabled: true,
  },
});

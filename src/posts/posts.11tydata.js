// Every post lives at /<file-name>/, the same addresses it had on WordPress.
export default {
  layout: 'post.njk',
  eleventyComputed: {
    permalink: (data) => `/${data.page.fileSlug}/`,
  },
};

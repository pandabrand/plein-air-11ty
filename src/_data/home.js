const { request, gql } = require('graphql-request');

module.exports = async function() {
  const pageQuery = gql`
      query HomeQuery($slug: String!) {
        mediaItemBy(slug: $slug) {
          mediaItemUrl
          slug
          altText
          sourceUrl
        }
      }
  `;

  const variables = { slug: 'fullpan' };
  const endpoint = process.env.GRAPHQL_URL;

  try {
    const data = await request(endpoint, pageQuery, variables);

    return data.mediaItemBy;

  } catch (error) {
    throw new Error( error );
  }
}

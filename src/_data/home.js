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
  const imageKitEndpoint = 'https://ik.imagekit.io/studiofwww/';
  const spacesUrl = 'https://cc-backs.nyc3.digitaloceanspaces.com/';

  try {
    const data = await request(endpoint, pageQuery, variables);

    const imagePath = data.mediaItemBy.mediaItemUrl.substring(spacesUrl.length);
    data.mediaItemBy['imageKitUrl'] = imageKitEndpoint + imagePath;
    return data.mediaItemBy;

  } catch (error) {
    throw new Error( error );
  }
}

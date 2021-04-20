const { request, gql } = require('graphql-request');
const ImageKit = require("imagekit");

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
  const imageKitEndpoint = process.env.IK_ENDPOINT;
  const spacesUrl = process.env.DO_ENDPOINT;

  var imagekit = new ImageKit({
      publicKey : process.env.IK_PUBLIC_KEY,
      privateKey : process.env.IK_PRIVATE_KEY,
      urlEndpoint : imageKitEndpoint
  });

  try {
    const data = await request(endpoint, pageQuery, variables);

    const imagePath = data.mediaItemBy.mediaItemUrl.substring(spacesUrl.length);
    data.mediaItemBy['imageKitUrl'] = imagekit.url({
      path: imagePath,
      endpoint: imageKitEndpoint,
    });

    return data.mediaItemBy;

  } catch (error) {
    throw new Error( error );
  }
}

const { request, gql } = require('graphql-request');
const ImageKit = require("imagekit");

module.exports = async function() {
  const paintingsQuery = gql`
      query PaintingsQuery($search: String!) {
        mediaItems(where: {search: $search}, first: 25) {
          nodes {
            sourceUrl
            description
            altText
          }
        }
      }
  `;

  const variables = { search: 'Baum Painting' };
  const endpoint = process.env.GRAPHQL_URL;
  const imageKitEndpoint = process.env.IK_ENDPOINT;
  const spacesUrl = process.env.DO_ENDPOINT;

  var imagekit = new ImageKit({
      publicKey : process.env.IK_PUBLIC_KEY,
      privateKey : process.env.IK_PRIVATE_KEY,
      urlEndpoint : imageKitEndpoint
  });

  try {
    const data = await request(endpoint, paintingsQuery, variables);

    data.mediaItems.nodes.map((node) => {
      const imagePath = node.sourceUrl.substring(spacesUrl.length);
      node['imageKitUrl'] = imagekit.url({
        path: imagePath,
        endpoint: imageKitEndpoint,
      });
    })

    return data.mediaItems.nodes;

  } catch (error) {
    throw new Error( error );
  }
}

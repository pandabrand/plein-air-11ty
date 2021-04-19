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
  const imageKitEndpoint = 'https://ik.imagekit.io/studiofwww/';
  const spacesUrl = 'https://cc-backs.nyc3.digitaloceanspaces.com/';

  var imagekit = new ImageKit({
      publicKey : "public_PMrFGDYsz71y7jDwgaNYL8fQcNo=",
      privateKey : "private_Xi9yHcVl8f3CgpvW1zNl7zPtf/0=",
      urlEndpoint : "https://ik.imagekit.io/studiofwww"
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

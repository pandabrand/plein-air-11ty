const { request, gql } = require('graphql-request');
const ImageKit = require("imagekit");

module.exports = async function() {
  const postQuery = gql`
      query PostsQuery {
        posts(first: 100, where: { orderby: { field: TITLE, order: ASC } }) {
          nodes {
            title
            paintingDates {
              paintDates {
                date
                location {
                  name
                }
              }
            }
          }
        }
      }
  `;
  const endpoint = process.env.GRAPHQL_URL;
  const imageKitEndpoint = process.env.IK_ENDPOINT;

  var imagekit = new ImageKit({
      publicKey : process.env.IK_PUBLIC_KEY,
      privateKey : process.env.IK_PRIVATE_KEY,
      urlEndpoint : imageKitEndpoint
  });

  try {
    const data = await request(endpoint, postQuery);
    let archiveNumInt = 1;

    data.posts.nodes.forEach((node) => {
      node.paintingDates.paintDates.forEach((paintDate) => {
        archiveNumInt = (10 === archiveNumInt) ? 1 : archiveNumInt;
        const imagePath = `https://ik.imagekit.io/studiofwww/2021/04/archive-${archiveNumInt}@2x.png`;
        paintDate['panImage'] = imagePath;
        archiveNumInt++;
      })
    })

    return data.posts.nodes;

  } catch (error) {
    throw new Error( error );
  }
}

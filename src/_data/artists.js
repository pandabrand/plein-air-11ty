const { request, gql } = require('graphql-request');
const ImageKit = require("imagekit");

let archiveNumInt = 0;

function archiveNum() {
  archiveNumInt++
  if(archiveNumInt == 10) {
    archiveNumInt = 1;
  }
  return archiveNumInt;
}

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
    data.posts.nodes.map((node) => {
      const imageNum = archiveNum();
      node['panImage'] = imagekit.url({
        path: `2021/04/archive-${imageNum}@2x.png`,
        endpoint: imageKitEndpoint,
      });
    })

    return data.posts.nodes;

  } catch (error) {
    throw new Error( error );
  }
}

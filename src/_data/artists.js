const { request, gql } = require('graphql-request');

function randomColor() {
  const numValues = 3;
  let whileNumber = 0;
  let rgbArray = [];
  while (whileNumber < numValues) {
    rgbArray[whileNumber] = Math.floor(Math.random() * (255 - 0) + 0);
    whileNumber++;
  }
  return rgbArray.join(', ')
}

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

  try {
    const data = await request(endpoint, postQuery);
    data.posts.nodes.map((node) => {
      const imageNum = archiveNum();
      node['panImage'] = `https://cc-backs.nyc3.digitaloceanspaces.com/cms-plein-air/2021/04/archive-${imageNum}@2x.png`;
    })

    return data.posts.nodes;

  } catch (error) {
    throw new Error( error );
  }
}

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

module.exports = async function() {
  const postQuery = gql`
      query PostsQuery {
        posts(first: 100, where: { orderby: { field: TITLE, order: ASC } }) {
          nodes {
            title
            paintingDates {
              paintDates {
                date
              }
            }
          }
        }
      }
  `;

  try {
    const data = await request(process.env.GRAPHQL_URL, postQuery);

    data.posts.nodes.map((node) => {
      node['color'] = randomColor();
    })

    return data.posts.nodes;

  } catch (error) {
    throw new Error( error );
  }
}

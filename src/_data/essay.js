const { request, gql } = require('graphql-request');

module.exports = async function() {
  const pageQuery = gql`
      query EssayQuery($id: ID!) {
        page(id: $id, idType: URI) {
          content
        }
      }
  `;

  const variables = { id: 'essay' };
  const endpoint = process.env.GRAPHQL_URL;

  try {
    const data = await request(endpoint, pageQuery, variables);

    return data.page.content;

  } catch (error) {
    throw new Error( error );
  }
}

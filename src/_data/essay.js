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

  try {
    const data = await request(process.env.GRAPHQL_URL, pageQuery, variables);

    return data.page.content;

  } catch (error) {
    throw new Error( error );
  }
}
